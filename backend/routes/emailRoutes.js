const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

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