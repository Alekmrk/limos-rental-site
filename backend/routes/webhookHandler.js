const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const emailService = require('../services/emailService');

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  console.log('Received webhook:', {
    timestamp: new Date().toISOString(),
    signature: sig ? '(present)' : '(missing)',
    bodyLength: req.body?.length || 0,
    contentType: req.headers['content-type'],
    isRawBody: Buffer.isBuffer(req.body)
  });

  if (!sig) {
    console.error('No Stripe signature found in webhook request');
    return res.status(400).json({ 
      error: 'No signature',
      message: 'Missing Stripe signature'
    });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ 
      error: 'Configuration Error',
      message: 'Webhook secret not configured'
    });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Webhook event verified:', {
      type: event.type,
      id: event.id,
      timestamp: new Date(event.created * 1000).toISOString()
    });

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata,
          hasEmail: !!paymentIntent.metadata?.email,
          timestamp: new Date().toISOString()
        });
        
        // Skip if this payment intent has already been processed
        if (paymentIntent.metadata?.emailsSent === 'true') {
          console.log('Skipping email sending - already processed:', paymentIntent.id);
          res.json({ 
            received: true,
            type: 'payment_intent.succeeded',
            paymentIntentId: paymentIntent.id,
            status: 'skipped_already_processed'
          });
          break;
        }
        
        try {
          // Get the checkout session to ensure we have all metadata
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1,
            expand: ['data.customer']
          });

          // Log session data for debugging
          console.log('Found checkout session:', {
            sessionId: sessions.data[0]?.id,
            hasMetadata: !!sessions.data[0]?.metadata,
            metadata: sessions.data[0]?.metadata
          });
          
          // Use metadata from session if available, otherwise use current date/time
          const metadata = sessions.data.length > 0 ? sessions.data[0].metadata : {
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-CH', {
              timeZone: 'Europe/Zurich',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          };

          // Prepare reservation info from metadata
          const reservationInfo = {
            // Customer Details
            email: metadata.email,
            firstName: metadata.firstName,
            phone: metadata.phone,

            // Booking Core Details
            date: metadata.date,
            time: metadata.time,
            pickup: metadata.pickup,
            dropoff: metadata.dropoff,
            extraStops: metadata.extraStops ? JSON.parse(metadata.extraStops) : [],

            // Service Type
            isHourly: metadata.isHourly === 'true',
            isSpecialRequest: metadata.isSpecialRequest === 'true',
            hours: metadata.hours,

            // Vehicle Info
            selectedVehicle: {
              id: metadata.vehicleId,
              name: metadata.vehicleName
            },

            // Passenger Details
            passengers: parseInt(metadata.passengers) || 0,
            bags: parseInt(metadata.bags) || 0,
            childSeats: parseInt(metadata.childSeats) || 0,
            babySeats: parseInt(metadata.babySeats) || 0,
            skiEquipment: parseInt(metadata.skiEquipment) || 0,

            // Additional Details
            flightNumber: metadata.flightNumber,
            plannedActivities: metadata.plannedActivities,
            specialRequestDetails: metadata.specialRequestDetails,
            additionalRequests: metadata.additionalRequests,

            // Route Information
            routeInfo: metadata.routeDistance && metadata.routeDuration ? {
              distance: metadata.routeDistance,
              duration: metadata.routeDuration
            } : null,

            // Payment Details
            paymentDetails: {
              method: 'stripe',
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency.toUpperCase(),
              timestamp: new Date().toISOString(),
              reference: paymentIntent.id,
              bookingSource: metadata.bookingSource || 'website',
              bookingTimestamp: metadata.bookingTimestamp || new Date().toISOString(),
              locale: metadata.locale || 'en-CH'
            }
          };

          console.log('Attempting to send confirmation emails for payment:', {
            email: reservationInfo.email,
            paymentId: paymentIntent.id,
            amount: reservationInfo.paymentDetails.amount,
            currency: reservationInfo.paymentDetails.currency,
            hasEmail: !!reservationInfo.email,
            hasDate: !!reservationInfo.date,
            hasTime: !!reservationInfo.time
          });

          // Send confirmation to admin
          await emailService.sendPaymentConfirmationToAdmin(reservationInfo);
          console.log('Admin confirmation email sent successfully');

          // Send receipt to customer if email exists
          if (reservationInfo.email) {
            await emailService.sendPaymentReceiptToCustomer(reservationInfo);
            console.log('Customer receipt email sent successfully');
          }

          // Mark this payment intent as processed
          await stripe.paymentIntents.update(paymentIntent.id, {
            metadata: { 
              ...metadata,
              emailsSent: 'true',
              emailSentTimestamp: new Date().toISOString()
            }
          });
          console.log('Payment intent marked as processed');

        } catch (emailError) {
          console.error('Failed to send payment confirmation emails:', {
            error: emailError.message,
            stack: emailError.stack,
            paymentId: paymentIntent.id,
            timestamp: new Date().toISOString()
          });
        }

        res.json({ 
          received: true,
          type: 'payment_intent.succeeded',
          paymentIntentId: paymentIntent.id
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const failedIntent = event.data.object;
        const errorDetails = failedIntent.last_payment_error;
        console.error('Payment failed:', {
          id: failedIntent.id,
          error: errorDetails,
          status: failedIntent.status,
          failureMessage: errorDetails?.message,
          failureCode: errorDetails?.code,
          timestamp: new Date().toISOString()
        });

        try {
          await emailService.sendToAdmin({
            isUrgent: true,
            subject: `❌ Payment Failed - ${failedIntent.amount/100} ${failedIntent.currency.toUpperCase()}`,
            details: {
              paymentId: failedIntent.id,
              amount: `${failedIntent.amount/100} ${failedIntent.currency.toUpperCase()}`,
              status: 'Failed',
              error: errorDetails?.message || 'Unknown error',
              errorCode: errorDetails?.code,
              declineCode: errorDetails?.decline_code
            }
          });
        } catch (emailError) {
          console.error('Failed to send payment failure notification:', emailError);
        }

        res.json({ 
          received: true,
          type: 'payment_intent.payment_failed',
          paymentIntentId: failedIntent.id,
          error: errorDetails?.code || 'unknown_error'
        });
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object;
        console.error('Dispute created:', {
          id: dispute.id,
          amount: dispute.amount,
          currency: dispute.currency,
          charge: dispute.charge,
          reason: dispute.reason,
          status: dispute.status,
          timestamp: new Date().toISOString()
        });

        try {
          await emailService.sendToAdmin({
            isUrgent: true,
            subject: `⚠️ URGENT: Payment Dispute Received - ${dispute.amount/100} ${dispute.currency.toUpperCase()}`,
            details: {
              disputeId: dispute.id,
              chargeId: dispute.charge,
              amount: `${dispute.amount/100} ${dispute.currency.toUpperCase()}`,
              reason: dispute.reason,
              status: dispute.status,
              evidence_details: dispute.evidence_details,
              due_by: dispute.evidence_details?.due_by ? new Date(dispute.evidence_details.due_by * 1000).toISOString() : 'Not specified'
            }
          });
        } catch (emailError) {
          console.error('Failed to send dispute notification email:', emailError);
        }

        res.json({ 
          received: true,
          type: 'charge.dispute.created',
          disputeId: dispute.id,
          chargeId: dispute.charge
        });
        break;
      }

      case 'charge.dispute.closed': {
        const dispute = event.data.object;
        console.log('Dispute closed:', {
          id: dispute.id,
          status: dispute.status,
          outcome: dispute.status === 'won' ? 'in your favor' : 'not in your favor'
        });

        try {
          await emailService.sendToAdmin({
            isUrgent: true,
            subject: `📌 Dispute ${dispute.status === 'won' ? 'Won' : 'Lost'} - ${dispute.amount/100} ${dispute.currency.toUpperCase()}`,
            details: {
              disputeId: dispute.id,
              chargeId: dispute.charge,
              amount: `${dispute.amount/100} ${dispute.currency.toUpperCase()}`,
              status: dispute.status,
              outcome: dispute.outcome
            }
          });
        } catch (emailError) {
          console.error('Failed to send dispute resolution notification:', emailError);
        }

        res.json({
          received: true,
          type: 'charge.dispute.closed',
          disputeId: dispute.id,
          status: dispute.status
        });
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        console.log('Charge refunded:', {
          id: charge.id,
          amount_refunded: charge.amount_refunded,
          currency: charge.currency
        });

        try {
          // Notify admin about the refund
          await emailService.sendToAdmin({
            subject: `💰 Refund Processed - ${charge.amount_refunded/100} ${charge.currency.toUpperCase()}`,
            details: {
              chargeId: charge.id,
              amount: `${charge.amount_refunded/100} ${charge.currency.toUpperCase()}`,
              reason: charge.refunds?.data[0]?.reason || 'No reason provided'
            }
          });

          // If we have customer email in metadata, notify them too
          if (charge.metadata?.email) {
            await emailService.sendPaymentReceiptToCustomer({
              email: charge.metadata.email,
              paymentDetails: {
                method: 'stripe',
                type: 'refund',
                amount: charge.amount_refunded / 100,
                currency: charge.currency.toUpperCase(),
                timestamp: new Date().toISOString(),
                reference: charge.id
              }
            });
          }
        } catch (emailError) {
          console.error('Failed to send refund notification:', emailError);
        }

        res.json({
          received: true,
          type: 'charge.refunded',
          chargeId: charge.id
        });
        break;
      }

      case 'payment_intent.requires_action': {
        const paymentIntent = event.data.object;
        console.log('Payment requires action:', {
          id: paymentIntent.id,
          status: paymentIntent.status,
          next_action: paymentIntent.next_action?.type
        });

        // No need to send notifications for this event as it's handled by the frontend
        res.json({
          received: true,
          type: 'payment_intent.requires_action',
          paymentIntentId: paymentIntent.id
        });
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;
        console.log('Payment canceled:', {
          id: paymentIntent.id,
          cancellation_reason: paymentIntent.cancellation_reason
        });

        try {
          await emailService.sendToAdmin({
            subject: `❌ Payment Canceled - ${paymentIntent.amount/100} ${paymentIntent.currency.toUpperCase()}`,
            details: {
              paymentId: paymentIntent.id,
              amount: `${paymentIntent.amount/100} ${paymentIntent.currency.toUpperCase()}`,
              reason: paymentIntent.cancellation_reason || 'No reason provided',
              metadata: paymentIntent.metadata
            }
          });
        } catch (emailError) {
          console.error('Failed to send cancellation notification:', emailError);
        }

        res.json({
          received: true,
          type: 'payment_intent.canceled',
          paymentIntentId: paymentIntent.id
        });
        break;
      }

      case 'charge.expired': {
        const charge = event.data.object;
        console.log('Charge expired:', {
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency
        });

        try {
          await emailService.sendToAdmin({
            subject: `⏰ Payment Expired - ${charge.amount/100} ${charge.currency.toUpperCase()}`,
            details: {
              chargeId: charge.id,
              amount: `${charge.amount/100} ${charge.currency.toUpperCase()}`,
              created: new Date(charge.created * 1000).toISOString(),
              metadata: charge.metadata
            }
          });
        } catch (emailError) {
          console.error('Failed to send expiration notification:', emailError);
        }

        res.json({
          received: true,
          type: 'charge.expired',
          chargeId: charge.id
        });
        break;
      }

      default:
        console.log(`Ignoring unhandled event type: ${event.type}`);
        res.json({ 
          received: true,
          type: event.type,
          handled: false
        });
    }
  } catch (err) {
    console.error('Webhook error:', {
      message: err.message,
      stack: err.stack,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });
    
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
};