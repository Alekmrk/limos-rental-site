const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    // Override amount to fixed 1 CHF
    const amount = 0.5;
    const currency = 'chf';
    console.log('Creating payment intent:', { amount, currency });

    // Create PaymentIntent with only card payments enabled
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      payment_method_types: ['card'], // Only enable card payments for now
      metadata: {
        orderID: `ORDER-${Date.now()}`,
      }
    });

    console.log('Payment intent created:', {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret ? '(hidden)' : undefined,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error('Error creating payment intent:', {
      error: err.message,
      code: err.code,
      type: err.type,
      stack: err.stack
    });
    res.status(500).json({ error: err.message });
  }
});

// Webhook handler with signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('Received webhook:', {
    timestamp: new Date().toISOString(),
    signature: req.headers['stripe-signature'] ? '(present)' : '(missing)',
    bodyLength: req.body?.length || 0
  });

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Webhook signature verified:', {
      type: event.type,
      id: event.id,
      timestamp: new Date(event.created * 1000).toISOString()
    });

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          metadata: paymentIntent.metadata,
          paymentMethod: paymentIntent.payment_method,
          customer: paymentIntent.customer,
          timestamp: new Date().toISOString()
        });
        // Handle successful payment
        break;

      case 'payment_intent.failed':
        const failedIntent = event.data.object;
        const errorDetails = failedIntent.last_payment_error;
        console.error('Payment failed:', {
          id: failedIntent.id,
          error: errorDetails,
          status: failedIntent.status,
          failureMessage: errorDetails?.message,
          failureCode: errorDetails?.code,
          declineCode: errorDetails?.decline_code,
          timestamp: new Date().toISOString()
        });
        
        // Handle specific failure reasons
        switch (errorDetails?.code) {
          case 'card_declined':
            // Card was declined - could notify the user to try another card
            break;
          case 'expired_card':
            // Card is expired
            break;
          case 'incorrect_cvc':
            // Wrong CVC entered
            break;
          case 'processing_error':
            // Temporary processing error - could be retried
            break;
          default:
            // Other errors
            console.error('Unhandled payment failure reason:', errorDetails?.code);
        }
        break;

      case 'payment_intent.requires_action':
        const actionRequired = event.data.object;
        console.log('Payment requires action:', {
          id: actionRequired.id,
          status: actionRequired.status,
          nextAction: actionRequired.next_action?.type,
          timestamp: new Date().toISOString()
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', {
      message: err.message,
      stack: err.stack,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });
    
    // Check for specific types of webhook errors
    if (err.type === 'StripeSignatureVerificationError') {
      return res.status(400).json({ 
        error: 'Invalid signature',
        message: 'Could not verify webhook signature'
      });
    }
    
    return res.status(400).json({ 
      error: 'Webhook Error',
      message: err.message
    });
  }
});

module.exports = router;