const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'chf' } = req.body;
    console.log('Creating payment intent:', { amount, currency });

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      payment_method_types: ['card', 'applepay', 'googlepay', 'twint'],
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
    // Verify webhook signature
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
        // Handle successful payment (e.g., update order status, send confirmation)
        break;

      case 'payment_intent.failed':
        const failedIntent = event.data.object;
        console.log('Payment failed:', {
          id: failedIntent.id,
          error: failedIntent.last_payment_error,
          status: failedIntent.status,
          failureMessage: failedIntent.last_payment_error?.message,
          failureCode: failedIntent.last_payment_error?.code,
          timestamp: new Date().toISOString()
        });
        // Handle failed payment (e.g., notify customer, update order status)
        break;

      default:
        console.log(`Unhandled event type ${event.type}:`, {
          id: event.id,
          type: event.type,
          timestamp: new Date(event.created * 1000).toISOString()
        });
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', {
      message: err.message,
      stack: err.stack,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;