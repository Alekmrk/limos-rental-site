const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const emailService = require('../services/emailService');
const twilioService = require('../services/twilioService');

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
        
        // Check if this specific success event has already been processed
        // Use both emailsSent flag AND event timestamp to handle retry scenarios
        const currentEventTime = new Date(event.created * 1000).toISOString();
        const lastProcessedTime = paymentIntent.metadata?.lastSuccessEmailTimestamp;
        
        if (paymentIntent.metadata?.emailsSent === 'true' && lastProcessedTime === currentEventTime) {
          console.log('Skipping email sending - this exact success event already processed:', {
            paymentIntentId: paymentIntent.id,
            eventTime: currentEventTime,
            lastProcessed: lastProcessedTime
          });
          res.json({ 
            received: true,
            type: 'payment_intent.succeeded',
            paymentIntentId: paymentIntent.id,
            status: 'skipped_already_processed'
          });
          break;
        }
        
        // Log if this is a retry scenario (payment failed before but now succeeded)
        if (paymentIntent.metadata?.emailsSent === 'true' && lastProcessedTime !== currentEventTime) {
          console.log('Payment retry success detected - sending emails for successful retry:', {
            paymentIntentId: paymentIntent.id,
            previousSuccessTime: lastProcessedTime,
            currentEventTime: currentEventTime
          });
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
          
          console.log('🔍 RECEIPT DEBUG - Stripe metadata:', {
            receiveReceipt: sessions.data[0]?.metadata?.receiveReceipt,
            referenceNumber: sessions.data[0]?.metadata?.referenceNumber,
            email: sessions.data[0]?.metadata?.email
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
            boosterSeats: parseInt(metadata.boosterSeats) || 0,
            childSeats: parseInt(metadata.childSeats) || 0,
            skiEquipment: parseInt(metadata.skiEquipment) || 0,

            // Additional Details
            flightNumber: metadata.flightNumber,
            meetingBoard: metadata.meetingBoard,
            plannedActivities: metadata.plannedActivities,
            specialRequestDetails: metadata.specialRequestDetails,
            additionalRequests: metadata.additionalRequests,
            referenceNumber: metadata.referenceNumber,
            receiveReceipt: metadata.receiveReceipt === 'true',

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

          console.log('🔍 RECEIPT DEBUG - Built reservationInfo:', {
            receiveReceipt: reservationInfo.receiveReceipt,
            referenceNumber: reservationInfo.referenceNumber,
            email: reservationInfo.email,
            hasPaymentDetails: !!reservationInfo.paymentDetails
          });

          console.log('[EMAIL] [EMAIL-START] Initiating payment success email notifications:', {
            paymentIntentId: paymentIntent.id,
            amount: `${reservationInfo.paymentDetails.amount} ${reservationInfo.paymentDetails.currency}`,
            customerEmail: reservationInfo.email || 'NOT_PROVIDED',
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            bookingDetails: {
              pickup: reservationInfo.pickup,
              dropoff: reservationInfo.dropoff,
              date: reservationInfo.date,
              time: reservationInfo.time,
              vehicleName: reservationInfo.selectedVehicle?.name
            },
            timestamp: new Date().toISOString()
          });

          // Send confirmation to admin
          console.log('[EMAIL] [ADMIN-EMAIL-START] Sending payment confirmation to admin...');
          const adminEmailResult = await emailService.sendPaymentConfirmationToAdmin(reservationInfo);
          
          if (adminEmailResult.success) {
            console.log('[EMAIL] [SUCCESS] [ADMIN-EMAIL-SUCCESS] Admin confirmation email sent successfully:', {
              paymentIntentId: paymentIntent.id,
              adminEmail: process.env.ADMIN_EMAIL,
              messageId: adminEmailResult.messageId,
              emailId: adminEmailResult.emailId,
              amount: `${reservationInfo.paymentDetails.amount} ${reservationInfo.paymentDetails.currency}`,
              timestamp: new Date().toISOString()
            });
          } else {
            console.error('[EMAIL] [FAILED] [ADMIN-EMAIL-FAILED] Admin confirmation email failed:', {
              paymentIntentId: paymentIntent.id,
              adminEmail: process.env.ADMIN_EMAIL,
              error: adminEmailResult.error || 'Unknown error',
              timestamp: new Date().toISOString()
            });
          }

          // Send receipt to customer if email exists
          if (reservationInfo.email) {
            console.log('[EMAIL] [CUSTOMER-EMAIL-START] Sending payment receipt to customer:', {
              customerEmail: reservationInfo.email,
              paymentIntentId: paymentIntent.id
            });
            
            const customerEmailResult = await emailService.sendPaymentReceiptToCustomer(reservationInfo);
            
            if (customerEmailResult.success) {
              console.log('[EMAIL] [SUCCESS] [CUSTOMER-EMAIL-SUCCESS] Customer receipt email sent successfully:', {
                paymentIntentId: paymentIntent.id,
                customerEmail: reservationInfo.email,
                messageId: customerEmailResult.messageId,
                emailId: customerEmailResult.emailId,
                timestamp: new Date().toISOString()
              });
            } else {
              console.error('[EMAIL] [FAILED] [CUSTOMER-EMAIL-FAILED] Customer receipt email failed:', {
                paymentIntentId: paymentIntent.id,
                customerEmail: reservationInfo.email,
                error: customerEmailResult.error || 'Unknown error',
                timestamp: new Date().toISOString()
              });
            }
          } else {
            console.warn('[EMAIL] [WARN] [CUSTOMER-EMAIL-SKIPPED] No customer email provided - skipping customer receipt:', {
              paymentIntentId: paymentIntent.id,
              timestamp: new Date().toISOString()
            });
          }

          console.log('[EMAIL] [SUCCESS] [EMAIL-COMPLETE] Payment success email notifications completed:', {
            paymentIntentId: paymentIntent.id,
            emailsSent: true,
            lastSuccessEmailTimestamp: currentEventTime,
            totalEmailsAttempted: reservationInfo.email ? 2 : 1,
            emailTypes: reservationInfo.email ? ['admin_confirmation', 'customer_receipt'] : ['admin_confirmation'],
            timestamp: new Date().toISOString()
          });

          // Send Twilio voice call notification for paid bookings
          if (adminEmailResult.success) {
            console.log('[TWILIO] [START] Sending Twilio voice call for payment success:', {
              paymentIntentId: paymentIntent.id,
              amount: `${reservationInfo.paymentDetails.amount} ${reservationInfo.paymentDetails.currency}`,
              timestamp: new Date().toISOString()
            });
            
            try {
              const twilioResults = await twilioService.sendNotificationsToAdmin(reservationInfo);
              console.log('[TWILIO] [SUCCESS] Twilio voice call completed:', {
                paymentIntentId: paymentIntent.id,
                voiceSuccess: twilioResults.voice.success,
                voiceCallSid: twilioResults.voice.callSid,
                timestamp: twilioResults.timestamp
              });
            } catch (twilioError) {
              console.error('[TWILIO] [FAILED] Twilio voice call failed:', {
                paymentIntentId: paymentIntent.id,
                error: twilioError.message,
                timestamp: new Date().toISOString()
              });
            }
          } else {
            console.warn('[TWILIO] [SKIPPED] Skipping Twilio voice call due to email failure:', {
              paymentIntentId: paymentIntent.id,
              timestamp: new Date().toISOString()
            });
          }

          // Mark this payment intent as processed with the specific event timestamp
          await stripe.paymentIntents.update(paymentIntent.id, {
            metadata: { 
              ...metadata,
              emailsSent: 'true',
              emailSentTimestamp: new Date().toISOString(),
              lastSuccessEmailTimestamp: currentEventTime
            }
          });
          console.log('Payment intent marked as processed for this success event');

        } catch (emailError) {
          console.error('[EMAIL] [FAILED] [EMAIL-CRITICAL-ERROR] Failed to send payment confirmation emails:', {
            paymentIntentId: paymentIntent.id,
            error: emailError.message,
            stack: emailError.stack,
            customerEmail: reservationInfo?.email || 'NOT_PROVIDED',
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency.toUpperCase(),
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
        const currentEventTime = new Date(event.created * 1000).toISOString();
        
        console.error('Payment failed:', {
          id: failedIntent.id,
          error: errorDetails,
          status: failedIntent.status,
          failureMessage: errorDetails?.message,
          failureCode: errorDetails?.code,
          eventTime: currentEventTime,
          timestamp: new Date().toISOString()
        });

        try {
          // Track this failure event to help identify retry scenarios
          await stripe.paymentIntents.update(failedIntent.id, {
            metadata: { 
              ...failedIntent.metadata,
              lastFailureTimestamp: currentEventTime,
              lastFailureReason: errorDetails?.code || 'unknown'
            }
          });

          // Get the checkout session to retrieve full reservation metadata
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: failedIntent.id,
            limit: 1,
            expand: ['data.customer']
          });

          // Use metadata from session if available
          const metadata = sessions.data.length > 0 ? sessions.data[0].metadata : {};

          // Prepare full reservation info from metadata
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
            boosterSeats: parseInt(metadata.boosterSeats) || 0,
            childSeats: parseInt(metadata.childSeats) || 0,
            skiEquipment: parseInt(metadata.skiEquipment) || 0,

            // Additional Details
            flightNumber: metadata.flightNumber,
            meetingBoard: metadata.meetingBoard,
            plannedActivities: metadata.plannedActivities,
            specialRequestDetails: metadata.specialRequestDetails,
            additionalRequests: metadata.additionalRequests,
            referenceNumber: metadata.referenceNumber,
            receiveReceipt: metadata.receiveReceipt === 'true',

            // Route Information
            routeInfo: metadata.routeDistance && metadata.routeDuration ? {
              distance: metadata.routeDistance,
              duration: metadata.routeDuration
            } : null,

            // Payment Details with failure info
            paymentDetails: {
              method: 'stripe',
              amount: failedIntent.amount / 100,
              currency: failedIntent.currency.toUpperCase(),
              timestamp: new Date().toISOString(),
              reference: failedIntent.id,
              status: 'Failed',
              error: errorDetails?.message || 'Unknown error',
              errorCode: errorDetails?.code,
              declineCode: errorDetails?.decline_code,
              bookingSource: metadata.bookingSource || 'website',
              bookingTimestamp: metadata.bookingTimestamp || new Date().toISOString(),
              locale: metadata.locale || 'en-CH'
            }
          };

          console.log('[EMAIL] [EMAIL-START] Sending payment failure notification to admin:', {
            paymentIntentId: failedIntent.id,
            failureReason: errorDetails?.code || 'unknown',
            failureMessage: errorDetails?.message || 'Unknown error',
            amount: `${reservationInfo.paymentDetails.amount} ${reservationInfo.paymentDetails.currency}`,
            customerEmail: reservationInfo.email || 'NOT_PROVIDED',
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            bookingDetails: {
              pickup: reservationInfo.pickup,
              dropoff: reservationInfo.dropoff,
              date: reservationInfo.date,
              time: reservationInfo.time,
              vehicleName: reservationInfo.selectedVehicle?.name
            },
            timestamp: new Date().toISOString()
          });

          // Send detailed notification to admin with full reservation info
          const adminEmailResult = await emailService.sendToAdmin({
            ...reservationInfo,
            isUrgent: true,
            subject: `❌ Payment Failed - ${failedIntent.amount/100} ${failedIntent.currency.toUpperCase()}`
          });

          if (adminEmailResult.success) {
            console.log('[EMAIL] [SUCCESS] [ADMIN-EMAIL-SUCCESS] Payment failure notification sent successfully:', {
              paymentIntentId: failedIntent.id,
              adminEmail: process.env.ADMIN_EMAIL,
              messageId: adminEmailResult.messageId,
              emailId: adminEmailResult.emailId,
              failureCode: errorDetails?.code,
              timestamp: new Date().toISOString()
            });
          } else {
            console.error('[EMAIL] [FAILED] [ADMIN-EMAIL-FAILED] Payment failure notification failed:', {
              paymentIntentId: failedIntent.id,
              adminEmail: process.env.ADMIN_EMAIL,
              error: adminEmailResult.error || 'Unknown error',
              failureCode: errorDetails?.code,
              timestamp: new Date().toISOString()
            });
          }
        } catch (emailError) {
          console.error('[EMAIL] [FAILED] [EMAIL-CRITICAL-ERROR] Failed to send payment failure notification:', {
            paymentIntentId: failedIntent.id,
            error: emailError.message,
            stack: emailError.stack,
            failureCode: errorDetails?.code,
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            timestamp: new Date().toISOString()
          });
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
          // Get the charge to access payment intent
          const charge = await stripe.charges.retrieve(dispute.charge);
          
          // Get the checkout session to retrieve full reservation metadata
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: charge.payment_intent,
            limit: 1,
            expand: ['data.customer']
          });

          // Use metadata from session if available
          const metadata = sessions.data.length > 0 ? sessions.data[0].metadata : {};

          // Prepare full reservation info from metadata
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
            boosterSeats: parseInt(metadata.boosterSeats) || 0,
            childSeats: parseInt(metadata.childSeats) || 0,
            skiEquipment: parseInt(metadata.skiEquipment) || 0,

            // Additional Details
            flightNumber: metadata.flightNumber,
            meetingBoard: metadata.meetingBoard,
            plannedActivities: metadata.plannedActivities,
            specialRequestDetails: metadata.specialRequestDetails,
            additionalRequests: metadata.additionalRequests,
            referenceNumber: metadata.referenceNumber,
            receiveReceipt: metadata.receiveReceipt === 'true',

            // Route Information
            routeInfo: metadata.routeDistance && metadata.routeDuration ? {
              distance: metadata.routeDistance,
              duration: metadata.routeDuration
            } : null,

            // Payment Details with dispute info
            paymentDetails: {
              method: 'stripe',
              amount: dispute.amount / 100,
              currency: dispute.currency.toUpperCase(),
              timestamp: new Date().toISOString(),
              reference: dispute.charge,
              status: 'Disputed',
              disputeId: dispute.id,
              disputeReason: dispute.reason,
              disputeStatus: dispute.status,
              evidenceDueBy: dispute.evidence_details?.due_by ? new Date(dispute.evidence_details.due_by * 1000).toISOString() : 'Not specified',
              bookingSource: metadata.bookingSource || 'website',
              bookingTimestamp: metadata.bookingTimestamp || new Date().toISOString(),
              locale: metadata.locale || 'en-CH'
            }
          };

          console.log('[EMAIL] [EMAIL-START] Sending URGENT dispute notification to admin:', {
            disputeId: dispute.id,
            chargeId: dispute.charge,
            disputeReason: dispute.reason,
            amount: `${dispute.amount/100} ${dispute.currency.toUpperCase()}`,
            customerEmail: reservationInfo.email || 'NOT_PROVIDED',
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            evidenceDueBy: reservationInfo.paymentDetails.evidenceDueBy,
            bookingDetails: {
              pickup: reservationInfo.pickup,
              dropoff: reservationInfo.dropoff,
              date: reservationInfo.date,
              time: reservationInfo.time
            },
            timestamp: new Date().toISOString()
          });

          // Send detailed notification to admin with full reservation info
          const adminEmailResult = await emailService.sendToAdmin({
            ...reservationInfo,
            isUrgent: true,
            subject: `⚠️ URGENT: Payment Dispute Received - ${dispute.amount/100} ${dispute.currency.toUpperCase()}`
          });

          if (adminEmailResult.success) {
            console.log('[EMAIL] [SUCCESS] [ADMIN-EMAIL-SUCCESS] Dispute notification sent successfully:', {
              disputeId: dispute.id,
              adminEmail: process.env.ADMIN_EMAIL,
              messageId: adminEmailResult.messageId,
              emailId: adminEmailResult.emailId,
              isUrgent: true,
              timestamp: new Date().toISOString()
            });
          } else {
            console.error('[EMAIL] [FAILED] [ADMIN-EMAIL-FAILED] URGENT dispute notification failed:', {
              disputeId: dispute.id,
              adminEmail: process.env.ADMIN_EMAIL,
              error: adminEmailResult.error || 'Unknown error',
              timestamp: new Date().toISOString()
            });
          }
        } catch (emailError) {
          console.error('[EMAIL] [FAILED] [EMAIL-CRITICAL-ERROR] Failed to send URGENT dispute notification:', {
            disputeId: dispute.id,
            chargeId: dispute.charge,
            error: emailError.message,
            stack: emailError.stack,
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            timestamp: new Date().toISOString()
          });
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
          console.log('[EMAIL] [EMAIL-START] Sending dispute resolution notification to admin:', {
            disputeId: dispute.id,
            disputeStatus: dispute.status,
            disputeOutcome: dispute.status === 'won' ? 'WON' : 'LOST',
            amount: `${dispute.amount/100} ${dispute.currency.toUpperCase()}`,
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            timestamp: new Date().toISOString()
          });

          const adminEmailResult = await emailService.sendToAdmin({
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

          if (adminEmailResult.success) {
            console.log('[EMAIL] [SUCCESS] [ADMIN-EMAIL-SUCCESS] Dispute resolution notification sent successfully:', {
              disputeId: dispute.id,
              disputeOutcome: dispute.status === 'won' ? 'WON' : 'LOST',
              adminEmail: process.env.ADMIN_EMAIL,
              messageId: adminEmailResult.messageId,
              emailId: adminEmailResult.emailId,
              timestamp: new Date().toISOString()
            });
          } else {
            console.error('[EMAIL] [FAILED] [ADMIN-EMAIL-FAILED] Dispute resolution notification failed:', {
              disputeId: dispute.id,
              disputeOutcome: dispute.status === 'won' ? 'WON' : 'LOST',
              adminEmail: process.env.ADMIN_EMAIL,
              error: adminEmailResult.error || 'Unknown error',
              timestamp: new Date().toISOString()
            });
          }
        } catch (emailError) {
          console.error('[EMAIL] [FAILED] [EMAIL-CRITICAL-ERROR] Failed to send dispute resolution notification:', {
            disputeId: dispute.id,
            disputeStatus: dispute.status,
            error: emailError.message,
            stack: emailError.stack,
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            timestamp: new Date().toISOString()
          });
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
          // Get the checkout session to retrieve full reservation metadata
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: charge.payment_intent,
            limit: 1,
            expand: ['data.customer']
          });

          // Use metadata from session if available
          const metadata = sessions.data.length > 0 ? sessions.data[0].metadata : {};

          // Prepare full reservation info from metadata
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
            boosterSeats: parseInt(metadata.boosterSeats) || 0,
            childSeats: parseInt(metadata.childSeats) || 0,
            skiEquipment: parseInt(metadata.skiEquipment) || 0,

            // Additional Details
            flightNumber: metadata.flightNumber,
            meetingBoard: metadata.meetingBoard,
            plannedActivities: metadata.plannedActivities,
            specialRequestDetails: metadata.specialRequestDetails,
            additionalRequests: metadata.additionalRequests,
            referenceNumber: metadata.referenceNumber,
            receiveReceipt: metadata.receiveReceipt === 'true',

            // Route Information
            routeInfo: metadata.routeDistance && metadata.routeDuration ? {
              distance: metadata.routeDistance,
              duration: metadata.routeDuration
            } : null,

            // Payment Details with refund info
            paymentDetails: {
              method: 'stripe',
              amount: charge.amount_refunded / 100,
              currency: charge.currency.toUpperCase(),
              timestamp: new Date().toISOString(),
              reference: charge.id,
              status: 'Refunded',
              type: 'refund',
              reason: charge.refunds?.data[0]?.reason || 'No reason provided',
              bookingSource: metadata.bookingSource || 'website',
              bookingTimestamp: metadata.bookingTimestamp || new Date().toISOString(),
              locale: metadata.locale || 'en-CH'
            }
          };

          console.log('[EMAIL] [EMAIL-START] Sending refund notifications:', {
            chargeId: charge.id,
            refundAmount: `${charge.amount_refunded/100} ${charge.currency.toUpperCase()}`,
            refundReason: charge.refunds?.data[0]?.reason || 'No reason provided',
            customerEmail: reservationInfo.email || 'NOT_PROVIDED',
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            bookingDetails: {
              pickup: reservationInfo.pickup,
              dropoff: reservationInfo.dropoff,
              date: reservationInfo.date,
              time: reservationInfo.time
            },
            timestamp: new Date().toISOString()
          });

          // Send detailed notification to admin with full reservation info
          const adminEmailResult = await emailService.sendToAdmin({
            ...reservationInfo,
            subject: `💰 Refund Processed - ${charge.amount_refunded/100} ${charge.currency.toUpperCase()}`
          });

          if (adminEmailResult.success) {
            console.log('[EMAIL] [SUCCESS] [ADMIN-EMAIL-SUCCESS] Refund notification sent to admin successfully:', {
              chargeId: charge.id,
              adminEmail: process.env.ADMIN_EMAIL,
              messageId: adminEmailResult.messageId,
              emailId: adminEmailResult.emailId,
              refundAmount: `${charge.amount_refunded/100} ${charge.currency.toUpperCase()}`,
              timestamp: new Date().toISOString()
            });
          } else {
            console.error('[EMAIL] [FAILED] [ADMIN-EMAIL-FAILED] Refund notification to admin failed:', {
              chargeId: charge.id,
              adminEmail: process.env.ADMIN_EMAIL,
              error: adminEmailResult.error || 'Unknown error',
              timestamp: new Date().toISOString()
            });
          }

          // If we have customer email in metadata, notify them too with full context
          if (reservationInfo.email) {
            console.log('[EMAIL] [CUSTOMER-EMAIL-START] Sending refund receipt to customer:', {
              customerEmail: reservationInfo.email,
              chargeId: charge.id
            });

            const customerEmailResult = await emailService.sendPaymentReceiptToCustomer(reservationInfo);
            
            if (customerEmailResult.success) {
              console.log('[EMAIL] [SUCCESS] [CUSTOMER-EMAIL-SUCCESS] Refund receipt sent to customer successfully:', {
                chargeId: charge.id,
                customerEmail: reservationInfo.email,
                messageId: customerEmailResult.messageId,
                emailId: customerEmailResult.emailId,
                timestamp: new Date().toISOString()
              });
            } else {
              console.error('[EMAIL] [FAILED] [CUSTOMER-EMAIL-FAILED] Refund receipt to customer failed:', {
                chargeId: charge.id,
                customerEmail: reservationInfo.email,
                error: customerEmailResult.error || 'Unknown error',
                timestamp: new Date().toISOString()
              });
            }
          } else {
            console.warn('[EMAIL] [WARN] [CUSTOMER-EMAIL-SKIPPED] No customer email provided - skipping customer refund receipt:', {
              chargeId: charge.id,
              timestamp: new Date().toISOString()
            });
          }
        } catch (emailError) {
          console.error('[EMAIL] [FAILED] [EMAIL-CRITICAL-ERROR] Failed to send refund notifications:', {
            chargeId: charge.id,
            error: emailError.message,
            stack: emailError.stack,
            refundAmount: `${charge.amount_refunded/100} ${charge.currency.toUpperCase()}`,
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            customerEmail: reservationInfo?.email || 'NOT_PROVIDED',
            timestamp: new Date().toISOString()
          });
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
          cancellation_reason: paymentIntent.cancellation_reason,
          created: new Date(paymentIntent.created * 1000).toISOString(),
          canceled_at: new Date().toISOString(),
          status: paymentIntent.status,
          client_secret: paymentIntent.client_secret ? 'present' : 'missing'
        });

        try {
          // Get the checkout session to retrieve full reservation metadata
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1,
            expand: ['data.customer']
          });

          // Use metadata from session if available
          const metadata = sessions.data.length > 0 ? sessions.data[0].metadata : {};

          // Prepare full reservation info from metadata
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
            boosterSeats: parseInt(metadata.boosterSeats) || 0,
            childSeats: parseInt(metadata.childSeats) || 0,
            skiEquipment: parseInt(metadata.skiEquipment) || 0,

            // Additional Details
            flightNumber: metadata.flightNumber,
            meetingBoard: metadata.meetingBoard,
            plannedActivities: metadata.plannedActivities,
            specialRequestDetails: metadata.specialRequestDetails,
            additionalRequests: metadata.additionalRequests,
            referenceNumber: metadata.referenceNumber,
            receiveReceipt: metadata.receiveReceipt === 'true',

            // Route Information
            routeInfo: metadata.routeDistance && metadata.routeDuration ? {
              distance: metadata.routeDistance,
              duration: metadata.routeDuration
            } : null,

            // Payment Details with cancellation info
            paymentDetails: {
              method: 'stripe',
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency.toUpperCase(),
              timestamp: new Date().toISOString(),
              reference: paymentIntent.id,
              status: 'Canceled',
              reason: paymentIntent.cancellation_reason || 'No reason provided',
              bookingSource: metadata.bookingSource || 'website',
              bookingTimestamp: metadata.bookingTimestamp || new Date().toISOString(),
              locale: metadata.locale || 'en-CH'
            }
          };

          console.log('[EMAIL] [EMAIL-START] Sending payment cancellation notification to admin:', {
            paymentIntentId: paymentIntent.id,
            cancellationReason: paymentIntent.cancellation_reason || 'No reason provided',
            amount: `${paymentIntent.amount/100} ${paymentIntent.currency.toUpperCase()}`,
            customerEmail: reservationInfo.email || 'NOT_PROVIDED',
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            bookingDetails: {
              pickup: reservationInfo.pickup,
              dropoff: reservationInfo.dropoff,
              date: reservationInfo.date,
              time: reservationInfo.time
            },
            timestamp: new Date().toISOString()
          });

          // Send detailed notification to admin with full reservation info
          const adminEmailResult = await emailService.sendToAdmin({
            ...reservationInfo,
            subject: `❌ Payment Canceled - ${paymentIntent.amount/100} ${paymentIntent.currency.toUpperCase()} (${paymentIntent.cancellation_reason || 'unknown'})`
          });

          if (adminEmailResult.success) {
            console.log('[EMAIL] [SUCCESS] [ADMIN-EMAIL-SUCCESS] Payment cancellation notification sent successfully:', {
              paymentIntentId: paymentIntent.id,
              adminEmail: process.env.ADMIN_EMAIL,
              messageId: adminEmailResult.messageId,
              emailId: adminEmailResult.emailId,
              cancellationReason: paymentIntent.cancellation_reason,
              timestamp: new Date().toISOString()
            });
          } else {
            console.error('[EMAIL] [FAILED] [ADMIN-EMAIL-FAILED] Payment cancellation notification failed:', {
              paymentIntentId: paymentIntent.id,
              adminEmail: process.env.ADMIN_EMAIL,
              error: adminEmailResult.error || 'Unknown error',
              cancellationReason: paymentIntent.cancellation_reason,
              timestamp: new Date().toISOString()
            });
          }
        } catch (emailError) {
          console.error('[EMAIL] [FAILED] [EMAIL-CRITICAL-ERROR] Failed to send payment cancellation notification:', {
            paymentIntentId: paymentIntent.id,
            error: emailError.message,
            stack: emailError.stack,
            cancellationReason: paymentIntent.cancellation_reason,
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            timestamp: new Date().toISOString()
          });
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
          // Get the payment intent to access checkout session
          const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent);
          
          // Get the checkout session to retrieve full reservation metadata
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1,
            expand: ['data.customer']
          });

          // Use metadata from session if available
          const metadata = sessions.data.length > 0 ? sessions.data[0].metadata : {};

          // Prepare full reservation info from metadata
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
            boosterSeats: parseInt(metadata.boosterSeats) || 0,
            childSeats: parseInt(metadata.childSeats) || 0,
            skiEquipment: parseInt(metadata.skiEquipment) || 0,

            // Additional Details
            flightNumber: metadata.flightNumber,
            meetingBoard: metadata.meetingBoard,
            plannedActivities: metadata.plannedActivities,
            specialRequestDetails: metadata.specialRequestDetails,
            additionalRequests: metadata.additionalRequests,
            referenceNumber: metadata.referenceNumber,
            receiveReceipt: metadata.receiveReceipt === 'true',

            // Route Information
            routeInfo: metadata.routeDistance && metadata.routeDuration ? {
              distance: metadata.routeDistance,
              duration: metadata.routeDuration
            } : null,

            // Payment Details with expiration info
            paymentDetails: {
              method: 'stripe',
              amount: charge.amount / 100,
              currency: charge.currency.toUpperCase(),
              timestamp: new Date().toISOString(),
              reference: charge.id,
              status: 'Expired',
              created: new Date(charge.created * 1000).toISOString(),
              bookingSource: metadata.bookingSource || 'website',
              bookingTimestamp: metadata.bookingTimestamp || new Date().toISOString(),
              locale: metadata.locale || 'en-CH'
            }
          };

          console.log('[EMAIL] [EMAIL-START] Sending payment expiration notification to admin:', {
            chargeId: charge.id,
            amount: `${charge.amount/100} ${charge.currency.toUpperCase()}`,
            chargeCreated: new Date(charge.created * 1000).toISOString(),
            customerEmail: reservationInfo.email || 'NOT_PROVIDED',
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            bookingDetails: {
              pickup: reservationInfo.pickup,
              dropoff: reservationInfo.dropoff,
              date: reservationInfo.date,
              time: reservationInfo.time
            },
            timestamp: new Date().toISOString()
          });

          // Send detailed notification to admin with full reservation info
          const adminEmailResult = await emailService.sendToAdmin({
            ...reservationInfo,
            subject: `⏰ Payment Expired - ${charge.amount/100} ${charge.currency.toUpperCase()}`
          });

          if (adminEmailResult.success) {
            console.log('[EMAIL] [SUCCESS] [ADMIN-EMAIL-SUCCESS] Payment expiration notification sent successfully:', {
              chargeId: charge.id,
              adminEmail: process.env.ADMIN_EMAIL,
              messageId: adminEmailResult.messageId,
              emailId: adminEmailResult.emailId,
              amount: `${charge.amount/100} ${charge.currency.toUpperCase()}`,
              timestamp: new Date().toISOString()
            });
          } else {
            console.error('[EMAIL] [FAILED] [ADMIN-EMAIL-FAILED] Payment expiration notification failed:', {
              chargeId: charge.id,
              adminEmail: process.env.ADMIN_EMAIL,
              error: adminEmailResult.error || 'Unknown error',
              timestamp: new Date().toISOString()
            });
          }
        } catch (emailError) {
          console.error('[EMAIL] [FAILED] [EMAIL-CRITICAL-ERROR] Failed to send payment expiration notification:', {
            chargeId: charge.id,
            error: emailError.message,
            stack: emailError.stack,
            amount: `${charge.amount/100} ${charge.currency.toUpperCase()}`,
            adminEmail: process.env.ADMIN_EMAIL || 'NOT_CONFIGURED',
            timestamp: new Date().toISOString()
          });
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