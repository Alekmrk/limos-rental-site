import React, { useContext, useEffect, useRef } from "react";
import { useUTMPreservation } from "../../hooks/useUTMPreservation";
import { useSearchParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import ReservationContext from "../../contexts/ReservationContext";
import usePaymentFlowCookieSuppression from "../../hooks/usePaymentFlowCookieSuppression";
import { extractAndStoreUTMFromURL } from "../../utils/utmTracking";

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.elitewaylimo.ch'
  : 'http://localhost:3001';

const PaymentCancel = () => {
  const { navigateWithUTMs } = useUTMPreservation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { reservationInfo, handleInput } = useContext(ReservationContext);
  const hasSetRetryFlag = useRef(false);
  const hasRestoredSession = useRef(false);
  const hasSentCancelEmail = useRef(false);
  
  // Suppress cookie consent during payment cancel flow
  const { clearSuppression } = usePaymentFlowCookieSuppression(true, 30000); // 30 seconds

  // Check if user has already visited payment cancel and redirect if so
  useEffect(() => {
    if (reservationInfo?.hasVisitedPaymentCancel) {
      console.log('🚫 User already visited payment cancel page, redirecting to home');
      navigateWithUTMs('/', { replace: true });
      return;
    }
    
    // Mark that user has visited payment cancel page
    handleInput({
      target: {
        name: 'hasVisitedPaymentCancel',
        value: true
      }
    });
    
    // Replace current entry in history to prevent back navigation
    window.history.replaceState(null, '', window.location.href);
    
  }, [reservationInfo?.hasVisitedPaymentCancel, navigateWithUTMs, handleInput]);

  // Prevent users from navigating back to this page using browser controls
  useEffect(() => {
    const handlePopState = (event) => {
      // If they try to navigate back to payment cancel, redirect to home
      if (window.location.pathname === '/payment-cancel' && reservationInfo?.hasVisitedPaymentCancel) {
        console.log('🚫 Prevented back navigation to payment cancel, redirecting to home');
        navigateWithUTMs('/', { replace: true });
      }
    };

    // Add event listener for browser back/forward navigation
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [reservationInfo?.hasVisitedPaymentCancel, navigateWithUTMs]);

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
    // Extract and store UTM parameters from the cancel URL
    extractAndStoreUTMFromURL();
    
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

  // Extract UTM parameters from URL
  useEffect(() => {
    extractAndStoreUTMFromURL();
  }, []);

  const handleRetry = () => {
    // Clear any previous payment details and errors
    handleInput({
      target: {
        name: 'paymentDetails',
        value: null
      }
    });
    
    // Reset the payment cancel visit flag to allow retry
    handleInput({
      target: {
        name: 'hasVisitedPaymentCancel',
        value: false
      }
    });
    
    navigateWithUTMs('/payment');
  };

  const handleGoHome = () => {
    // Clear the payment cancel flag when user chooses to go home
    handleInput({
      target: {
        name: 'hasVisitedPaymentCancel',
        value: false
      }
    });
    
    navigateWithUTMs('/');
  };

  const handleContact = () => {
    window.location.href = 'mailto:info@elitewaylimo.ch?subject=Payment%20Issue%20-%20Order%20' + 
      (reservationInfo?.orderReference || 'Unknown');
  };

  return (
    <div className="bg-gradient-to-br from-warm-gray/5 via-cream/3 to-soft-gray/5">
      {/* Softer Animated Background Elements */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
        <div className="absolute top-20 left-10 w-20 h-20 bg-royal-blue/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gold/15 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-warm-gray/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-royal-blue/8 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-cream/15 to-gold/10 rounded-full blur-xl"></div>
      </div>

      <div className="container-default mt-28 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-semibold mb-8 text-center text-gray-700">
            <span className="text-amber-600">Payment</span> Incomplete
          </h1>
          
          <div className="bg-warm-white/90 backdrop-blur-md p-8 rounded-xl border border-amber-400/30 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/10 mb-4 shadow-lg">
                <svg className="w-16 h-16 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <h2 className="text-3xl font-medium mb-2 text-gray-700">Payment Was Not Completed</h2>
              <p className="text-gray-600 text-lg">
                Don't worry - your booking information has been saved and no payment was charged.
              </p>
            </div>

            {/* Payment Issue Information */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-amber-400/15 to-yellow-500/5 p-6 rounded-lg border border-amber-400/30 backdrop-blur-sm">
                <h3 className="text-amber-600 font-medium mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                  Why wasn't my payment completed?
                </h3>
                <div className="text-gray-700">
                  <p className="mb-3">This could be due to several reasons:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>You cancelled the payment process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Your card was declined by the bank</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Insufficient funds or card limits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>A technical error occurred during processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Security checks by your bank or card provider</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <Button onClick={handleRetry} className="w-full sm:w-auto bg-gold hover:bg-yellow-600 text-white px-8 py-3">
                  <svg className="w-5 h-5 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  Try Payment Again
                </Button>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button variant="secondary" onClick={handleGoHome}>
                    Return to Home
                  </Button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-slate-500/10 to-gold/5 p-6 rounded-lg border border-slate-500/20 backdrop-blur-sm">
                <h3 className="text-slate-600 font-medium mb-3 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
                  </svg>
                  Need Immediate Assistance?
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p className="text-sm">
                    Our customer service team is ready to help you complete your booking.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
                    <a 
                      href="tel:+41782647970" 
                      className="text-gold hover:text-yellow-600 font-medium flex items-center gap-1 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      +41 78 264 79 70
                    </a>
                    <span className="hidden sm:inline text-gray-400">|</span>
                    <a 
                      href="mailto:info@elitewaylimo.ch" 
                      className="text-gold hover:text-yellow-600 font-medium flex items-center gap-1 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      info@elitewaylimo.ch
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
