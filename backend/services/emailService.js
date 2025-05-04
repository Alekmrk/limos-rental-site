const { EmailClient } = require('@azure/communication-email');
require('dotenv').config();

// Email sender addresses configuration
const emailSenders = {
  noreply: {
    address: process.env.EMAIL_FROM || 'DoNotReply@elitewaylimo.ch',
    displayName: 'Elite Way Limo'
  },
  info: {
    address: process.env.EMAIL_INFO || 'info@elitewaylimo.ch',
    displayName: 'Elite Way Info'
  },
  contact: {
    address: process.env.EMAIL_CONTACT || 'contact@elitewaylimo.ch',
    displayName: 'Elite Way Contact'
  }
};

console.log('Email Service Configuration:', {
  connectionString: process.env.COMMUNICATION_CONNECTION_STRING?.substring(0, 50) + '...',
  emailSenders,
  adminEmail: process.env.ADMIN_EMAIL
});

// Initialize Azure Communication Services client
const emailClient = new EmailClient(process.env.COMMUNICATION_CONNECTION_STRING);

// Format date and time for email
const formatDateTime = (date, time) => {
  try {
    // Create a Date object from the date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const dt = new Date(year, month - 1, day, hours, minutes);
    
    // Format date as dd-mm-yyyy
    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    
    // Format time separately to ensure HH:mm format
    const formattedTime = dt.toLocaleTimeString('en-CH', {
      timeZone: 'Europe/Zurich',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    return `${formattedDate}, ${formattedTime} (CET)`;
  } catch (error) {
    console.error('Error formatting Swiss date/time:', error);
    return `${date} ${time} CET`;
  }
};

const formatPaymentDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-CH', {
    timeZone: 'Europe/Zurich',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const formatSwissDateTime = (date, time) => {
  try {
    // Create a Date object from the date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const dt = new Date(year, month - 1, day, hours, minutes);

    // Format time in Swiss timezone
    const swissTime = dt.toLocaleString('en-CH', {
      timeZone: 'Europe/Zurich',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZoneName: 'short'
    });

    return swissTime;
  } catch (error) {
    console.error('Error formatting Swiss date/time:', error);
    return `${date} ${time} CET`;
  }
};

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

// Send email using Azure Communication Services
const sendEmail = async (to, subject, content, senderType = 'noreply') => {
  try {
    const sender = emailSenders[senderType] || emailSenders.noreply;
    
    console.log('Sending email with Azure Communication Services:', {
      to,
      from: sender.address,
      displayName: sender.displayName,
      subject
    });

    const message = {
      senderAddress: sender.address,
      content: {
        subject,
        plainText: content.text,
        html: content.html,
      },
      recipients: {
        to: [{ address: to }]
      }
    };

    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();
    
    console.log('Email sent successfully:', {
      messageId: result.id,
      status: result.status,
      recipient: to,
      sender: sender.address
    });

    return {
      success: true,
      messageId: result.id,
      message: `Email sent to ${to}`
    };
  } catch (error) {
    console.error('Email sending failed:', {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details
    });
    
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message,
      details: {
        code: error.code,
        statusCode: error.statusCode
      }
    };
  }
};

/**
 * Send email notification to admin about a new booking or request
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Email send result
 */
const sendToAdmin = async (reservationInfo) => {
  const isSpecialRequest = reservationInfo.isSpecialRequest;
  const subject = isSpecialRequest 
    ? '🔔 New Special Request Received'
    : `🚘 New Booking: ${formatDateTime(reservationInfo.date, reservationInfo.time)}`;
  
  const content = generateEmailContent(reservationInfo, 'admin');
  return await sendEmail(process.env.ADMIN_EMAIL, subject, content, 'info');
};

/**
 * Send confirmation email to customer
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Email send result
 */
const sendToCustomer = async (reservationInfo) => {
  const isSpecialRequest = reservationInfo.isSpecialRequest;
  const subject = isSpecialRequest 
    ? 'Your Special Request Has Been Received - Limos Rental'
    : 'Your Luxury Transfer Confirmation - Limos Rental';
  
  const content = generateEmailContent(reservationInfo, 'customer');
  return await sendEmail(reservationInfo.email, subject, content, 'contact');
};

/**
 * Send payment confirmation email to admin
 * @param {Object} reservationInfo - Reservation details with payment info
 * @returns {Object} - Email send result
 */
const sendPaymentConfirmationToAdmin = async (reservationInfo) => {
  const subject = `Payment Received: ${formatDateTime(reservationInfo.date, reservationInfo.time)}`;
  const content = generateEmailContent(reservationInfo, 'admin');
  return await sendEmail(process.env.ADMIN_EMAIL, subject, content, 'info');
};

/**
 * Send payment receipt to customer
 * @param {Object} reservationInfo - Reservation details with payment info
 * @returns {Object} - Email send result
 */
const sendPaymentReceiptToCustomer = async (reservationInfo) => {
  const subject = 'Payment Receipt - Limos Rental Transfer';
  const content = generateEmailContent(reservationInfo, 'customer');
  return await sendEmail(reservationInfo.email, subject, content, 'contact');
};

/**
 * Generate email content for admin notifications
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Email content with text and HTML versions
 */
const generateEmailContent = (reservationInfo, type = 'customer') => {
  const isSpecialRequest = reservationInfo.isSpecialRequest;
  const hasPayment = !!reservationInfo.paymentDetails;
  
  // Shared CSS styles
  const styles = `
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #e5e5e5; background-color: #1a1a1a; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: gold; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; background-color: #2a2a2a; border-radius: 0 0 8px 8px; }
    .section { background-color: rgba(0, 0, 0, 0.4); padding: 24px; border-radius: 8px; margin-bottom: 24px; }
    .section-title { color: gold; font-size: 18px; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .section-content { color: #fff; }
    .section-content p { margin: 8px 0; }
    .detail-row { margin-bottom: 12px; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
  `;

  const generateSection = (title, icon, content) => `
    <div class="section">
      <h3 class="section-title">
        ${icon}
        ${title}
      </h3>
      <div class="section-content">
        ${content}
      </div>
    </div>
  `;

  // Icons (SVG)
  const icons = {
    transfer: '<svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>',
    vehicle: '<svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12v-2h-2V7l-3-3-2 2-2-2-2 2-2-2-3 3v3H3v2h2v7h14v-7h2zm-5-3.5l2 2V10h-4V8.5l2-2zm-4 0l2 2V10h-4V8.5l2-2zm-4 0l2 2V10H6V8.5l2-2z"/></svg>',
    customer: '<svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
  };

  // Generate transfer details section
  const transferDetails = isSpecialRequest 
    ? `
      <p>Date: ${formatDate(reservationInfo.date)}</p>
      <p>Preferred Time: ${reservationInfo.time} (CET)</p>
      ${reservationInfo.specialRequestDetails ? `<p>Special Request: ${reservationInfo.specialRequestDetails}</p>` : ''}
    `
    : `
      <p>From: ${reservationInfo.pickup}</p>
      ${reservationInfo.extraStops?.map(stop => stop ? `<p style="padding-left: 16px;">• ${stop}</p>` : '').join('') || ''}
      <p>To: ${reservationInfo.dropoff}</p>
      <p>Date: ${formatDate(reservationInfo.date)}</p>
      <p>Time: ${reservationInfo.time} (CET)</p>
    `;

  // Generate vehicle details section
  const vehicleDetails = `
    ${reservationInfo.selectedVehicle ? `<p>Vehicle: ${reservationInfo.selectedVehicle.name}</p>` : ''}
    <p>Passengers: ${reservationInfo.passengers}</p>
    <p>Bags: ${reservationInfo.bags}</p>
    ${reservationInfo.childSeats > 0 ? `<p>Child Seats: ${reservationInfo.childSeats}</p>` : ''}
    ${reservationInfo.babySeats > 0 ? `<p>Baby Seats: ${reservationInfo.babySeats}</p>` : ''}
    ${reservationInfo.skiEquipment > 0 ? `<p>Ski Equipment: ${reservationInfo.skiEquipment}</p>` : ''}
  `;

  // Generate customer details section
  const customerDetails = `
    <p>Email: ${reservationInfo.email}</p>
    <p>Phone: ${reservationInfo.phone}</p>
    ${reservationInfo.flightNumber ? `<p>Flight Number: ${reservationInfo.flightNumber}</p>` : ''}
    ${reservationInfo.additionalRequests ? `<p>Additional Requests: ${reservationInfo.additionalRequests}</p>` : ''}
  `;

  // Payment details section (if applicable)
  const paymentSection = hasPayment ? `
    <div class="section" style="border-left: 4px solid gold;">
      <h3 class="section-title">Payment Details</h3>
      <div class="section-content">
        <p>Payment Method: ${reservationInfo.paymentDetails.method}</p>
        <p>Amount: ${reservationInfo.paymentDetails.currency} ${reservationInfo.paymentDetails.amount}</p>
        <p>Reference: ${reservationInfo.paymentDetails.reference}</p>
        <p>Date: ${formatPaymentDateTime(reservationInfo.paymentDetails.timestamp)}</p>
      </div>
    </div>
  ` : '';

  // Generate HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${getEmailTitle(reservationInfo, type)}</h2>
        </div>
        <div class="content">
          <div style="text-align: center; margin-bottom: 32px;">
            <h2 style="font-size: 24px; margin-bottom: 8px; color: #fff;">Thank You for Choosing Us!</h2>
            <p style="color: #ccc; font-size: 18px;">
              ${getEmailIntro(reservationInfo, type)}
            </p>
          </div>
          
          ${paymentSection}
          
          ${generateSection('Transfer Details', icons.transfer, transferDetails)}
          ${generateSection('Vehicle Details', icons.vehicle, vehicleDetails)}
          ${generateSection('Customer Details', icons.customer, customerDetails)}

          <div style="text-align: center; color: #ccc; margin-top: 32px;">
            <p>If you have any questions, please contact us at info@elitewaylimo.ch</p>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Elite Way Limo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Generate plain text version
  const textContent = generatePlainTextContent(reservationInfo, type);

  return {
    text: textContent,
    html: htmlContent
  };
};

// Helper functions for email content
const getEmailTitle = (reservationInfo, type) => {
  if (type === 'admin') {
    return reservationInfo.isSpecialRequest 
      ? '🔔 New Special Request Received'
      : `🚘 New Transfer Booking`;
  } else if (reservationInfo.paymentDetails) {
    return '💳 Payment Confirmation';
  } else if (reservationInfo.isSpecialRequest) {
    return 'Special Request Received';
  }
  return 'Booking Confirmation';
};

const getEmailIntro = (reservationInfo, type) => {
  if (type === 'admin') {
    return 'A new booking has been received.';
  } else if (reservationInfo.paymentDetails) {
    return 'Your payment has been successfully processed.';
  } else if (reservationInfo.isSpecialRequest) {
    return "We'll review your request and get back to you shortly with a customized quote.";
  }
  return 'Your luxury transfer has been successfully booked.';
};

const getEmailOutro = (reservationInfo, type) => {
  if (type === 'admin') {
    return 'Please review and process this booking according to our standard procedures.';
  } else if (reservationInfo.isSpecialRequest) {
    return `We'll send a detailed response to ${reservationInfo.email}`;
  }
  return `A confirmation email has been sent to ${reservationInfo.email}`;
};

const generatePlainTextContent = (reservationInfo, type) => {
  // ... existing plain text generation code ...
  return `
Dear ${type === 'admin' ? 'Admin' : reservationInfo.firstName || 'Customer'},

${getEmailIntro(reservationInfo, type)}

${reservationInfo.paymentDetails ? `
PAYMENT DETAILS
Payment Method: ${reservationInfo.paymentDetails.method}
Amount: ${reservationInfo.paymentDetails.currency} ${reservationInfo.paymentDetails.amount}
Reference: ${reservationInfo.paymentDetails.reference}
Date: ${formatPaymentDateTime(reservationInfo.paymentDetails.timestamp)}
` : ''}

TRANSFER DETAILS
${reservationInfo.isSpecialRequest 
  ? `Date: ${formatDate(reservationInfo.date)}
Preferred Time: ${reservationInfo.time} (CET)
${reservationInfo.specialRequestDetails ? `Special Request: ${reservationInfo.specialRequestDetails}` : ''}`
  : `From: ${reservationInfo.pickup}
${reservationInfo.extraStops?.map(stop => stop ? `• ${stop}` : '').join('\n') || ''}
To: ${reservationInfo.dropoff}
Date: ${formatDate(reservationInfo.date)}
Time: ${reservationInfo.time} (CET)`}

VEHICLE DETAILS
${reservationInfo.selectedVehicle ? `Vehicle: ${reservationInfo.selectedVehicle.name}` : ''}
Passengers: ${reservationInfo.passengers}
Bags: ${reservationInfo.bags}
${reservationInfo.childSeats > 0 ? `Child Seats: ${reservationInfo.childSeats}` : ''}
${reservationInfo.babySeats > 0 ? `Baby Seats: ${reservationInfo.babySeats}` : ''}
${reservationInfo.skiEquipment > 0 ? `Ski Equipment: ${reservationInfo.skiEquipment}` : ''}

CUSTOMER DETAILS
Email: ${reservationInfo.email}
Phone: ${reservationInfo.phone}
${reservationInfo.flightNumber ? `Flight Number: ${reservationInfo.flightNumber}` : ''}
${reservationInfo.additionalRequests ? `Additional Requests: ${reservationInfo.additionalRequests}` : ''}

${getEmailOutro(reservationInfo, type)}

Best regards,
Limos Rental Team
`.trim();
};

module.exports = {
  sendToAdmin,
  sendToCustomer,
  sendPaymentConfirmationToAdmin,
  sendPaymentReceiptToCustomer,
  generateEmailContent,
  sendEmail
};