const twilio = require('twilio');
const { formatDate } = require('../utils/dateUtils');

// Initialize Twilio client with proper error handling
let client = null;
try {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (accountSid && authToken && accountSid !== 'your_twilio_account_sid_here') {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio client initialized successfully');
  } else {
    console.warn('⚠️ Twilio not configured - SMS and voice notifications disabled');
    console.warn('Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your .env file');
  }
} catch (error) {
  console.error('❌ Failed to initialize Twilio client:', error.message);
  console.warn('SMS and voice notifications will be disabled');
}

/**
 * Format reservation details for SMS/Voice messages
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Formatted message components
 */
const formatReservationMessage = (reservationInfo) => {
  const isSpecialRequest = reservationInfo.isSpecialRequest;
  const isHourly = reservationInfo.isHourly;
  const hasPayment = !!reservationInfo.paymentDetails;

  // Basic info
  const customerInfo = [
    reservationInfo.email || 'No email provided',
    reservationInfo.phone || 'No phone provided',
    reservationInfo.name || 'Name not provided'
  ].filter(Boolean).join(' | ');

  // Service type
  let serviceType = 'Distance Transfer';
  if (isSpecialRequest) serviceType = 'Special Request';
  else if (isHourly) serviceType = 'Hourly Service';

  // Location/service details
  let serviceDetails = '';
  if (isSpecialRequest) {
    serviceDetails = `Request: ${reservationInfo.specialRequest?.substring(0, 100) || 'Details in email'}`;
  } else if (isHourly) {
    serviceDetails = `Pickup: ${reservationInfo.pickup || 'Not specified'}\nDuration: ${reservationInfo.hours || '2'} hours`;
  } else {
    serviceDetails = `From: ${reservationInfo.pickup || 'Not specified'}\nTo: ${reservationInfo.dropoff || 'Not specified'}`;
  }

  // Date and time
  const dateTime = `Date: ${formatDate(reservationInfo.date)}\nTime: ${reservationInfo.time} (Swiss Time)`;

  // Payment status
  let paymentStatus = 'No payment required';
  if (hasPayment) {
    const amount = reservationInfo.paymentDetails.amount;
    const currency = reservationInfo.paymentDetails.currency?.toUpperCase() || 'CHF';
    paymentStatus = `Payment: ${amount} ${currency} - ${reservationInfo.paymentDetails.status || 'Processing'}`;
  }

  // Vehicle info (for paid bookings)
  let vehicleInfo = '';
  if (reservationInfo.selectedVehicle && !isSpecialRequest) {
    vehicleInfo = `Vehicle: ${reservationInfo.selectedVehicle.name}\nPassengers: ${reservationInfo.passengers || 'Not specified'}`;
  }

  return {
    serviceType,
    customerInfo,
    serviceDetails,
    dateTime,
    paymentStatus,
    vehicleInfo,
    isUrgent: hasPayment || isSpecialRequest,
    bookingId: reservationInfo.referenceNumber || `BK-${Date.now()}`
  };
};

/**
 * Make voice call to admin
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Call result
 */
const makeVoiceCallToAdmin = async (reservationInfo) => {
  try {
    if (!client) {
      console.warn('Twilio client not configured - skipping voice call');
      return {
        success: false,
        message: 'Twilio not configured'
      };
    }

    const adminPhone = process.env.ADMIN_PHONE;
    if (!adminPhone || adminPhone === 'your_admin_phone_number_here') {
      console.warn('Admin phone number not configured in environment variables');
      return {
        success: false,
        message: 'Admin phone number not configured'
      };
    }

    const messageData = formatReservationMessage(reservationInfo);
    
    // Create voice message content
    const voiceMessage = `Hello, this is Elite Way Limo booking system. 
    
You have received a new ${messageData.serviceType.toLowerCase()} booking.

Customer information: ${messageData.customerInfo.replace('|', ', ')}.

Service date: ${reservationInfo.date || 'Not specified'}.
Service time: ${reservationInfo.time || 'Not specified'} Swiss time.

${messageData.serviceDetails.replace(/\n/g, '. ')}.

${messageData.isUrgent ? 'This is an urgent booking requiring immediate attention. ' : ''}

Please check your email for complete booking details.

Thank you.`.trim();

    // Create TwiML URL for the voice message
    const twimlUrl = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/twilio/voice-message?message=${encodeURIComponent(voiceMessage)}`;

    console.log('Making voice call to admin:', {
      to: adminPhone,
      twimlUrl,
      isUrgent: messageData.isUrgent,
      timestamp: new Date().toISOString()
    });

    const call = await client.calls.create({
      url: twimlUrl,
      to: adminPhone,
      from: process.env.TWILIO_PHONE_NUMBER,
      method: 'GET'
    });

    console.log('Voice call initiated successfully:', {
      sid: call.sid,
      status: call.status,
      to: adminPhone,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      callSid: call.sid,
      status: call.status,
      message: 'Voice call initiated to admin'
    };

  } catch (error) {
    console.error('Failed to make voice call to admin:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to make voice call'
    };
  }
};

/**
 * Send voice call notification to admin
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Call results
 */
const sendNotificationsToAdmin = async (reservationInfo) => {
  console.log('🔔 Starting Twilio voice call for new booking:', {
    customerEmail: reservationInfo.email,
    isSpecialRequest: reservationInfo.isSpecialRequest,
    hasPayment: !!reservationInfo.paymentDetails,
    timestamp: new Date().toISOString()
  });

  const results = {
    voice: { success: false },
    timestamp: new Date().toISOString()
  };

  // Make voice call for all bookings (since that's what you want)
  try {
    results.voice = await makeVoiceCallToAdmin(reservationInfo);
  } catch (error) {
    console.error('Voice call failed:', error);
    results.voice = {
      success: false,
      error: error.message
    };
  }

  console.log('🔔 Twilio voice call completed:', {
    voiceSuccess: results.voice.success,
    callSid: results.voice.callSid,
    timestamp: results.timestamp
  });

  return results;
};

/**
 * Generate TwiML for voice messages
 * @param {string} message - The message to speak
 * @returns {string} - TwiML XML
 */
const generateVoiceTwiML = (message) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-US">${message}</Say>
</Response>`;
};

module.exports = {
  makeVoiceCallToAdmin,
  sendNotificationsToAdmin,
  generateVoiceTwiML,
  formatReservationMessage
};
