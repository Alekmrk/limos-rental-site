import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Button from './Button';


//const stripePromise = loadStripe('pk_live_51RPJz2IRGMq7s4cbNNd3aY9KVzfvowhFoKbfjlysxRsOPadnd5ZSH2z8veaVZeSyNYr7qv54Pks7odMTAHazJMsg00kOYlEBrQ');
const stripePromise = loadStripe('pk_test_51RPJz2IRGMq7s4cbaQg30MCxAjFGhLfs6SCrNsrbMmklgHSM3LXUfumQb8OvwdGTaERwurFjPKTF6xZXmUt7hGF900CAhtFQ1c');

// API base URL - dynamically set based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.elitewaylimo.ch'
  : 'http://localhost:3001';

const CheckoutForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (stripe && elements) {
      setIsLoading(false);
    }
  }, [stripe, elements]);

  const getReadableErrorMessage = (technicalMessage) => {
    const errorMap = {
      'card_declined': 'This card was declined. Please try another card.',
      'expired_card': 'This card has expired. Please use a different card.',
      'incorrect_cvc': 'The security code (CVC) is incorrect. Please check and try again.',
      'insufficient_funds': 'Insufficient funds on this card. Please use a different card.',
      'invalid_expiry_year': 'The expiration year is invalid. Please check and try again.',
      'invalid_expiry_month': 'The expiration month is invalid. Please check and try again.',
      'invalid_number': 'The card number is invalid. Please check and try again.',
      'processing_error': 'There was an error processing this card. Please try again in a few moments.',
      'authentication_required': 'This payment requires authentication. Please follow the prompts from your bank.',
      'try_again_later': 'The payment system is temporarily unavailable. Please try again in a few moments.',
      'rate_limit': 'Too many payment attempts. Please wait a few minutes before trying again.',
      'invalid_request': 'The payment request was invalid. Please try again or contact support.'
    };

    for (const [errorCode, message] of Object.entries(errorMap)) {
      if (technicalMessage.toLowerCase().includes(errorCode)) {
        return message;
      }
    }

    if (technicalMessage.toLowerCase().includes('authentication') || technicalMessage.toLowerCase().includes('3ds')) {
      return 'This payment requires additional verification. Please follow the prompts from your bank.';
    }

    return 'There was a problem processing your payment. Please try again or use a different payment method.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error: validationError } = await elements.submit();
      if (validationError) {
        setErrorMessage(getReadableErrorMessage(validationError.message));
        setIsProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (confirmError) {
        const message = getReadableErrorMessage(confirmError.message);
        setErrorMessage(message);
        // Only propagate non-validation errors to parent
        if (confirmError.type !== 'validation_error' && confirmError.type !== 'card_error') {
          onError({ ...confirmError, userMessage: message });
        }

        if (confirmError.type === 'card_error' && confirmError.code === 'authentication_required') {
          return; // Keep processing state for 3DS
        }
        setIsProcessing(false);
      } else if (paymentIntent) {
        if (paymentIntent.status === 'succeeded') {
          onSuccess();
        } else if (paymentIntent.status === 'requires_action') {
          return; // Keep processing state for 3DS
        }
      }
    } catch (err) {
      const message = getReadableErrorMessage(err.message);
      setErrorMessage(message);
      // Only propagate non-validation errors
      if (err.type !== 'validation_error' && err.type !== 'card_error') {
        onError({ ...err, userMessage: message });
      }
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[250px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto"></div>
          <p className="text-zinc-400">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="min-h-[160px]">
        <PaymentElement options={{
          layout: "accordion",
          fields: {
            billingDetails: {
              address: 'never',
              email: 'never',
              name: 'never',
              phone: 'never'
            }
          },
          wallets: {
            applePay: 'never',
            googlePay: 'never'
          }
        }} />
      </div>
      {errorMessage && (
        <div className="text-red-500 text-sm bg-red-500/10 px-2 py-1.5 rounded border border-red-500/20">
          {errorMessage}
        </div>
      )}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-2.5"
      >
        {isProcessing ? 'Processing Payment...' : `Pay ${amount} CHF`}
      </Button>
    </form>
  );
};

const StripePayment = ({ amount, onSuccess, onError, reservationInfo }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [initError, setInitError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stripe/create-payment-intent`, {
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

        if (!isMounted) return;
        
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        if (isMounted) {
          setInitError(err.message);
          onError(err);
        }
      }
    };

    createPaymentIntent();
    return () => {
      isMounted = false;
    };
  }, [amount, onError, reservationInfo]);

  if (initError) {
    return (
      <div className="bg-red-500/10 px-4 py-3 rounded border border-red-500/20 text-red-500">
        <p>Unable to initialize payment form. Please try again or contact support.</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-[250px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto"></div>
          <p className="text-zinc-400">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ 
      clientSecret,
      loader: 'always',
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary: '#D4AF37',
          colorBackground: 'transparent',
          colorText: '#ffffff',
          colorDanger: '#ef4444',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }
      }
    }}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripePayment;