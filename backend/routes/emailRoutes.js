const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const graphMailService = require('../services/graphMailService');

// Helper function for Swiss timezone
const getSwissDateTime = () => {
  const now = new Date();
  return {
    date: now.toLocaleDateString('en-CH', {
      timeZone: 'Europe/Zurich',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('.').reverse().join('-'),
    time: now.toLocaleTimeString('en-CH', {
      timeZone: 'Europe/Zurich',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  };
};

const getSwissTime = () => {
  const now = new Date();
  return now.toLocaleString('en-CH', {
    timeZone: 'Europe/Zurich',
    dateStyle: 'full',
    timeStyle: 'long'
  });
};

/**
 * @route   GET /api/email/test-email
 * @desc    Test sending email via Azure Communication Services
 * @access  Public
 */
router.get('/test-email', async (req, res) => {
  try {
    const { date, time } = getSwissDateTime();
    const testReservation = {
      email: req.query.email || process.env.ADMIN_EMAIL,
      firstName: 'Test User',
      date,
      time,
      pickup: 'Test Location',
      dropoff: 'Test Destination',
      isSpecialRequest: false,
      isHourly: false,
      selectedVehicle: { name: 'Test Vehicle' },
      passengers: 2,
      bags: 1
    };
    
    // Generate email content
    const content = {
      text: `Test Email from Elite Way Limo\n\nThis is a test email sent via Azure Communication Services to verify email delivery.\n\nTime: ${getSwissTime()}\n\nBest regards,\nElite Way Limo Team`,
      html: `
        <h1>Test Email from Elite Way Limo</h1>
        <p>This is a test email sent via Azure Communication Services to verify email delivery.</p>
        <p>Time: ${getSwissTime()}</p>
        <p>Best regards,<br>Elite Way Limo Team</p>
      `
    };
    
    // Send email using Azure Communication Services
    const result = await emailService.sendEmail(
      testReservation.email,
      'Test Email - Elite Way Limo',
      content,
      'info'
    );

    res.json({ 
      message: 'Test email sent via Azure Communication Services',
      result,
      testTime: getSwissTime(),
      sentTo: testReservation.email
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      message: 'Error sending test email', 
      error: error.message 
    });
  }
});

// Test email route for No-Reply
router.get('/test-email-noreply', async (req, res) => {
  try {
    const { date, time } = getSwissDateTime();
    const testReservation = {
      email: process.env.ADMIN_EMAIL,
      firstName: 'Test',
      date,
      time,
      pickup: 'Test Location',
      dropoff: 'Test Destination',
      isSpecialRequest: false,
      isHourly: false,
      selectedVehicle: { name: 'Test Vehicle' }
    };
    
    const content = await emailService.generateAdminEmailContent(testReservation);
    const result = await emailService.sendEmail(
      process.env.ADMIN_EMAIL,
      'Test Email from No-Reply',
      content,
      'noreply'
    );
    
    res.json({ 
      message: 'Test No-Reply email sent',
      result,
      testTime: new Date().toLocaleString('en-CH', {
        timeZone: 'Europe/Zurich',
        dateStyle: 'full',
        timeStyle: 'long'
      })
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      message: 'Error sending test email', 
      error: error.message 
    });
  }
});

// Test email route for Info
router.get('/test-email-info', async (req, res) => {
  try {
    const { date, time } = getSwissDateTime();
    const testReservation = {
      email: process.env.ADMIN_EMAIL,
      firstName: 'Test',
      date,
      time,
      pickup: 'Test Location',
      isSpecialRequest: false,
      isHourly: false,
      selectedVehicle: { name: 'Test Vehicle' }
    };
    
    const content = await emailService.generateAdminEmailContent(testReservation);
    const result = await emailService.sendEmail(
      process.env.ADMIN_EMAIL,
      'Test Email from Info',
      content,
      'info'
    );
    
    res.json({ 
      message: 'Test Info email sent',
      result,
      testTime: new Date().toLocaleString('en-CH', {
        timeZone: 'Europe/Zurich',
        dateStyle: 'full',
        timeStyle: 'long'
      })
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      message: 'Error sending test email', 
      error: error.message 
    });
  }
});

// Test email route for Contact
router.get('/test-email-contact', async (req, res) => {
  try {
    const { date, time } = getSwissDateTime();
    const testReservation = {
      email: process.env.ADMIN_EMAIL,
      firstName: 'Test',
      date,
      time,
      pickup: 'Test Location',
      isSpecialRequest: false,
      isHourly: false,
      selectedVehicle: { name: 'Test Vehicle' }
    };
    
    const content = await emailService.generateCustomerEmailContent(testReservation);
    const result = await emailService.sendEmail(
      process.env.ADMIN_EMAIL,
      'Test Email from Contact',
      content,
      'contact'
    );
    
    res.json({ 
      message: 'Test Contact email sent',
      result,
      testTime: new Date().toLocaleString('en-CH', {
        timeZone: 'Europe/Zurich',
        dateStyle: 'full',
        timeStyle: 'long'
      })
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      message: 'Error sending test email', 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/email/send-confirmation
 * @desc    Send confirmation email for a booking
 * @access  Public
 */
router.post('/send-confirmation', async (req, res) => {
  try {
    const { reservationInfo } = req.body;
    
    if (!reservationInfo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reservation information is required' 
      });
    }

    // Send email to admin
    const adminEmailResult = await emailService.sendToAdmin(reservationInfo);
    
    // Send email to customer if email is provided
    let customerEmailResult = { success: false, message: 'No customer email provided' };
    if (reservationInfo.email) {
      customerEmailResult = await emailService.sendToCustomer(reservationInfo);
    }

    res.status(200).json({
      success: true,
      adminEmail: adminEmailResult,
      customerEmail: customerEmailResult
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send confirmation email', 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/email/payment-confirmation
 * @desc    Send payment confirmation email
 * @access  Public
 */
router.post('/payment-confirmation', async (req, res) => {
  try {
    const { reservationInfo } = req.body;
    
    if (!reservationInfo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reservation information is required' 
      });
    }

    // Send payment confirmation to admin
    const adminEmailResult = await emailService.sendPaymentConfirmationToAdmin(reservationInfo);
    
    // Send payment receipt to customer if email is provided
    let customerEmailResult = { success: false, message: 'No customer email provided' };
    if (reservationInfo.email) {
      customerEmailResult = await emailService.sendPaymentReceiptToCustomer(reservationInfo);
    }

    res.status(200).json({
      success: true,
      adminEmail: adminEmailResult,
      customerEmail: customerEmailResult
    });
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send payment confirmation email', 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/email/crypto-payment
 * @desc    Send crypto payment confirmation email
 * @access  Public
 */
router.post('/crypto-payment', async (req, res) => {
  try {
    const { reservationInfo } = req.body;
    
    if (!reservationInfo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reservation information is required' 
      });
    }

    // Send payment confirmation to admin
    const adminEmailResult = await emailService.sendPaymentConfirmationToAdmin(reservationInfo);
    
    // Send payment receipt to customer if email is provided
    let customerEmailResult = { success: false, message: 'No customer email provided' };
    if (reservationInfo.email) {
      customerEmailResult = await emailService.sendPaymentReceiptToCustomer(reservationInfo);
    }

    res.status(200).json({
      success: true,
      adminEmail: adminEmailResult,
      customerEmail: customerEmailResult
    });
  } catch (error) {
    console.error('Error sending crypto payment confirmation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send payment confirmation', 
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/email/inbox
 * @desc    Get recent emails from inbox
 * @access  Private
 */
router.get('/inbox', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const messages = await graphMailService.listEmails(limit);
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching inbox:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch inbox', error: error.message });
  }
});

/**
 * @route   GET /api/email/calendar
 * @desc    Get upcoming calendar events
 * @access  Private
 */
router.get('/calendar', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const events = await graphMailService.listCalendarEvents(days);
    res.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch calendar events', error: error.message });
  }
});

/**
 * @route   POST /api/email/send-via-graph
 * @desc    Send email using Microsoft Graph API
 * @access  Private
 */
router.post('/send-via-graph', async (req, res) => {
  try {
    const { subject, content, recipients } = req.body;
    
    if (!subject || !content || !recipients || !Array.isArray(recipients)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: subject, content, recipients (array)' 
      });
    }

    const result = await graphMailService.sendEmail(subject, content, recipients);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error sending email via Graph API:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

/**
 * @route   GET /api/email/test-graph-email
 * @desc    Test sending email via Graph API
 * @access  Public
 */
router.get('/test-graph-email', async (req, res) => {
  try {
    const testEmail = {
      subject: "Test Email to Different Address via Graph API",
      content: "<h1>Test Email</h1><p>This is a test email sent to a different address via Microsoft Graph API integration.</p><p>Time: " + new Date().toLocaleString() + "</p>",
      recipients: ["aleksandarpantic98si@gmail.com"]  // Changed recipient
    };
    
    const result = await graphMailService.sendEmail(
      testEmail.subject,
      testEmail.content,
      testEmail.recipients
    );

    res.json({ 
      success: true, 
      message: 'Test email sent via Graph API',
      result 
    });
  } catch (error) {
    console.error('Error sending test email via Graph:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send test email', 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/email/calendar/create
 * @desc    Create a calendar event
 * @access  Public
 */
router.post('/calendar/create', async (req, res) => {
  try {
    const { subject, start, end, attendees } = req.body;
    
    if (!subject || !start || !end || !attendees) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: subject, start, end, attendees' 
      });
    }

    const result = await graphMailService.createCalendarEvent(subject, start, end, attendees);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create calendar event', 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/email/route-error
 * @desc    Send route error notification to admin
 * @access  Public
 */
router.post('/route-error', async (req, res) => {
  try {
    const { routeErrorInfo } = req.body;
    
    if (!routeErrorInfo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Route error information is required' 
      });
    }

    // Validate required fields
    if (!routeErrorInfo.errorType || !routeErrorInfo.pickup || !routeErrorInfo.dropoff) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: errorType, pickup, dropoff' 
      });
    }

    console.log('Sending route error notification to admin:', {
      errorType: routeErrorInfo.errorType,
      pickup: routeErrorInfo.pickup,
      dropoff: routeErrorInfo.dropoff,
      timestamp: new Date().toISOString()
    });

    // Send email to admin
    const adminEmailResult = await emailService.sendRouteErrorToAdmin(routeErrorInfo);

    res.status(200).json({
      success: true,
      message: 'Route error notification sent to admin',
      adminEmail: adminEmailResult
    });
  } catch (error) {
    console.error('Error sending route error notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send route error notification', 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/email/payment-cancelled
 * @desc    Send payment cancellation notification to admin
 * @access  Public
 */
router.post('/payment-cancelled', async (req, res) => {
  try {
    const { reservationInfo } = req.body;
    
    if (!reservationInfo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reservation information is required' 
      });
    }

    console.log('Sending payment cancellation notification to admin:', {
      email: reservationInfo.email,
      pickup: reservationInfo.pickup,
      dropoff: reservationInfo.dropoff,
      timestamp: new Date().toISOString()
    });

    // Prepare reservation info with cancellation status
    const cancellationInfo = {
      ...reservationInfo,
      paymentDetails: {
        ...reservationInfo.paymentDetails,
        status: 'User Cancelled',
        timestamp: new Date().toISOString()
      }
    };

    // Send email to admin with full reservation details
    const adminEmailResult = await emailService.sendToAdmin({
      ...cancellationInfo,
      subject: `⚠️ Payment Cancelled by User - ${cancellationInfo.pickup || 'Unknown'} to ${cancellationInfo.dropoff || 'Unknown'}`
    });

    res.status(200).json({
      success: true,
      message: 'Payment cancellation notification sent to admin',
      adminEmail: adminEmailResult
    });
  } catch (error) {
    console.error('Error sending payment cancellation notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send payment cancellation notification', 
      error: error.message 
    });
  }
});

module.exports = router;