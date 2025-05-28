const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const emailService = require('../services/emailService');

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
      metadata: metadata
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Verify checkout session
router.get('/verify-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    if (session.payment_status === 'paid') {
      // Create reservation info from session metadata
      const reservationInfo = {
        email: session.metadata.email,
        firstName: session.metadata.firstName,
        phone: session.metadata.phone,
        date: session.metadata.date,
        time: session.metadata.time,
        pickup: session.metadata.pickup,
        dropoff: session.metadata.dropoff,
        isHourly: session.metadata.isHourly === 'true',
        isSpecialRequest: session.metadata.isSpecialRequest === 'true',
        hours: session.metadata.hours,
        plannedActivities: session.metadata.plannedActivities,
        selectedVehicle: {
          name: session.metadata.vehicleName
        },
        passengers: parseInt(session.metadata.passengers) || 0,
        bags: parseInt(session.metadata.bags) || 0,
        childSeats: parseInt(session.metadata.childSeats) || 0,
        babySeats: parseInt(session.metadata.babySeats) || 0,
        skiEquipment: parseInt(session.metadata.skiEquipment) || 0,
        flightNumber: session.metadata.flightNumber,
        specialRequestDetails: session.metadata.specialRequestDetails,
        additionalRequests: session.metadata.additionalRequests,
        paymentDetails: {
          method: 'stripe',
          amount: session.amount_total / 100,
          currency: session.currency.toUpperCase(),
          timestamp: new Date().toISOString(),
          reference: session.payment_intent || session.id
        }
      };

      // Send confirmation emails
      try {
        await emailService.sendPaymentConfirmationToAdmin(reservationInfo);
        if (reservationInfo.email) {
          await emailService.sendPaymentReceiptToCustomer(reservationInfo);
        }
      } catch (emailError) {
        console.error('Failed to send confirmation emails:', emailError);
      }

      res.json({ success: true, reservationInfo });
    } else {
      res.json({ success: false, error: 'Payment not completed' });
    }
  } catch (err) {
    console.error('Error verifying session:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;