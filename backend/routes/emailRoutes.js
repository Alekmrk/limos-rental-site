const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const graphMailService = require('../services/graphMailService');
const twilioService = require('../services/twilioService');

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
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
  try {
    const { reservationInfo } = req.body;
    
    console.log(`[${requestId}] Received email confirmation request:`, {
      hasReservationInfo: !!reservationInfo,
      customerEmail: reservationInfo?.email,
      isSpecialRequest: reservationInfo?.isSpecialRequest,
      isDistanceTransfer: !reservationInfo?.isSpecialRequest && !reservationInfo?.isHourly,
      pickup: reservationInfo?.pickup,
      dropoff: reservationInfo?.dropoff,
      timestamp: new Date().toISOString()
    });
    
    if (!reservationInfo) {
      console.error(`[${requestId}] Missing reservation information`);
      return res.status(400).json({ 
        success: false, 
        message: 'Reservation information is required',
        requestId
      });
    }

    console.log(`[${requestId}] Starting admin email send...`);
    // Send email to admin
    const adminEmailResult = await emailService.sendToAdmin(reservationInfo);
    
    console.log(`[${requestId}] Admin email result:`, {
      success: adminEmailResult.success,
      messageId: adminEmailResult.messageId,
      emailId: adminEmailResult.emailId,
      error: adminEmailResult.error || 'none'
    });
    
    // Send email to customer if email is provided
    let customerEmailResult = { success: false, message: 'No customer email provided' };
    if (reservationInfo.email) {
      console.log(`[${requestId}] Starting customer email send...`);
      customerEmailResult = await emailService.sendToCustomer(reservationInfo);
      
      console.log(`[${requestId}] Customer email result:`, {
        success: customerEmailResult.success,
        messageId: customerEmailResult.messageId,
        emailId: customerEmailResult.emailId,
        error: customerEmailResult.error || 'none'
      });
    } else {
      console.warn(`[${requestId}] No customer email provided - skipping customer notification`);
    }

    console.log(`[${requestId}] Final results summary:`, {
      adminEmailSent: adminEmailResult.success,
      customerEmailSent: customerEmailResult.success,
      bothSuccessful: adminEmailResult.success && customerEmailResult.success,
      timestamp: new Date().toISOString()
    });

    // Send Twilio voice call notification if admin email was successful
    let twilioResults = { voice: { success: false } };
    if (adminEmailResult.success) {
      console.log(`[${requestId}] Starting Twilio voice call...`);
      try {
        twilioResults = await twilioService.sendNotificationsToAdmin(reservationInfo);
        console.log(`[${requestId}] Twilio voice call completed:`, {
          voiceSuccess: twilioResults.voice.success,
          callSid: twilioResults.voice.callSid,
          timestamp: twilioResults.timestamp
        });
      } catch (error) {
        console.error(`[${requestId}] Twilio voice call failed:`, error);
        twilioResults = {
          voice: { success: false, error: error.message }
        };
      }
    } else {
      console.warn(`[${requestId}] Skipping Twilio voice call due to email failure`);
    }

    res.status(200).json({
      success: true,
      requestId,
      adminEmail: adminEmailResult,
      customerEmail: customerEmailResult,
      twilioNotifications: twilioResults
    });
  } catch (error) {
    console.error(`[${requestId}] Error sending confirmation email:`, {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send confirmation email', 
      error: error.message,
      requestId
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

/**
 * @route   POST /api/email/contact-form
 * @desc    Send contact form submission to admin
 * @access  Public
 */
router.post('/contact-form', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, email, subject, message' 
      });
    }

    console.log('Sending contact form submission to admin:', {
      name,
      email,
      subject,
      timestamp: new Date().toISOString()
    });

    // Prepare contact form data for email
    const contactInfo = {
      name,
      email,
      phone: phone || 'Not provided',
      subject,
      message,
      submittedAt: new Date().toISOString(),
      isContactForm: true
    };

    // Generate email content for contact form
    const emailSubject = `📞 New Contact Form: ${subject}`;
    const content = generateContactFormEmailContent(contactInfo);

    // Send email to admin
    const adminEmailResult = await emailService.sendEmail(
      process.env.ADMIN_EMAIL,
      emailSubject,
      content,
      'contact'
    );

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      adminEmail: adminEmailResult
    });
  } catch (error) {
    console.error('Error sending contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send contact form', 
      error: error.message 
    });
  }
});

/**
 * Generate email content for contact form submissions
 * @param {Object} contactInfo - Contact form data
 * @returns {Object} - Email content with text and HTML versions
 */
function generateContactFormEmailContent(contactInfo) {
  const timestamp = new Date().toLocaleString('en-CH', {
    timeZone: 'Europe/Zurich',
    dateStyle: 'full',
    timeStyle: 'long'
  });

  // HTML version
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #e5e5e5; background-color: #1a1a1a; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: gold; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background-color: #2a2a2a; border-radius: 0 0 8px 8px; }
        .section { background-color: rgba(0, 0, 0, 0.4); padding: 24px; border-radius: 8px; margin-bottom: 24px; }
        .section-title { color: gold; font-size: 18px; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .section-content { color: #fff; }
        .section-content p { margin: 8px 0; }
        .message-content { background-color: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.2); padding: 16px; border-radius: 8px; font-style: italic; }
        .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: gold; font-size: 28px; margin: 0; font-weight: bold;">Elite Way Limo</h1>
          <h2 style="margin: 10px 0 0 0;">📞 New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div style="text-align: center; margin-bottom: 32px;">
            <p style="color: #ccc; font-size: 18px;">
              A new contact form has been submitted through the website.
            </p>
          </div>
          
          <div class="section">
            <h3 class="section-title">
              📋 Contact Information
            </h3>
            <div class="section-content">
              <p><strong>Name:</strong> ${contactInfo.name}</p>
              <p><strong>Email:</strong> ${contactInfo.email}</p>
              <p><strong>Phone:</strong> ${contactInfo.phone}</p>
              <p><strong>Subject:</strong> ${contactInfo.subject}</p>
              <p><strong>Submitted:</strong> ${timestamp}</p>
            </div>
          </div>

          <div class="section">
            <h3 class="section-title">
              💬 Message
            </h3>
            <div class="section-content">
              <div class="message-content">
                ${contactInfo.message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>

          <div style="text-align: center; color: #ccc; margin-top: 32px;">
            <p>Please respond to this inquiry promptly to maintain our high service standards.</p>
            <p>Reply directly to: ${contactInfo.email}</p>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Elite Way Limo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Plain text version
  const textContent = `
NEW CONTACT FORM SUBMISSION

Contact Information:
- Name: ${contactInfo.name}
- Email: ${contactInfo.email}
- Phone: ${contactInfo.phone}
- Subject: ${contactInfo.subject}
- Submitted: ${timestamp}

Message:
${contactInfo.message}

Please respond to this inquiry promptly to maintain our high service standards.
Reply directly to: ${contactInfo.email}

Best regards,
Elite Way Limo System
`.trim();

  return {
    text: textContent,
    html: htmlContent
  };
}

module.exports = router;