import { useState } from 'react';
import Button from './Button';

// API base URL - dynamically set based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.elitewaylimo.ch'
  : 'http://localhost:3001';

const StripePayment = ({ amount, onSuccess, onError, reservationInfo }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount,
          currency: 'chf',
          metadata: {
            email: reservationInfo.email || '',
            firstName: reservationInfo.firstName || '',
            phone: reservationInfo.phone || '',
            date: reservationInfo.date || '',
            time: reservationInfo.time || '',
            pickup: reservationInfo.pickup || '',
            dropoff: reservationInfo.dropoff || '',
            vehicleName: reservationInfo.selectedVehicle?.name || '',
            isHourly: String(!!reservationInfo.isHourly),
            isSpecialRequest: String(!!reservationInfo.isSpecialRequest),
            hours: reservationInfo.hours || '',
            passengers: String(reservationInfo.passengers || '0'),
            bags: String(reservationInfo.bags || '0'),
            childSeats: String(reservationInfo.childSeats || '0'),
            babySeats: String(reservationInfo.babySeats || '0'),
            skiEquipment: String(reservationInfo.skiEquipment || '0'),
            flightNumber: reservationInfo.flightNumber || '',
            // Split long text fields to stay within 500 char limit
            plannedActivities: reservationInfo.plannedActivities?.substring(0, 450) || '',
            specialRequestDetails: reservationInfo.specialRequestDetails?.substring(0, 450) || '',
            additionalRequests: reservationInfo.additionalRequests?.substring(0, 450) || ''
          }
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Open Stripe Checkout in a new window
      window.open(data.url, '_blank');
      
    } catch (err) {
      onError({ message: err.message, userMessage: 'Unable to start payment process. Please try again or contact support.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full py-2.5"
      >
        {isProcessing ? 'Opening Payment Window...' : `Pay ${amount} CHF`}
      </Button>
      <div className="mt-4 text-sm text-zinc-400">
        <p>• You will be redirected to Stripe's secure payment page</p>
        <p>• Your payment information is handled securely by Stripe</p>
      </div>
    </div>
  );
};

export default StripePayment;