import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import usePaymentFlowCookieSuppression from "../../hooks/usePaymentFlowCookieSuppression";
import { extractAndStoreUTMFromURL, trackConversion, getStoredUTMParameters } from "../../utils/utmTracking";

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
  const navigate = useNavigate();
  const { handleInput } = useContext(ReservationContext);
  
  // Suppress cookie consent during payment success flow
  const { clearSuppression } = usePaymentFlowCookieSuppression(true, 45000); // 45 seconds

  useEffect(() => {
    // First check URL params (primary source)
    const urlParams = new URLSearchParams(window.location.search);
    const urlUTMs = Object.fromEntries(urlParams);
    
    // Then check localStorage backup
    const backupUTMs = JSON.parse(localStorage.getItem('eliteway_utm_backup') || '{}');
    
    // Merge with preference to URL params
    const finalUTMs = { ...backupUTMs, ...urlUTMs };
    
    // Store for attribution
    if (Object.keys(finalUTMs).length > 0) {
      console.log('🎯 Final UTMs for success page:', finalUTMs);
      sessionStorage.setItem('eliteway_utm_data', JSON.stringify(finalUTMs));
    }

    // Extract and store UTM parameters from the success URL
    extractAndStoreUTMFromURL();
    
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

        // Get available UTMs from URL and/or storage
        const availableUTMs = getAvailableUTMs();
        
        // Navigate to thank you page with UTMs preserved in URL
        if (availableUTMs) {
          const utmParams = new URLSearchParams();
          Object.entries(availableUTMs).forEach(([key, value]) => {
            if (value && UTM_PARAMS.includes(key)) {
              utmParams.set(key, value);
            }
          });
          
          const thankyouURL = `/thankyou?${utmParams.toString()}`;
          console.log('🔗 Navigating to thankyou with UTMs:', thankyouURL);
          navigate(thankyouURL, { replace: true });
        } else {
          console.log('🔗 Navigating to thankyou without UTMs');
          navigate('/thankyou', { replace: true });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        clearSuppression();
          navigate('/payment');
        }
      }
    };

    // Extract UTM parameters from URL and store them
    extractAndStoreUTMFromURL();

    verifySession();
  }, [navigate, handleInput, clearSuppression]);

  return (
    <div className="container-default mt-28 text-center">
      <h1 className="text-4xl font-bold mb-4">Processing Your Payment</h1>
      <p className="text-lg mb-4">Please wait while we confirm your payment...</p>
      <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto"></div>
    </div>
  );
};

export default PaymentSuccess;
