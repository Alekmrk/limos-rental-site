import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import usePaymentFlowCookieSuppression from "../../hooks/usePaymentFlowCookieSuppression";
import useUTMTracking from "../../hooks/useUTMTracking";
import useAnalytics from "../../hooks/useAnalytics";

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.elitewaylimo.ch'
  : 'http://localhost:3001';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { handleInput } = useContext(ReservationContext);
  
  // Restore UTM tracking after payment redirect
  const { restoreUTMs, hasUTMs, utmData } = useUTMTracking({
    autoCapture: false, // We'll manually restore UTMs
    debug: true,
    storeInContext: true
  });

  // Initialize analytics for conversion tracking
  const { trackBookingConversion, trackPaymentError } = useAnalytics({
    autoTrackPageViews: false // We'll track manually after data is loaded
  });
  
  // Suppress cookie consent during payment success flow
  const { clearSuppression } = usePaymentFlowCookieSuppression(true, 45000); // 45 seconds

  useEffect(() => {
    const verifySession = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        
        if (!sessionId) {
          console.error('No session ID found');
          clearSuppression();
          navigate('/payment');
          return;
        }

        // Restore UTMs first - they might be in URL or storage
        console.log('🔄 [PaymentSuccess] Restoring UTMs after payment...');
        const restoredUTMs = restoreUTMs();
        
        if (restoredUTMs?.hasUTMs) {
          console.log('✅ [PaymentSuccess] UTMs restored successfully:', restoredUTMs);
          
          // Also check URL for UTM parameters (backup)
          const utmFromURL = {
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign'),
            utm_term: urlParams.get('utm_term'),
            utm_content: urlParams.get('utm_content')
          };
          
          // If URL has UTMs and storage doesn't, use URL UTMs
          if (!restoredUTMs.hasUTMs && Object.values(utmFromURL).some(v => v)) {
            console.log('📥 [PaymentSuccess] Using UTMs from URL as backup:', utmFromURL);
            await handleInput({
              target: {
                name: 'utmData',
                value: {
                  source: utmFromURL.utm_source,
                  medium: utmFromURL.utm_medium,
                  campaign: utmFromURL.utm_campaign,
                  term: utmFromURL.utm_term,
                  content: utmFromURL.utm_content,
                  hasUTMs: Object.values(utmFromURL).some(v => v),
                  timestamp: new Date().toISOString()
                }
              }
            });
          }
        }

        const response = await fetch(`${API_BASE_URL}/api/stripe/verify-session/${sessionId}`);
        const data = await response.json();

        if (!data.success) {
          console.error('Session verification failed:', data.error);
          clearSuppression();
          navigate('/payment');
          return;
        }

        // Update the entire reservation info with the data from backend
        const { reservationInfo } = data;
        for (const key in reservationInfo) {
          await handleInput({
            target: {
              name: key,
              value: reservationInfo[key]
            }
          });
        }

        // Track successful conversion with UTM attribution
        console.log('🎉 [PaymentSuccess] Tracking conversion...'); 
        try {
          // Get the current UTM data (either restored or from URL)
          const currentUTMs = restoredUTMs?.hasUTMs ? restoredUTMs : 
                             (hasUTMs ? utmData : null);
          
          // Track the conversion with GA4 and GTM
          trackBookingConversion(reservationInfo);
          
          console.log('✅ [PaymentSuccess] Conversion tracked successfully', {
            transactionId: reservationInfo.paymentDetails?.reference,
            amount: reservationInfo.paymentDetails?.amount,
            utms: currentUTMs
          });
        } catch (conversionError) {
          console.error('❌ [PaymentSuccess] Conversion tracking failed:', conversionError);
        }

        // Navigate to thank you page (suppression will be cleared by the hook timeout)
        navigate('/thankyou', { replace: true });
      } catch (error) {
        console.error('Error verifying payment:', error);
        clearSuppression();
        navigate('/payment');
      }
    };

    verifySession();
  }, [navigate, handleInput, clearSuppression, restoreUTMs, trackBookingConversion]);

  return (
    <div className="container-default mt-28 text-center">
      <h1 className="text-4xl font-bold mb-4">Processing Your Payment</h1>
      <p className="text-lg mb-4">Please wait while we confirm your payment...</p>
      <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto"></div>
    </div>
  );
};

export default PaymentSuccess;
