const { EmailClient } = require('@azure/communication-email');
require('dotenv').config();

// Email sender addresses configuration
const emailSenders = {
  noreply: {
    address: 'info@elitewaylimo.ch',
    displayName: 'Elite Way Limo | Reservations',
    replyTo: 'info@elitewaylimo.ch'
  },
  info: {
    address: 'info@elitewaylimo.ch',
    displayName: 'Elite Way Limo | Inquiries',
    replyTo: 'info@elitewaylimo.ch'
  },
  contact: {
    address: 'info@elitewaylimo.ch',
    displayName: 'Elite Way Limo',
    replyTo: 'info@elitewaylimo.ch'
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
const sendEmail = async (to, subject, content, from = 'noreply', attempt = 1) => {
  const maxRetries = 3;
  const retryDelay = attempt * 2000; // Exponential backoff: 2s, 4s, 6s

  try {
    console.log(`Attempt ${attempt} to send email to ${to}`, {
      subject,
      from,
      timestamp: new Date().toISOString()
    });

    const sender = emailSenders[from] || emailSenders.noreply;
    const message = {
      senderAddress: sender.address,
      content: {
        subject,
        plainText: content.text,
        html: content.html
      },
      recipients: {
        to: [{ address: to }]
      }
    };

    const poller = await emailClient.beginSend(message);
    const response = await poller.pollUntilDone();

    console.log('Email sent successfully:', {
      to,
      subject,
      from,
      messageId: response.messageId,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      messageId: response.messageId
    };
  } catch (error) {
    console.error(`Email sending failed (attempt ${attempt}):`, {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: new Date().toISOString()
    });
    
    // If we haven't reached max retries, try again after delay
    if (attempt < maxRetries) {
      console.log(`Retrying in ${retryDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return sendEmail(to, subject, content, from, attempt + 1);
    }

    throw error;
  }
};

/**
 * Send email notification to admin about a new booking or request
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Email send result
 */
const sendToAdmin = async (reservationInfo) => {
  const isSpecialRequest = reservationInfo.isSpecialRequest;
  const isUrgent = reservationInfo.isUrgent;
  
  let subject = isUrgent 
    ? reservationInfo.subject // Use provided subject for urgent matters
    : isSpecialRequest 
      ? '🔔 New Special Request Received'
      : `🚘 New Booking: ${formatDateTime(reservationInfo.date, reservationInfo.time)}`;
  
  let content;
  if (isUrgent && reservationInfo.details) {
    // Special handling for urgent notifications like disputes
    content = `
    <!DOCTYPE html>
    <html>
    <body>
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1 style="color: #ef4444; margin-bottom: 20px;">${subject}</h1>
        <div style="background: #fee2e2; border: 1px solid #ef4444; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          ${Object.entries(reservationInfo.details).map(([key, value]) => `
            <p style="margin: 10px 0;"><strong>${key}:</strong> ${value}</p>
          `).join('')}
        </div>
        <p style="color: #ef4444; font-weight: bold;">Please address this dispute immediately to avoid any issues with charge reversal.</p>
        <p>You can respond to this dispute in your Stripe Dashboard.</p>
      </div>
    </body>
    </html>
    `;
  } else {
    content = generateEmailContent(reservationInfo, 'admin');
  }
  
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
  try {
    const subject = `💳 Payment Received: ${formatDateTime(reservationInfo.date, reservationInfo.time)}`;
    const content = generateEmailContent(reservationInfo, 'admin');
    
    console.log('Sending payment confirmation to admin:', {
      email: process.env.ADMIN_EMAIL,
      subject,
      timestamp: new Date().toISOString()
    });

    return await sendEmail(process.env.ADMIN_EMAIL, subject, content, 'info');
  } catch (error) {
    console.error('Failed to send admin payment confirmation:', error);
    throw error;
  }
};

/**
 * Send payment receipt to customer
 * @param {Object} reservationInfo - Reservation details with payment info
 * @returns {Object} - Email send result
 */
const sendPaymentReceiptToCustomer = async (reservationInfo) => {
  try {
    if (!reservationInfo.email) {
      console.warn('No customer email provided for payment receipt');
      return {
        success: false,
        message: 'No customer email provided'
      };
    }

    const subject = '💳 Payment Receipt - Limos Rental Transfer';
    const content = generateEmailContent(reservationInfo, 'customer');
    
    console.log('Sending payment receipt to customer:', {
      email: reservationInfo.email,
      subject,
      timestamp: new Date().toISOString()
    });

    return await sendEmail(reservationInfo.email, subject, content, 'contact');
  } catch (error) {
    console.error('Failed to send customer payment receipt:', error);
    throw error;
  }
};

/**
 * Generate email content for admin notifications
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Email content with text and HTML versions
 */
const generateEmailContent = (reservationInfo, type = 'customer') => {
  const isSpecialRequest = reservationInfo.isSpecialRequest;
  const isHourly = reservationInfo.isHourly;
  const hasPayment = !!reservationInfo.paymentDetails;
  
  // Shared CSS styles
  const styles = `
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #e5e5e5; background-color: #1a1a1a; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: gold; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; background-color: #2a2a2a; border-radius: 0 0 8px 8px; }
    .section { background-color: rgba(0, 0, 0, 0.4); padding: 24px; border-radius: 8px; margin-bottom: 24px; }
    .section.payment { background-color: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.2); }
    .section-title { color: gold; font-size: 18px; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .section-content { color: #fff; }
    .section-content p { margin: 8px 0; }
    .section-content .subsection { margin-top: 16px; }
    .section-content .subsection-title { color: #ccc; font-size: 14px; margin-bottom: 8px; }
    .section-content .indent { padding-left: 16px; }
    .detail-row { margin-bottom: 12px; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
  `;

  const generateSection = (title, icon, content, className = '') => `
    <div class="section ${className}">
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
    payment: '<svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>',
    transfer: '<svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
    vehicle: '<svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12v-2h-2V7l-3-3-2 2-2-2-2 2-2-2-3 3v3H3v2h2v7h14v-7h2zm-5-3.5l2 2V10h-4V8.5l2-2zm-4 0l2 2V10h-4V8.5l2-2zm-4 0l2 2V10H6V8.5l2-2z"/></svg>',
    customer: '<svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
  };

  // Generate payment details section if exists
  const paymentSection = hasPayment ? `
    <p>Method: ${reservationInfo.paymentDetails.method}</p>
    <p>Amount: ${reservationInfo.paymentDetails.currency} ${reservationInfo.paymentDetails.amount}</p>
    <p>Reference: ${reservationInfo.paymentDetails.reference}</p>
  ` : '';

  // Generate transfer/request details section
  const transferDetails = isSpecialRequest 
    ? `
    <p>Date: ${formatDate(reservationInfo.date)}</p>
    <p>Preferred Time: ${reservationInfo.time} (CET)</p>
    <div class="subsection">
      <p class="subsection-title">Special Request Details:</p>
      <p>${reservationInfo.specialRequestDetails || 'No specific request provided'}</p>
      ${reservationInfo.additionalRequests ? `
        <div class="mt-4">
          <p class="subsection-title">Additional Information:</p>
          <p>${reservationInfo.additionalRequests}</p>
        </div>
      ` : ''}
    </div>
    ${reservationInfo.passengers ? `
      <div class="mt-4">
        <p class="subsection-title">Group Details:</p>
        <p>Number of Passengers: ${reservationInfo.passengers}</p>
        ${reservationInfo.bags ? `<p>Number of Bags: ${reservationInfo.bags}</p>` : ''}
      </div>
    ` : ''}
    ${reservationInfo.pickup ? `
      <div class="mt-4">
        <p class="subsection-title">Location Details:</p>
        <p>Pick Up Location: ${reservationInfo.pickup}</p>
        ${reservationInfo.dropoff ? `<p>Drop Off Location: ${reservationInfo.dropoff}</p>` : ''}
      </div>
    ` : ''}
  `
    : `
      <p>Date: ${formatDate(reservationInfo.date)}</p>
      <p>Pick Up Time: ${reservationInfo.time} (CET)</p>
      <p>From: ${reservationInfo.pickup || 'Not specified'}</p>
      ${isHourly 
        ? `<p>Duration: ${reservationInfo.hours || '2'} hours</p>
           ${reservationInfo.plannedActivities ? `
             <div class="subsection">
               <p class="subsection-title">Planned Activities:</p>
               <p>${reservationInfo.plannedActivities}</p>
             </div>
           ` : ''}`
        : `${(reservationInfo.extraStops || []).filter(Boolean).map(stop => 
            `<p class="indent">• ${stop}</p>`
          ).join('')}
          <p>To: ${reservationInfo.dropoff || 'Not specified'}</p>
          ${reservationInfo.routeInfo ? `
            <div class="subsection">
              <p class="subsection-title">Route Information:</p>
              <p>Distance: ${reservationInfo.routeInfo.distance || 'Not calculated'}</p>
              <p>Duration: ${reservationInfo.routeInfo.duration || 'Not calculated'}</p>
            </div>
          ` : ''}`
      }`;

  // Vehicle details section
  const vehicleDetails = !isSpecialRequest ? `
    <p>Vehicle: ${reservationInfo.selectedVehicle?.name || 'Not selected'}</p>
    <p>Passengers: ${reservationInfo.passengers || '0'}</p>
    <p>Bags: ${reservationInfo.bags || '0'}</p>
    ${Number(reservationInfo.childSeats) > 0 ? `<p>Child Seats (4-7): ${reservationInfo.childSeats}</p>` : ''}
    ${Number(reservationInfo.babySeats) > 0 ? `<p>Baby Seats (0-3): ${reservationInfo.babySeats}</p>` : ''}
    ${Number(reservationInfo.skiEquipment) > 0 ? `<p>Ski Equipment: ${reservationInfo.skiEquipment}</p>` : ''}
  ` : '';

  // Customer details section
  const customerDetails = `
    <p>Email: ${reservationInfo.email || 'Not provided'}</p>
    <p>Phone: ${reservationInfo.phone || 'Not provided'}</p>
    ${reservationInfo.firstName ? `<p>Name: ${reservationInfo.firstName}</p>` : ''}
    ${reservationInfo.flightNumber ? `<p>Flight Number: ${reservationInfo.flightNumber}</p>` : ''}
    ${reservationInfo.additionalRequests ? `
      <div class="subsection">
        <p class="subsection-title">${isSpecialRequest ? 'Special Request Details' : 'Additional Requests'}:</p>
        <p>${reservationInfo.additionalRequests}</p>
      </div>
    ` : ''}
  `;

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
          
          ${hasPayment ? generateSection('Payment Information', icons.payment, paymentSection, 'payment') : ''}
          ${generateSection(isSpecialRequest ? 'Request Details' : 'Transfer Details', icons.transfer, transferDetails)}
          ${!isSpecialRequest ? generateSection('Vehicle Details', icons.vehicle, vehicleDetails) : ''}
          ${generateSection('Customer Details', icons.customer, customerDetails)}

          <div style="text-align: center; color: #ccc; margin-top: 32px;">
            <p>${getEmailOutro(reservationInfo, type)}</p>
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
  const textContent = `
Dear ${type === 'admin' ? 'Admin' : reservationInfo.firstName || 'Customer'},

${getEmailIntro(reservationInfo, type)}

${hasPayment ? `
PAYMENT INFORMATION
Method: ${reservationInfo.paymentDetails.method}
Amount: ${reservationInfo.paymentDetails.currency} ${reservationInfo.paymentDetails.amount}
Reference: ${reservationInfo.paymentDetails.reference}
` : ''}

${isSpecialRequest ? 'REQUEST DETAILS' : 'TRANSFER DETAILS'}
Date: ${formatDate(reservationInfo.date)}
${isSpecialRequest ? 'Preferred' : 'Pick Up'} Time: ${reservationInfo.time} (CET)
${!isSpecialRequest ? `From: ${reservationInfo.pickup}
${!reservationInfo.isHourly ? reservationInfo.extraStops?.map(stop => stop ? `• ${stop}` : '').join('\n') : ''}
${!reservationInfo.isHourly ? `To: ${reservationInfo.dropoff}` : `Duration: ${reservationInfo.hours} hours`}` : ''}
${reservationInfo.isHourly && reservationInfo.plannedActivities ? `\nPlanned Activities: ${reservationInfo.plannedActivities}` : ''}
${!reservationInfo.isHourly && reservationInfo.routeInfo ? `\nRoute Information:
Distance: ${reservationInfo.routeInfo.distance}
Duration: ${reservationInfo.routeInfo.duration}` : ''}
${isSpecialRequest && reservationInfo.specialRequestDetails ? `\nSpecial Request: ${reservationInfo.specialRequestDetails}` : ''}

${!isSpecialRequest ? `VEHICLE DETAILS
Vehicle: ${reservationInfo.selectedVehicle?.name}
Passengers: ${reservationInfo.passengers}
Bags: ${reservationInfo.bags}
${reservationInfo.childSeats > 0 ? `Child Seats (4-7): ${reservationInfo.childSeats}` : ''}
${reservationInfo.babySeats > 0 ? `Baby Seats (0-3): ${reservationInfo.babySeats}` : ''}
${reservationInfo.skiEquipment > 0 ? `Ski Equipment: ${reservationInfo.skiEquipment}` : ''}` : ''}

CUSTOMER DETAILS
Email: ${reservationInfo.email}
Phone: ${reservationInfo.phone}
${reservationInfo.flightNumber ? `Flight Number: ${reservationInfo.flightNumber}` : ''}
${reservationInfo.additionalRequests ? `${isSpecialRequest ? 'Special Request Details' : 'Additional Requests'}: ${reservationInfo.additionalRequests}` : ''}

${getEmailOutro(reservationInfo, type)}

Best regards,
Elite Way Limo Team
`.trim();

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

${!reservationInfo.isSpecialRequest ? `VEHICLE DETAILS
Vehicle: ${reservationInfo.selectedVehicle?.name}
Passengers: ${reservationInfo.passengers}
Bags: ${reservationInfo.bags}
${reservationInfo.childSeats > 0 ? `Child Seats (4-7): ${reservationInfo.childSeats}` : ''}
${reservationInfo.babySeats > 0 ? `Baby Seats (0-3): ${reservationInfo.babySeats}` : ''}
${reservationInfo.skiEquipment > 0 ? `Ski Equipment: ${reservationInfo.skiEquipment}` : ''}` : ''}

CUSTOMER DETAILS
Email: ${reservationInfo.email}
Phone: ${reservationInfo.phone}
${reservationInfo.flightNumber ? `Flight Number: ${reservationInfo.flightNumber}` : ''}
${reservationInfo.additionalRequests ? `${reservationInfo.isSpecialRequest ? 'Special Request Details' : 'Additional Requests'}: ${reservationInfo.additionalRequests}` : ''}

${getEmailOutro(reservationInfo, type)}

Best regards,
Elite Way Limo Team
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