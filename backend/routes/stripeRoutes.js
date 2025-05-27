const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a checkout session
router.post('/create-checkout-session', express.json(), async (req, res) => {
  try {
    const { amount, currency = 'chf', metadata = {} } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Elite Way Limo Reservation',
              images: ['https://elitewaylimo.ch/logo.png'], // Replace with your logo URL
              description: `Reservation for ${metadata.vehicleName || 'Vehicle'}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-cancel`,
      metadata: {
        orderID: `ORDER-${Date.now()}`,
        ...metadata
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a payment intent (keeping for backward compatibility)
router.post('/create-payment-intent', express.json(), async (req, res) => {
  try {
    const { amount, currency = 'chf', metadata = {} } = req.body;
    console.log('Creating payment intent:', { amount, currency, metadata });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      metadata: {
        orderID: `ORDER-${Date.now()}`,
        ...metadata
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

module.exports = router;