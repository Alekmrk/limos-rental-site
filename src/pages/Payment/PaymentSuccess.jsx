import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReservationContext from "../../contexts/ReservationContext";
import { sendPaymentConfirmation } from "../../services/EmailService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { reservationInfo, handleInput } = useContext(ReservationContext);

  useEffect(() => {
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
          amount: 1, // Fixed amount
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
        console.log('Sending payment confirmation emails...');
        const emailResult = await sendPaymentConfirmation({
          ...reservationInfo,
          paymentDetails
        });

        if (!emailResult.success) {
          console.warn('Payment confirmation emails may not have been sent properly:', emailResult.message);
        }

        // Navigate to thank you page after short delay
        setTimeout(() => {
          navigate('/thankyou');
        }, 2000);
      } catch (error) {
        console.error('Error completing payment:', error);
        // Still redirect to thank you page even if there's an error
        setTimeout(() => {
          navigate('/thankyou');
        }, 2000);
      }
    };

    completePayment();
  }, []);

  return (
    <div className="container-default mt-28 text-center">
      <h1 className="text-4xl font-bold mb-4">Payment Successful</h1>
      <p className="text-lg mb-4">Thank you for your payment. Your transaction was successful.</p>
      <p className="text-lg mb-8">You will be redirected to the confirmation page shortly...</p>
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
    </div>
  );
};

export default PaymentSuccess;
