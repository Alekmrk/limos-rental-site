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
      // Get route info values safely
      const distance = reservationInfo.routeInfo?.distance || '';
      const duration = reservationInfo.routeInfo?.duration || '';
      
      const response = await fetch(`${API_BASE_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount,
          currency: 'chf',
          metadata: {
            // Customer Details
            email: reservationInfo.email || '',
            firstName: reservationInfo.firstName || '',
            phone: reservationInfo.phone || '',
            
            // Booking Details
            date: reservationInfo.date || '',
            time: reservationInfo.time || '',
            pickup: reservationInfo.pickup || '',
            dropoff: reservationInfo.dropoff || '',
            extraStops: JSON.stringify(reservationInfo.extraStops || []),
            
            // Service Type
            isHourly: String(!!reservationInfo.isHourly),
            isSpecialRequest: String(!!reservationInfo.isSpecialRequest),
            hours: reservationInfo.hours || '',
            
            // Vehicle Details
            vehicleName: reservationInfo.selectedVehicle?.name || '',
            vehicleId: reservationInfo.selectedVehicle?.id || '',
            
            // Passenger Details
            passengers: String(reservationInfo.passengers || '0'),
            bags: String(reservationInfo.bags || '0'),
            boosterSeats: String(reservationInfo.boosterSeats || '0'),
            childSeats: String(reservationInfo.childSeats || '0'),
            skiEquipment: String(reservationInfo.skiEquipment || '0'),
            
            // Additional Information
            flightNumber: reservationInfo.flightNumber || '',
            meetingBoard: reservationInfo.meetingBoard || '',
            plannedActivities: reservationInfo.plannedActivities?.substring(0, 450) || '',
            specialRequestDetails: reservationInfo.specialRequestDetails?.substring(0, 450) || '',
            additionalRequests: reservationInfo.additionalRequests?.substring(0, 450) || '',
            referenceNumber: reservationInfo.referenceNumber?.substring(0, 450) || '',
            
            // Route Information
            routeDistance: distance,
            routeDuration: duration,
            
            // Booking Metadata
            bookingTimestamp: new Date().toISOString(),
            bookingSource: 'website',
            locale: 'en-CH'
          }
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe checkout - session_id will be automatically added to cancel_url
      window.location.href = data.url;
      
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
    </div>
  );
};

export default StripePayment;