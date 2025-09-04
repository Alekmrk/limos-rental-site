const express = require('express');
const router = express.Router();
const twilioService = require('../services/twilioService');

/**
 * @route   GET /api/twilio/voice-message
 * @desc    Generate TwiML for voice message
 * @access  Public (Twilio webhook)
 */
router.get('/voice-message', (req, res) => {
  try {
    const { message } = req.query;
    
    if (!message) {
      return res.status(400).type('text/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-US">No message provided</Say>
</Response>`);
    }

    console.log('Generating TwiML for voice message:', {
      messageLength: message.length,
      timestamp: new Date().toISOString()
    });

    const twiml = twilioService.generateVoiceTwiML(message);
    
    res.type('text/xml').send(twiml);
  } catch (error) {
    console.error('Error generating TwiML:', error);
    res.status(500).type('text/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-US">System error occurred</Say>
</Response>`);
  }
});

/**
 * @route   POST /api/twilio/test-voice
 * @desc    Test voice call functionality
 * @access  Public (for testing)
 */
router.post('/test-voice', async (req, res) => {
  try {
    const testReservation = {
      email: 'test@example.com',
      phone: '+41123456789',
      name: 'Test Customer',
      pickup: 'Zurich Airport',
      dropoff: 'Hotel Baur au Lac',
      date: '2025-09-05',
      time: '14:30',
      isSpecialRequest: false,
      isHourly: false,
      selectedVehicle: {
        name: 'Mercedes S-Class'
      },
      passengers: '2',
      referenceNumber: 'TEST-' + Date.now()
    };

    console.log('Testing voice call functionality with test reservation');
    const result = await twilioService.makeVoiceCallToAdmin(testReservation);
    
    res.json({
      success: result.success,
      message: 'Voice call test completed',
      result
    });
  } catch (error) {
    console.error('Voice call test error:', error);
    res.status(500).json({
      success: false,
      message: 'Voice call test failed',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/twilio/status-callback
 * @desc    Handle Twilio status callbacks
 * @access  Public (Twilio webhook)
 */
router.post('/status-callback', (req, res) => {
  try {
    const { CallSid, CallStatus, To, From } = req.body;
    
    console.log('Twilio status callback received:', {
      CallSid,
      CallStatus,
      To,
      From,
      timestamp: new Date().toISOString()
    });

    // Log call status updates
    if (CallSid && CallStatus) {
      console.log(`Call ${CallSid} status: ${CallStatus}`);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling Twilio status callback:', error);
    res.status(500).send('Error');
  }
});

module.exports = router;
