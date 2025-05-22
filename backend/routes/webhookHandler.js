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
        console.log('Payment succeeded:', {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata
        });
        
        try {
          // Send payment confirmation to admin
          await emailService.sendPaymentConfirmationToAdmin({
            paymentDetails: {
              method: 'stripe',
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency.toUpperCase(),
              timestamp: new Date().toISOString(),
              reference: paymentIntent.id
            },
            orderReference: paymentIntent.metadata?.orderID,
            ...paymentIntent.metadata
          });

          // Send receipt to customer if email exists in metadata
          if (paymentIntent.metadata?.email) {
            await emailService.sendPaymentReceiptToCustomer({
              email: paymentIntent.metadata.email,
              paymentDetails: {
                method: 'stripe',
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency.toUpperCase(),
                timestamp: new Date().toISOString(),
                reference: paymentIntent.id
              },
              orderReference: paymentIntent.metadata?.orderID,
              ...paymentIntent.metadata
            });
          }
        } catch (emailError) {
          console.error('Failed to send payment confirmation emails:', emailError);
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