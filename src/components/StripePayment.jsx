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
      'authentication_required': 'This payment requires authentication. Please follow the prompts from your bank.',
      'try_again_later': 'The payment system is temporarily unavailable. Please try again in a few moments.',
      'rate_limit': 'Too many payment attempts. Please wait a few minutes before trying again.',
      'invalid_request': 'The payment request was invalid. Please try again or contact support.'
    };

    // Check if we have a specific message for this error
    for (const [errorCode, message] of Object.entries(errorMap)) {
      if (technicalMessage.toLowerCase().includes(errorCode)) {
        return message;
      }
    }

    // If authentication required or 3DS related
    if (technicalMessage.toLowerCase().includes('authentication') || technicalMessage.toLowerCase().includes('3ds')) {
      return 'This payment requires additional verification. Please follow the prompts from your bank.';
    }

    // Default to a generic message for unhandled errors
    return 'There was a problem processing your payment. Please try again or use a different payment method.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing) return;

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

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (confirmError) {
        // Handle specific error types
        const message = getReadableErrorMessage(confirmError.message);
        setErrorMessage(message);
        onError({ ...confirmError, userMessage: message });
        
        // If payment requires authentication, let Stripe handle the redirect
        if (confirmError.type === 'card_error' && confirmError.code === 'authentication_required') {
          return;
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful without 3DS
        onSuccess();
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // 3DS required, Stripe will handle the redirect
        return;
      } else {
        // Unexpected state
        throw new Error('Unexpected payment state');
      }
    } catch (err) {
      const message = getReadableErrorMessage(err.message);
      setErrorMessage(message);
      onError({ ...err, userMessage: message });
    } finally {
      setIsProcessing(false);
    }
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