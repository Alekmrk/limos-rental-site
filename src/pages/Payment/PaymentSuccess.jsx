import React, { useEffect, useContext } from "react";
import ReservationContext from "../../contexts/ReservationContext";
import usePaymentFlowCookieSuppression from "../../hooks/usePaymentFlowCookieSuppression";
import { useUTMPreservation } from "../../hooks/useUTMPreservation";
import { extractAndStoreUTMFromURL, trackConversion } from "../../utils/utmTracking";

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.elitewaylimo.ch'
  : 'http://localhost:3001';

const UTM_PARAMS = [
  'utm_source',
  'utm_medium', 
  'utm_campaign',
  'utm_term',
  'utm_content'
];

// Function to get UTMs from both URL and storage
const getAvailableUTMs = () => {
  // First check URL params (most current)
  const urlParams = new URLSearchParams(window.location.search);
  const urlUTMs = {};
  let hasURLUTMs = false;
  
  UTM_PARAMS.forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      urlUTMs[param] = value;
      hasURLUTMs = true;
    }
  });
  
  // Then check storage as backup
  const storedUTMs = getStoredUTMParameters() || {};
  
  // Merge with preference to URL params
  const finalUTMs = { ...storedUTMs, ...urlUTMs };
  
  console.log('🎯 Available UTMs:', {
    fromURL: urlUTMs,
    fromStorage: storedUTMs,
    final: finalUTMs,
    hasURLUTMs,
    hasStoredUTMs: Object.keys(storedUTMs).length > 0
  });
  
  return Object.keys(finalUTMs).length > 0 ? finalUTMs : null;
};

const PaymentSuccess = () => {
  const { handleInput } = useContext(ReservationContext);
  const { currentUTMs, navigateWithUTMs } = useUTMPreservation();
  
  // Suppress cookie consent during payment success flow
  const { clearSuppression } = usePaymentFlowCookieSuppression(true, 45000); // 45 seconds

  useEffect(() => {
    // Extract UTMs from current URL (they come from Stripe redirect)
    // Use the hook's currentUTMs which reads from URL
    if (currentUTMs) {
      console.log('🎯 UTMs found on payment success:', currentUTMs);
      // You can still capture them for GTM even with storage disabled
      extractAndStoreUTMFromURL();
    }

    const verifySession = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        
        if (!sessionId) {
          console.error('No session ID found');
          clearSuppression();
          // Preserve UTMs even on error redirect
          navigateWithUTMs('/payment');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/stripe/verify-session/${sessionId}`);
        const data = await response.json();

        if (!data.success) {
          console.error('Session verification failed:', data.error);
          clearSuppression();
          // Preserve UTMs on error redirect
          navigateWithUTMs('/payment');
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


        // Navigate to thank you page with UTMs preserved
        navigateWithUTMs('/thankyou', { replace: true });
        
      } catch (error) {
        console.error('Error verifying payment:', error);
        clearSuppression();
        navigateWithUTMs('/payment');
      }
    };

    verifySession();
  }, [ handleInput, clearSuppression, currentUTMs, navigateWithUTMs]);

  return (
    <div className="container-default mt-28 text-center">
      <h1 className="text-4xl font-bold mb-4">Processing Your Payment</h1>
      <p className="text-lg mb-4">Please wait while we confirm your payment...</p>
      <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto"></div>
    </div>
  );
};

export default PaymentSuccess;
