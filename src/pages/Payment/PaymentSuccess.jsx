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
        console.log('🔄 PaymentSuccess: Starting session verification...');
        console.log('🌐 Current URL:', window.location.href);
        console.log('📖 Referrer:', document.referrer);
        
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        
        if (!sessionId) {
          console.error('❌ No session ID found in URL parameters');
          console.log('🔍 Available URL params:', Array.from(urlParams.entries()));
          navigate('/payment');
          return;
        }

        console.log('✅ Session ID found:', sessionId);
        
        const response = await fetch(`${API_BASE_URL}/api/stripe/verify-session/${sessionId}`);
        const data = await response.json();

        console.log('📥 Stripe verification response:', data);

        if (!data.success) {
          console.error('❌ Session verification failed:', data.error);
          navigate('/payment');
          return;
        }

        console.log('✅ Session verification successful');

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
        console.log('📦 Reservation data from Stripe:', reservationInfo);
        
        // Set session flags to prevent validation redirects during context updates
        sessionStorage.setItem('payment-redirect-active', 'true');
        sessionStorage.setItem('skip-validation-redirects', 'true');
        
        // Store backup data for recovery
        sessionStorage.setItem('payment-success-backup', JSON.stringify({
          ...reservationInfo,
          sessionId: sessionId,
          timestamp: Date.now()
        }));
        
        // Update reservation data in context one by one
        const updatePromises = [];
        for (const key in reservationInfo) {
          const updatePromise = handleInput({
            target: {
              name: key,
              value: reservationInfo[key]
            }
          });
          updatePromises.push(updatePromise);
        }
        
        // Wait for all context updates to complete
        console.log('⏳ Waiting for all context updates to complete...');
        await Promise.all(updatePromises);
        console.log('✅ All context updates completed');
        
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
          
          // Navigate immediately using window.location for better reliability
          console.log('🎯 Navigating to thank you page using window.location...');
          console.log('📍 Current location before navigation:', window.location.pathname);
          
          // Set markers for ThankYou page
          sessionStorage.setItem('from-payment-success', 'true');
          sessionStorage.setItem('thankyou-direct-access', 'true');
          
          // Use window.location for direct navigation (more reliable than React Router during context updates)
          try {
            window.location.href = '/thankyou';
          } catch (navError) {
            console.error('❌ Navigation error:', navError);
            // Ultimate fallback
            window.location.replace('/thankyou');
          }
          
          // Clean up protection flags after navigation
          setTimeout(() => {
            sessionStorage.removeItem('payment-redirect-active');
            sessionStorage.removeItem('skip-validation-redirects');
            console.log('🧹 Cleaned up payment redirect protection flags');
          }, 2000);
        }, 300); // Reduced delay since we're using window.location
      } catch (error) {
        console.error('❌ Error verifying payment:', error);
        console.log('🔄 Redirecting to payment page due to error');
        navigate('/payment');
      }
    };

    console.log('🚀 PaymentSuccess component mounted, starting verification...');
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
