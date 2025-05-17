import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Button from './Button';

// Initialize Stripe with live key
const stripePromise = loadStripe('pk_live_51RPJz2IRGMq7s4cbNNd3aY9KVzfvowhFoKbfjlysxRsOPadnd5ZSH2z8veaVZeSyNYr7qv54Pks7odMTAHazJMsg00kOYlEBrQ');

const CheckoutForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // First validate the card without submitting
      const { error: validationError } = await elements.submit();
      if (validationError) {
        setErrorMessage(getReadableErrorMessage(validationError.message));
        setIsProcessing(false);
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure we return to payment success page
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        // Handle specific error types
        const message = getReadableErrorMessage(error.message);
        setErrorMessage(message);
        onError({ ...error, userMessage: message });
      } else {
        // Payment successful - handled by return_url redirect
        onSuccess();
      }
    } catch (err) {
      const message = getReadableErrorMessage(err.message);
      setErrorMessage(message);
      onError({ ...err, userMessage: message });
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert technical error messages to user-friendly ones
  const getReadableErrorMessage = (technicalMessage) => {
    const errorMap = {
      'card_declined': 'Your card was declined. Please try another card.',
      'expired_card': 'This card has expired. Please use a different card.',
      'incorrect_cvc': 'The security code (CVC) is incorrect. Please check and try again.',
      'insufficient_funds': 'Insufficient funds on this card. Please use a different card.',
      'invalid_expiry_year': 'The expiration year is invalid. Please check and try again.',
      'invalid_expiry_month': 'The expiration month is invalid. Please check and try again.',
      'invalid_number': 'This card number is invalid. Please check and try again.',
      'processing_error': 'There was an error processing your card. Please try again in a few moments.',
    };

    // Check if we have a specific message for this error
    for (const [errorCode, message] of Object.entries(errorMap)) {
      if (technicalMessage.toLowerCase().includes(errorCode)) {
        return message;
      }
    }

    // Default generic message
    return 'There was a problem processing your payment. Please try again or use a different card.';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : `Pay ${amount} CHF`}
      </Button>
    </form>
  );
};

const StripePayment = ({ amount, onSuccess, onError }) => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('https://api.elitewaylimo.ch/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, currency: 'chf' })
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setClientSecret(data.clientSecret);
      } catch (err) {
        onError(err);
      }
    };

    createPaymentIntent();
  }, [amount, onError]);

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripePayment;