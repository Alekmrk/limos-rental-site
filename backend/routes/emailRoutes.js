const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// Test email route
router.get('/test-email', async (req, res) => {
  try {
    const testReservation = {
      email: process.env.ADMIN_EMAIL,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      pickup: 'Test Location',
      isSpecialRequest: false,
      isHourly: false,
      selectedVehicle: { name: 'Test Vehicle' }
    };
    
    const result = await emailService.sendToAdmin(testReservation);
    res.json({ 
      message: 'Test email sent',
      result 
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