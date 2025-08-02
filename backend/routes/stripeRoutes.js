const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a checkout session
router.post('/create-checkout-session', express.json(), async (req, res) => {
  try {
    const { 
      amount, 
      currency = 'chf', 
      metadata = {},
      utm_source,
      utm_medium,
      utm_campaign, 
      utm_term,
      utm_content 
    } = req.body;
    
    // Validate required fields early
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Start preparing session config immediately - FORCE HTTPS to prevent storage clearing
    const baseSuccessUrl = `${process.env.FRONTEND_URL || 'https://www.elitewaylimo.ch'}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const baseCancelUrl = `${process.env.FRONTEND_URL || 'https://www.elitewaylimo.ch'}/payment-cancel?session_id={CHECKOUT_SESSION_ID}`;
    
    // Build UTM-preserved URLs
    let successUrl = baseSuccessUrl;
    let cancelUrl = baseCancelUrl;
    
    if (utm_source || utm_medium || utm_campaign || utm_term || utm_content) {
      const utmParams = new URLSearchParams();
      if (utm_source) utmParams.set('utm_source', utm_source);
      if (utm_medium) utmParams.set('utm_medium', utm_medium);
      if (utm_campaign) utmParams.set('utm_campaign', utm_campaign);
      if (utm_term) utmParams.set('utm_term', utm_term);
      if (utm_content) utmParams.set('utm_content', utm_content);
      
      const utmString = utmParams.toString();
      if (utmString) {
        successUrl = `${baseSuccessUrl}&${utmString}`;
        cancelUrl = `${baseCancelUrl}&${utmString}`;
        console.log('🎯 UTM parameters preserved in Stripe URLs:', {
          utm_source, utm_medium, utm_campaign, utm_term, utm_content
        });
      }
    }

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Elite Way Limo Reservation',
              description: metadata.isHourly === 'true' 
                ? `${metadata.vehicleName || 'Vehicle'} - ${metadata.hours || ''} hours - ${metadata.date || ''} ${metadata.time || ''}`.trim()
                : `${metadata.vehicleName || 'Vehicle'} - ${metadata.pickup || ''} to ${metadata.dropoff || ''} - ${metadata.date || ''} ${metadata.time || ''}`.trim(),
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        // Store UTM parameters in session metadata for preservation
        ...(utm_source && { utm_source }),
        ...(utm_medium && { utm_medium }),
        ...(utm_campaign && { utm_campaign }),
        ...(utm_term && { utm_term }),
        ...(utm_content && { utm_content })
      },
      // Add faster processing options
      payment_intent_data: {
        capture_method: 'automatic',
      },
      // Optimize for faster checkout
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes from now
    };

    // Prefill customer email if available
    if (metadata.email) {
      sessionConfig.customer_email = metadata.email;
    }
    
    // Create session with timeout handling
    const sessionPromise = stripe.checkout.sessions.create(sessionConfig);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Stripe API timeout')), 30000)
    );

    const session = await Promise.race([sessionPromise, timeoutPromise]);

    res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    
    // Provide more specific error messages
    if (err.message === 'Stripe API timeout') {
      res.status(504).json({ error: 'Payment service temporarily unavailable. Please try again in a moment.' });
    } else if (err.type === 'StripeCardError') {
      res.status(400).json({ error: 'Card validation error: ' + err.message });
    } else {
      res.status(500).json({ error: 'Unable to process payment request. Please try again.' });
    }
  }
});

// Verify checkout session
router.get('/verify-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    if (session.payment_status === 'paid') {
      // Create reservation info from session metadata
      const reservationInfo = {
        // Customer Details
        email: session.metadata.email,
        firstName: session.metadata.firstName,
        phone: session.metadata.phone,

        // Booking Core Details
        date: session.metadata.date,
        time: session.metadata.time,
        pickup: session.metadata.pickup,
        dropoff: session.metadata.dropoff,
        extraStops: session.metadata.extraStops ? JSON.parse(session.metadata.extraStops) : [],

        // Service Type
        isHourly: session.metadata.isHourly === 'true',
        isSpecialRequest: session.metadata.isSpecialRequest === 'true',
        hours: session.metadata.hours,

        // Vehicle Info
        selectedVehicle: {
          id: session.metadata.vehicleId,
          name: session.metadata.vehicleName
        },

        // Passenger Details
        passengers: parseInt(session.metadata.passengers) || 0,
        bags: parseInt(session.metadata.bags) || 0,
        boosterSeats: parseInt(session.metadata.boosterSeats) || 0,
        childSeats: parseInt(session.metadata.childSeats) || 0,
        skiEquipment: parseInt(session.metadata.skiEquipment) || 0,

        // Additional Details
        flightNumber: session.metadata.flightNumber,
        meetingBoard: session.metadata.meetingBoard,
        plannedActivities: session.metadata.plannedActivities,
        specialRequestDetails: session.metadata.specialRequestDetails,
        additionalRequests: session.metadata.additionalRequests,
        referenceNumber: session.metadata.referenceNumber,

        // Route Information
        routeInfo: session.metadata.routeDistance && session.metadata.routeDuration ? {
          distance: session.metadata.routeDistance,
          duration: session.metadata.routeDuration
        } : null,

        // Payment Details
        paymentDetails: {
          method: 'stripe',
          amount: session.amount_total / 100,
          currency: session.currency.toUpperCase(),
          timestamp: new Date().toISOString(),
          reference: session.payment_intent || session.id,
          bookingSource: session.metadata.bookingSource || 'website',
          bookingTimestamp: session.metadata.bookingTimestamp || new Date().toISOString(),
          locale: session.metadata.locale || 'en-CH'
        }
      };

      res.json({ success: true, reservationInfo });
    } else {
      res.json({ success: false, error: 'Payment not completed' });
    }
  } catch (err) {
    console.error('Error verifying session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Retrieve canceled session data for payment retry
router.get('/canceled-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    // Create reservation info from session metadata (regardless of payment status)
    const reservationInfo = {
      // Customer Details
      email: session.metadata.email,
      firstName: session.metadata.firstName,
      phone: session.metadata.phone,

      // Booking Core Details
      date: session.metadata.date,
      time: session.metadata.time,
      pickup: session.metadata.pickup,
      dropoff: session.metadata.dropoff,
      extraStops: session.metadata.extraStops ? JSON.parse(session.metadata.extraStops) : [],

      // Service Type
      isHourly: session.metadata.isHourly === 'true',
      isSpecialRequest: session.metadata.isSpecialRequest === 'true',
      hours: session.metadata.hours,

      // Vehicle Info
      selectedVehicle: {
        id: session.metadata.vehicleId,
        name: session.metadata.vehicleName
      },

      // Passenger Details
      passengers: parseInt(session.metadata.passengers) || 0,
      bags: parseInt(session.metadata.bags) || 0,
      boosterSeats: parseInt(session.metadata.boosterSeats) || 0,
      childSeats: parseInt(session.metadata.childSeats) || 0,
      skiEquipment: parseInt(session.metadata.skiEquipment) || 0,

      // Additional Details
      flightNumber: session.metadata.flightNumber,
      meetingBoard: session.metadata.meetingBoard,
      plannedActivities: session.metadata.plannedActivities,
      specialRequestDetails: session.metadata.specialRequestDetails,
      additionalRequests: session.metadata.additionalRequests,
      referenceNumber: session.metadata.referenceNumber,

      // Route Information
      routeInfo: session.metadata.routeDistance && session.metadata.routeDuration ? {
        distance: session.metadata.routeDistance,
        duration: session.metadata.routeDuration
      } : null
    };

    res.json({ success: true, reservationInfo, sessionStatus: session.payment_status });
  } catch (err) {
    console.error('Error retrieving canceled session:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;