import React, { useContext, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Button";
import ReservationContext from "../../contexts/ReservationContext";
import usePaymentFlowCookieSuppression from "../../hooks/usePaymentFlowCookieSuppression";
import useUTMTracking from "../../hooks/useUTMTracking";

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.elitewaylimo.ch'
  : 'http://localhost:3001';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { reservationInfo, handleInput } = useContext(ReservationContext);
  const hasSetRetryFlag = useRef(false);
  const hasRestoredSession = useRef(false);
  const hasSentCancelEmail = useRef(false);
  
  // Restore UTM tracking after payment redirect
  const { restoreUTMs, hasUTMs, utmData } = useUTMTracking({
    autoCapture: false, // We'll manually restore UTMs
    debug: true,
    storeInContext: true
  });
  
  // Suppress cookie consent during payment cancel flow
  const { clearSuppression } = usePaymentFlowCookieSuppression(true, 30000); // 30 seconds

  // Send cancellation notification to admin
  const sendCancellationNotification = async (reservationData) => {
    if (hasSentCancelEmail.current) return;
    hasSentCancelEmail.current = true;

    try {
      console.log('📧 Sending payment cancellation notification to admin');
      
      const response = await fetch(`${API_BASE_URL}/api/email/payment-cancelled`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationInfo: reservationData
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Payment cancellation notification sent to admin');
      } else {
        console.error('❌ Failed to send cancellation notification:', result.error);
      }
    } catch (error) {
      console.error('❌ Error sending cancellation notification:', error);
    }
  };

  // Restore booking data from Stripe session when coming from payment cancel
  useEffect(() => {
    if (hasRestoredSession.current) return;
    hasRestoredSession.current = true;

    const restoreFromStripeSession = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        console.log('⚠️ No session ID found in URL - user may have navigated directly');
        // Still send notification if we have reservation data
        if (reservationInfo?.email) {
          await sendCancellationNotification(reservationInfo);
        }
        // Clear suppression if no session to restore
        clearSuppression();
        return;
      }

      try {
        // First restore UTMs - critical for tracking cancelled conversions
        console.log('🔄 [PaymentCancel] Restoring UTMs after payment cancellation...');
        const restoredUTMs = restoreUTMs();
        
        if (restoredUTMs?.hasUTMs) {
          console.log('✅ [PaymentCancel] UTMs restored successfully:', restoredUTMs);
        } else {
          // Check URL for UTM parameters as backup
          const urlParams = new URLSearchParams(window.location.search);
          const utmFromURL = {
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign'),
            utm_term: urlParams.get('utm_term'),
            utm_content: urlParams.get('utm_content')
          };
          
          if (Object.values(utmFromURL).some(v => v)) {
            console.log('📥 [PaymentCancel] Using UTMs from URL as backup:', utmFromURL);
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

        console.log('🔄 Retrieving canceled session data from Stripe:', sessionId);
        
        const response = await fetch(`${API_BASE_URL}/api/stripe/canceled-session/${sessionId}`);
        const data = await response.json();

        if (data.success && data.reservationInfo) {
          console.log('📥 Restoring booking data from Stripe session');
          
          // Restore all the reservation data from Stripe
          const { reservationInfo: stripeReservation } = data;
          
          // Update each field in the context
          for (const [key, value] of Object.entries(stripeReservation)) {
            if (value !== undefined && value !== null && value !== '') {
              await handleInput({
                target: {
                  name: key,
                  value: value
                }
              });
            }
          }
          
          console.log('✅ Booking data restored successfully from Stripe');
          
          // Send cancellation notification with restored data
          await sendCancellationNotification(stripeReservation);
        } else {
          console.log('⚠️ Could not retrieve session data from Stripe');
          // Still send notification if we have reservation data
          if (reservationInfo?.email) {
            await sendCancellationNotification(reservationInfo);
          }
        }
      } catch (error) {
        console.error('❌ Error retrieving session from Stripe:', error);
        // Still send notification if we have reservation data
        if (reservationInfo?.email) {
          await sendCancellationNotification(reservationInfo);
        }
      } finally {
        // Clear suppression after restoration attempt
        setTimeout(() => {
          clearSuppression();
        }, 2000); // Short delay to ensure page is fully loaded
      }
    };

    restoreFromStripeSession();

    // Set retry flag after attempting session restoration
    if (!hasSetRetryFlag.current) {
      hasSetRetryFlag.current = true;
      handleInput({
        target: {
          name: 'isRetryingPayment',
          value: true
        }
      });
    }
  }, [searchParams, handleInput, reservationInfo, clearSuppression]);

  const handleRetry = () => {
    // Clear any previous payment details and errors
    handleInput({
      target: {
        name: 'paymentDetails',
        value: null
      }
    });
    navigate('/payment');
  };

  const handleContact = () => {
    window.location.href = 'mailto:info@elitewaylimo.ch?subject=Payment%20Issue%20-%20Order%20' + 
      (reservationInfo?.orderReference || 'Unknown');
  };

  return (
    <div className="container-default mt-28">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-900/20 rounded-lg p-8 border border-red-500/50">
          <h1 className="text-4xl font-bold mb-6">Payment Not Completed</h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-lg">Your payment was not completed successfully. This could be due to:</p>
            <ul className="text-left list-disc list-inside space-y-2 text-zinc-300">
              <li>The payment was cancelled</li>
              <li>The card was declined</li>
              <li>The transaction was declined by your bank</li>
              <li>A technical error occurred during processing</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button onClick={handleRetry} className="w-full sm:w-auto">
              Try Payment Again
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="secondary" onClick={() => navigate('/')}>
                Return to Home
              </Button>
              <Button variant="secondary" onClick={handleContact}>
                Contact Support
              </Button>
            </div>
          </div>

          <p className="mt-4 text-sm text-red-400">
            Need immediate assistance? Contact us at{' '}
            <a href="tel:+41782647970" className="text-gold hover:underline">
              +41 78 264 79 70
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
