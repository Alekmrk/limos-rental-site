import { useState } from 'react';
import Button from './Button';
import { getStoredUTMParameters, captureUTMParameters } from '../utils/utmTracking';

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
      
      // Get UTM parameters from storage or current URL
      let utmParameters = getStoredUTMParameters();
      
      // Fallback: Extract from current URL if storage is disabled
      if (!utmParameters) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlUTMs = {};
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
          const value = urlParams.get(param);
          if (value) urlUTMs[param] = value;
        });
        if (Object.keys(urlUTMs).length > 0) {
          utmParameters = urlUTMs;
        }
      }
      
      console.log('UTM Parameters for payment:', utmParameters);

      // Debug log the UTM parameters
      console.log('🎯 Sending payment request with UTMs:', utmParameters);
      
      // Build request payload
      const requestPayload = { 
        amount,
        currency: 'chf',
        // Include UTM parameters for tracking (only if they exist)
        ...(utmParameters && {
          utm_source: utmParameters.utm_source,
          utm_medium: utmParameters.utm_medium,
          utm_campaign: utmParameters.utm_campaign,
          utm_term: utmParameters.utm_term,
          utm_content: utmParameters.utm_content
        }),
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
            receiveReceipt: String(!!reservationInfo.receiveReceipt),
            
            // Route Information
            routeDistance: distance,
            routeDuration: duration,
            
            // Booking Metadata
            bookingTimestamp: new Date().toISOString(),
            bookingSource: 'website',
            locale: 'en-CH'
          }
        };
      
      console.log('🔄 Request payload:', requestPayload);
      
      const response = await fetch(`${API_BASE_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      const data = await response.json();

      if (data.error) {
        console.error('❌ Stripe API error:', data.error);
        throw new Error(data.error);
      }

      if (!data.url) {
        console.error('❌ No checkout URL received:', data);
        throw new Error('No checkout URL received from payment service');
      }

      console.log('✅ Payment session created, redirecting to Stripe...');
      // Redirect to Stripe checkout - session_id will be automatically added to cancel_url
      window.location.href = data.url;
      
    } catch (err) {
      console.error('❌ Payment initialization error:', err);
      
      // Check if it's a network error
      if (!navigator.onLine) {
        onError({ 
          message: 'No internet connection', 
          userMessage: 'Please check your internet connection and try again.' 
        });
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        onError({ 
          message: 'Network error', 
          userMessage: 'Unable to connect to payment service. Please try again.' 
        });
      } else {
        onError({ 
          message: err.message, 
          userMessage: err.message.includes('payment') 
            ? err.message 
            : 'Unable to start payment process. Please try again or contact support.' 
        });
      }
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