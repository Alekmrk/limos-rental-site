import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import ReservationContext from "../../contexts/ReservationContext";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const { reservationInfo } = useContext(ReservationContext);

  const handleRetry = () => {
    navigate('/payment');
  };

  const handleContact = () => {
    window.location.href = 'mailto:support@elitewaylimo.ch?subject=Payment%20Issue%20-%20Order%20' + 
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
              <li>There was an issue with your card</li>
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

          <p className="mt-8 text-sm text-zinc-400">
            Need immediate assistance? Contact us at{' '}
            <a href="tel:+41765880007" className="text-gold hover:underline">
              +41 76 588 00 07
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
