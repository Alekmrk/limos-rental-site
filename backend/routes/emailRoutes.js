const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

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

// Test email route
router.get('/test-email', async (req, res) => {
  try {
    const { date, time } = getSwissDateTime();
    const testReservation = {
      email: process.env.ADMIN_EMAIL,
      date,
      time,
      pickup: 'Test Location',
      isSpecialRequest: false,
      isHourly: false,
      selectedVehicle: { name: 'Test Vehicle' }
    };
    
    const result = await emailService.sendToAdmin(testReservation);
    res.json({ 
      message: 'Test email sent',
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

// Test email route for DoNotReply
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
      'Test Email from DoNotReply',
      content,
      'noreply'
    );
    
    res.json({ 
      message: 'Test DoNotReply email sent',
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

module.exports = router;