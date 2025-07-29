import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.elitewaylimo.ch'
  : 'http://localhost:3001';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { handleInput } = useContext(ReservationContext);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        
        if (!sessionId) {
          console.error('No session ID found');
          navigate('/payment');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/stripe/verify-session/${sessionId}`);
        const data = await response.json();

        if (!data.success) {
          console.error('Session verification failed:', data.error);
          navigate('/payment');
          return;
        }

        // Update the entire reservation info with the data from backend
        // IMPORTANT: Temporarily pause localStorage operations to prevent cookie consent conflicts
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;
        let reservationUpdateInProgress = true;
        
        // Create a queue for non-reservation localStorage operations during update
        const pendingOperations = [];
        
        localStorage.setItem = function(key, value) {
          if (reservationUpdateInProgress && (key.includes('cookie') || key.includes('app-version'))) {
            // Queue cookie-related operations to prevent conflicts
            pendingOperations.push({ operation: 'set', key, value });
            console.log('🍪 Queued localStorage operation during payment redirect:', key);
            return;
          }
          return originalSetItem.call(this, key, value);
        };
        
        localStorage.getItem = function(key) {
          if (reservationUpdateInProgress && (key.includes('cookie') || key.includes('app-version'))) {
            // Check pending operations first
            const pending = pendingOperations.find(op => op.key === key && op.operation === 'set');
            if (pending) {
              console.log('🍪 Retrieved queued localStorage value during payment redirect:', key);
              return pending.value;
            }
          }
          return originalGetItem.call(this, key);
        };

        const { reservationInfo } = data;
        console.log('🔄 Updating reservation context after payment success');
        
        for (const key in reservationInfo) {
          await handleInput({
            target: {
              name: key,
              value: reservationInfo[key]
            }
          });
        }
        
        // Restore localStorage operations and process pending cookie operations
        setTimeout(() => {
          reservationUpdateInProgress = false;
          localStorage.setItem = originalSetItem;
          localStorage.getItem = originalGetItem;
          
          // Process any pending cookie operations
          pendingOperations.forEach(op => {
            if (op.operation === 'set') {
              originalSetItem.call(localStorage, op.key, op.value);
              console.log('🍪 Processed queued localStorage operation:', op.key);
            }
          });
          
          console.log('✅ Payment redirect localStorage protection disabled, cookie operations restored');
        }, 500); // Small delay to ensure context updates complete

        // Navigate to thank you page
        navigate('/thankyou', { replace: true });
      } catch (error) {
        console.error('Error verifying payment:', error);
        navigate('/payment');
      }
    };

    verifySession();
  }, [navigate, handleInput]);

  return (
    <div className="container-default mt-28 text-center">
      <h1 className="text-4xl font-bold mb-4">Processing Your Payment</h1>
      <p className="text-lg mb-4">Please wait while we confirm your payment...</p>
      <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto"></div>
    </div>
  );
};

export default PaymentSuccess;
