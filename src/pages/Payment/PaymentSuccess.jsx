import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import { sendPaymentConfirmation } from "../../services/EmailService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { reservationInfo, handleInput } = useContext(ReservationContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_intent');
    
    if (!paymentStatus && !reservationInfo?.paymentDetails) {
      // If no payment info, redirect to payment page
      navigate('/payment');
      return;
    }

    const completePayment = async () => {
      try {
        // Create payment details
        const now = new Date();
        const swissTime = now.toLocaleString('en-CH', {
          timeZone: 'Europe/Zurich',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });

        const paymentDetails = {
          method: 'stripe',
          amount: reservationInfo.price,
          currency: 'CHF',
          timestamp: now.toISOString(),
          swissTimestamp: swissTime,
          reference: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };

        // Update reservation context
        await handleInput({
          target: {
            name: 'paymentDetails',
            value: paymentDetails
          }
        });

        // Send confirmation emails
        const emailResult = await sendPaymentConfirmation({
          ...reservationInfo,
          paymentDetails
        });

        if (!emailResult.success) {
          console.warn('Payment confirmation emails may not have been sent properly:', emailResult.message);
        }

        // Navigate to thank you page
        navigate('/thankyou', { replace: true });
      } catch (error) {
        console.error('Error completing payment:', error);
        // Still redirect to thank you page even if there's an error
        navigate('/thankyou', { replace: true });
      }
    };

    completePayment();
  }, []);

  return (
    <div className="container-default mt-28 text-center">
      <h1 className="text-4xl font-bold mb-4">Processing Your Payment</h1>
      <p className="text-lg mb-4">Please wait while we confirm your payment...</p>
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
    </div>
  );
};

export default PaymentSuccess;
