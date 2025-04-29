const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object with enhanced logging
const createTransporter = () => {
  console.log("Creating email transporter with the following settings:");
  console.log(`- Host: ${process.env.EMAIL_HOST}`);
  console.log(`- Port: ${process.env.EMAIL_PORT}`);
  console.log(`- User: ${process.env.EMAIL_USER}`);
  console.log(`- From: ${process.env.EMAIL_FROM}`);
  console.log(`- Secure: ${process.env.EMAIL_PORT === '465'}`);
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, // Enable additional debug logging
    logger: true  // Log transport activity
  });
};

// Format date and time for email
const formatDateTime = (date, time) => {
  return `${date} at ${time}`;
};

/**
 * Send email notification to admin about a new booking or request
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Email send result
 */
const sendToAdmin = async (reservationInfo) => {
  try {
    console.log("sendToAdmin called with reservation info:", JSON.stringify(reservationInfo, null, 2));
    const transporter = createTransporter();
    const isSpecialRequest = reservationInfo.isSpecialRequest;
    
    // Create email subject
    const subject = isSpecialRequest 
      ? `New Special Request: ${reservationInfo.date}`
      : `New Transfer Booking: ${formatDateTime(reservationInfo.date, reservationInfo.time)}`;
    
    // Generate email content
    const content = generateAdminEmailContent(reservationInfo);
    
    console.log(`Attempting to send email to admin (${process.env.ADMIN_EMAIL})...`);

    // Send email
    const info = await transporter.sendMail({
      from: `"Limos Rental" <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      text: content.text,
      html: content.html
    });

    console.log('Email sent to admin successfully:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    return {
      success: true,
      messageId: info.messageId,
      message: `Email sent to ${process.env.ADMIN_EMAIL}`,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Error sending email to admin:', error);
    return {
      success: false,
      message: 'Failed to send email to admin',
      error: error.message
    };
  }
};

/**
 * Send confirmation email to customer
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Email send result
 */
const sendToCustomer = async (reservationInfo) => {
  try {
    const transporter = createTransporter();
    const isSpecialRequest = reservationInfo.isSpecialRequest;
    
    // Create email subject
    const subject = isSpecialRequest 
      ? 'Your Special Request Has Been Received - Limos Rental'
      : 'Your Luxury Transfer Confirmation - Limos Rental';
    
    // Generate email content
    const content = generateCustomerEmailContent(reservationInfo);

    // Send email
    const info = await transporter.sendMail({
      from: `"Limos Rental" <${process.env.EMAIL_FROM}>`,
      to: reservationInfo.email,
      subject: subject,
      text: content.text,
      html: content.html
    });

    console.log('Email sent to customer:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: `Email sent to ${reservationInfo.email}`
    };
  } catch (error) {
    console.error('Error sending email to customer:', error);
    return {
      success: false,
      message: 'Failed to send email to customer',
      error: error.message
    };
  }
};

/**
 * Send payment confirmation email to admin
 * @param {Object} reservationInfo - Reservation details with payment info
 * @returns {Object} - Email send result
 */
const sendPaymentConfirmationToAdmin = async (reservationInfo) => {
  try {
    const transporter = createTransporter();
    
    // Create email subject
    const subject = `Payment Received: ${formatDateTime(reservationInfo.date, reservationInfo.time)}`;
    
    // Generate payment email content
    const content = generatePaymentEmailForAdmin(reservationInfo);

    // Send email
    const info = await transporter.sendMail({
      from: `"Limos Rental" <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      text: content.text,
      html: content.html
    });

    console.log('Payment email sent to admin:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: `Payment notification sent to ${process.env.ADMIN_EMAIL}`
    };
  } catch (error) {
    console.error('Error sending payment email to admin:', error);
    return {
      success: false,
      message: 'Failed to send payment notification to admin',
      error: error.message
    };
  }
};

/**
 * Send payment receipt to customer
 * @param {Object} reservationInfo - Reservation details with payment info
 * @returns {Object} - Email send result
 */
const sendPaymentReceiptToCustomer = async (reservationInfo) => {
  try {
    const transporter = createTransporter();
    
    // Create email subject
    const subject = 'Payment Receipt - Limos Rental Transfer';
    
    // Generate payment receipt content
    const content = generatePaymentReceiptForCustomer(reservationInfo);

    // Send email
    const info = await transporter.sendMail({
      from: `"Limos Rental" <${process.env.EMAIL_FROM}>`,
      to: reservationInfo.email,
      subject: subject,
      text: content.text,
      html: content.html
    });

    console.log('Payment receipt sent to customer:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: `Payment receipt sent to ${reservationInfo.email}`
    };
  } catch (error) {
    console.error('Error sending payment receipt to customer:', error);
    return {
      success: false,
      message: 'Failed to send payment receipt to customer',
      error: error.message
    };
  }
};

/**
 * Generate email content for admin notifications
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Email content with text and HTML versions
 */
const generateAdminEmailContent = (reservationInfo) => {
  const isSpecialRequest = reservationInfo.isSpecialRequest;
  
  // Generate plain text version
  const details = [];
  
  // Add customer details
  details.push(`Customer: ${reservationInfo.email} | ${reservationInfo.phone || 'No phone'}`);
  details.push(`Date: ${reservationInfo.date}`);
  details.push(`Time: ${reservationInfo.time}`);
  
  if (isSpecialRequest) {
    // Special request specific info
    details.push(`Request Type: Special Request`);
    if (reservationInfo.specialRequestDetails) {
      details.push(`Request Details: ${reservationInfo.specialRequestDetails}`);
    }
    if (reservationInfo.additionalRequests) {
      details.push(`Additional Notes: ${reservationInfo.additionalRequests}`);
    }
  } else {
    // Standard transfer specific info
    details.push(`Service Type: ${reservationInfo.isHourly ? 'Hourly' : 'Point-to-Point'}`);
    
    if (reservationInfo.isHourly) {
      details.push(`Duration: ${reservationInfo.hours} hours`);
      details.push(`Pickup: ${reservationInfo.pickup}`);
      if (reservationInfo.plannedActivities) {
        details.push(`Planned Activities: ${reservationInfo.plannedActivities}`);
      }
    } else {
      details.push(`Route: ${reservationInfo.pickup} → ${reservationInfo.dropoff}`);
      if (reservationInfo.extraStops && reservationInfo.extraStops.length > 0) {
        const validStops = reservationInfo.extraStops.filter(stop => stop && stop.trim());
        if (validStops.length > 0) {
          details.push(`Extra Stops: ${validStops.join(' | ')}`);
        }
      }
      if (reservationInfo.distance) {
        details.push(`Distance: ${reservationInfo.distance}`);
      }
      if (reservationInfo.duration) {
        details.push(`Duration: ${reservationInfo.duration}`);
      }
    }
    
    // Vehicle and passenger details
    if (reservationInfo.selectedVehicle) {
      details.push(`Vehicle: ${reservationInfo.selectedVehicle.name}`);
    }
    details.push(`Passengers: ${reservationInfo.passengers || 1}`);
    details.push(`Bags: ${reservationInfo.bags || 0}`);
    
    if (reservationInfo.childSeats > 0) {
      details.push(`Child Seats: ${reservationInfo.childSeats}`);
    }
    if (reservationInfo.babySeats > 0) {
      details.push(`Baby Seats: ${reservationInfo.babySeats}`);
    }
    if (reservationInfo.skiEquipment > 0) {
      details.push(`Ski Equipment: ${reservationInfo.skiEquipment}`);
    }
    if (reservationInfo.flightNumber) {
      details.push(`Flight Number: ${reservationInfo.flightNumber}`);
    }
    if (reservationInfo.additionalRequests) {
      details.push(`Additional Requests: ${reservationInfo.additionalRequests}`);
    }
  }

  const textContent = details.join('\n');
  
  // Generate HTML version
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: gold; padding: 10px 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #666; }
        .detail-row { margin-bottom: 10px; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New ${isSpecialRequest ? 'Special Request' : 'Transfer Booking'}</h2>
        </div>
        <div class="content">
          ${details.map(detail => {
            const [label, value] = detail.includes(':') ? detail.split(':', 2) : [detail, ''];
            return `<div class="detail-row"><span class="label">${label}:</span> ${value}</div>`;
          }).join('')}
        </div>
        <div class="footer">
          <p>This is an automated notification from your Limos Rental website.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    text: textContent,
    html: htmlContent
  };
};

/**
 * Generate email content for customer confirmations
 * @param {Object} reservationInfo - Reservation details
 * @returns {Object} - Email content with text and HTML versions
 */
const generateCustomerEmailContent = (reservationInfo) => {
  const isSpecialRequest = reservationInfo.isSpecialRequest;
  
  // Generate intro text
  const intro = isSpecialRequest
    ? 'Thank you for your special request. We will review your requirements and get back to you shortly.'
    : 'Thank you for your booking. Your luxury transfer has been confirmed.';
  
  // Generate details
  const details = [];
  
  // Basic info for all bookings
  details.push(`Date: ${reservationInfo.date}`);
  details.push(`Time: ${reservationInfo.time}`);
  
  if (isSpecialRequest) {
    // No additional details needed for now
  } else {
    // Standard transfer details
    if (reservationInfo.isHourly) {
      details.push(`Service Type: Hourly Service (${reservationInfo.hours} hours)`);
      details.push(`Pickup Location: ${reservationInfo.pickup}`);
    } else {
      details.push('Service Type: Point-to-Point Transfer');
      details.push(`From: ${reservationInfo.pickup}`);
      if (reservationInfo.extraStops && reservationInfo.extraStops.length > 0) {
        const validStops = reservationInfo.extraStops.filter(stop => stop && stop.trim());
        if (validStops.length > 0) {
          details.push(`Extra Stops: ${validStops.join(', ')}`);
        }
      }
      details.push(`To: ${reservationInfo.dropoff}`);
    }
    
    // Vehicle details
    if (reservationInfo.selectedVehicle) {
      details.push(`Vehicle: ${reservationInfo.selectedVehicle.name}`);
    }
  }
  
  // Generate outro text
  const outro = isSpecialRequest
    ? 'We will send you a detailed proposal within 24 hours. If you have any questions in the meantime, please contact our customer service.'
    : 'We look forward to providing you with a luxurious and comfortable journey. If you need to make any changes to your reservation, please contact our customer service at least 24 hours before your scheduled pickup.';
  
  // Generate plain text content
  const textContent = `
Dear ${reservationInfo.firstName || 'Customer'},

${intro}

${details.join('\n')}

${outro}

Best regards,
Limos Rental Team
  `.trim();
  
  // Generate HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: gold; padding: 10px 20px; text-align: center; }
        .content { padding: 20px; }
        .intro { margin-bottom: 20px; }
        .details { margin-bottom: 20px; }
        .detail-row { margin-bottom: 8px; }
        .outro { margin-bottom: 20px; }
        .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${isSpecialRequest ? 'Special Request Received' : 'Booking Confirmation'}</h2>
        </div>
        <div class="content">
          <div class="intro">
            <p>Dear ${reservationInfo.firstName || 'Customer'},</p>
            <p>${intro}</p>
          </div>
          
          <div class="details">
            ${details.map(detail => {
              const [label, value] = detail.includes(':') ? detail.split(':', 2) : [detail, ''];
              return `<div class="detail-row"><strong>${label}:</strong> ${value}</div>`;
            }).join('')}
          </div>
          
          <div class="outro">
            <p>${outro}</p>
          </div>
          
          <p>Best regards,<br>Limos Rental Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Limos Rental. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    text: textContent,
    html: htmlContent
  };
};

/**
 * Generate payment notification email for admin
 * @param {Object} reservationInfo - Reservation details with payment info
 * @returns {Object} - Email content with text and HTML versions
 */
const generatePaymentEmailForAdmin = (reservationInfo) => {
  const { paymentDetails } = reservationInfo;
  
  // Generate plain text version
  const details = [
    `Payment Method: ${paymentDetails?.method || 'Not specified'}`,
    `Amount: ${paymentDetails?.currency || 'CHF'} ${paymentDetails?.amount || 0}`,
    `Reference: ${paymentDetails?.reference || 'N/A'}`,
    `Date: ${new Date(paymentDetails?.timestamp || Date.now()).toLocaleString()}`,
    ``,
    `Customer: ${reservationInfo.email} | ${reservationInfo.phone || 'No phone'}`,
    `Reservation Date: ${reservationInfo.date} at ${reservationInfo.time}`,
  ];
  
  if (reservationInfo.isHourly) {
    details.push(`Service: Hourly (${reservationInfo.hours} hours)`);
    details.push(`Location: ${reservationInfo.pickup}`);
  } else {
    details.push(`Service: Point-to-Point Transfer`);
    details.push(`From: ${reservationInfo.pickup}`);
    details.push(`To: ${reservationInfo.dropoff}`);
  }
  
  if (reservationInfo.selectedVehicle) {
    details.push(`Vehicle: ${reservationInfo.selectedVehicle.name}`);
  }
  
  const textContent = details.join('\n');
  
  // Generate HTML version
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: gold; padding: 10px 20px; text-align: center; }
        .content { padding: 20px; }
        .payment-info { background-color: #f9f9f9; padding: 15px; border-left: 4px solid gold; margin-bottom: 20px; }
        .reservation-info { margin-top: 20px; }
        .detail-row { margin-bottom: 10px; }
        .label { font-weight: bold; }
        .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Payment Received</h2>
        </div>
        <div class="content">
          <div class="payment-info">
            <div class="detail-row"><span class="label">Payment Method:</span> ${paymentDetails?.method || 'Not specified'}</div>
            <div class="detail-row"><span class="label">Amount:</span> ${paymentDetails?.currency || 'CHF'} ${paymentDetails?.amount || 0}</div>
            <div class="detail-row"><span class="label">Reference:</span> ${paymentDetails?.reference || 'N/A'}</div>
            <div class="detail-row"><span class="label">Date:</span> ${new Date(paymentDetails?.timestamp || Date.now()).toLocaleString()}</div>
          </div>
          
          <div class="reservation-info">
            <h3>Reservation Details</h3>
            <div class="detail-row"><span class="label">Customer:</span> ${reservationInfo.email} | ${reservationInfo.phone || 'No phone'}</div>
            <div class="detail-row"><span class="label">Date:</span> ${reservationInfo.date} at ${reservationInfo.time}</div>
            ${reservationInfo.isHourly 
              ? `<div class="detail-row"><span class="label">Service:</span> Hourly (${reservationInfo.hours} hours)</div>
                 <div class="detail-row"><span class="label">Location:</span> ${reservationInfo.pickup}</div>`
              : `<div class="detail-row"><span class="label">Service:</span> Point-to-Point Transfer</div>
                 <div class="detail-row"><span class="label">From:</span> ${reservationInfo.pickup}</div>
                 <div class="detail-row"><span class="label">To:</span> ${reservationInfo.dropoff}</div>`
            }
            ${reservationInfo.selectedVehicle 
              ? `<div class="detail-row"><span class="label">Vehicle:</span> ${reservationInfo.selectedVehicle.name}</div>`
              : ''
            }
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from your Limos Rental website.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    text: textContent,
    html: htmlContent
  };
};

/**
 * Generate payment receipt email for customer
 * @param {Object} reservationInfo - Reservation details with payment info
 * @returns {Object} - Email content with text and HTML versions
 */
const generatePaymentReceiptForCustomer = (reservationInfo) => {
  const { paymentDetails } = reservationInfo;
  
  // Generate plain text content
  const textContent = `
Dear ${reservationInfo.firstName || 'Customer'},

Thank you for your payment. This email confirms that we have received your payment for the luxury transfer booking.

PAYMENT DETAILS
Payment Method: ${paymentDetails?.method || 'Not specified'}
Amount: ${paymentDetails?.currency || 'CHF'} ${paymentDetails?.amount || 0}
Reference: ${paymentDetails?.reference || 'N/A'}
Date: ${new Date(paymentDetails?.timestamp || Date.now()).toLocaleString()}

RESERVATION DETAILS
Date: ${reservationInfo.date}
Time: ${reservationInfo.time}
${reservationInfo.isHourly 
  ? `Service: Hourly (${reservationInfo.hours} hours)\nPickup Location: ${reservationInfo.pickup}`
  : `Service: Point-to-Point Transfer\nFrom: ${reservationInfo.pickup}\nTo: ${reservationInfo.dropoff}`
}
${reservationInfo.selectedVehicle ? `Vehicle: ${reservationInfo.selectedVehicle.name}` : ''}

We look forward to providing you with a luxurious and comfortable journey. If you need to make any changes to your reservation, please contact our customer service at least 24 hours before your scheduled pickup.

Best regards,
Limos Rental Team
  `.trim();
  
  // Generate HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: gold; padding: 10px 20px; text-align: center; }
        .content { padding: 20px; }
        .intro { margin-bottom: 20px; }
        .payment-info { background-color: #f9f9f9; padding: 15px; border-left: 4px solid gold; margin-bottom: 20px; }
        .reservation-info { margin-top: 20px; margin-bottom: 20px; }
        .detail-row { margin-bottom: 8px; }
        .outro { margin-bottom: 20px; }
        .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Payment Receipt</h2>
        </div>
        <div class="content">
          <div class="intro">
            <p>Dear ${reservationInfo.firstName || 'Customer'},</p>
            <p>Thank you for your payment. This email confirms that we have received your payment for the luxury transfer booking.</p>
          </div>
          
          <div class="payment-info">
            <h3>Payment Details</h3>
            <div class="detail-row"><strong>Payment Method:</strong> ${paymentDetails?.method || 'Not specified'}</div>
            <div class="detail-row"><strong>Amount:</strong> ${paymentDetails?.currency || 'CHF'} ${paymentDetails?.amount || 0}</div>
            <div class="detail-row"><strong>Reference:</strong> ${paymentDetails?.reference || 'N/A'}</div>
            <div class="detail-row"><strong>Date:</strong> ${new Date(paymentDetails?.timestamp || Date.now()).toLocaleString()}</div>
          </div>
          
          <div class="reservation-info">
            <h3>Reservation Details</h3>
            <div class="detail-row"><strong>Date:</strong> ${reservationInfo.date}</div>
            <div class="detail-row"><strong>Time:</strong> ${reservationInfo.time}</div>
            ${reservationInfo.isHourly 
              ? `<div class="detail-row"><strong>Service:</strong> Hourly (${reservationInfo.hours} hours)</div>
                 <div class="detail-row"><strong>Pickup Location:</strong> ${reservationInfo.pickup}</div>`
              : `<div class="detail-row"><strong>Service:</strong> Point-to-Point Transfer</div>
                 <div class="detail-row"><strong>From:</strong> ${reservationInfo.pickup}</div>
                 <div class="detail-row"><strong>To:</strong> ${reservationInfo.dropoff}</div>`
            }
            ${reservationInfo.selectedVehicle 
              ? `<div class="detail-row"><strong>Vehicle:</strong> ${reservationInfo.selectedVehicle.name}</div>`
              : ''
            }
          </div>
          
          <div class="outro">
            <p>We look forward to providing you with a luxurious and comfortable journey. If you need to make any changes to your reservation, please contact our customer service at least 24 hours before your scheduled pickup.</p>
          </div>
          
          <p>Best regards,<br>Limos Rental Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Limos Rental. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    text: textContent,
    html: htmlContent
  };
};

module.exports = {
  sendToAdmin,
  sendToCustomer,
  sendPaymentConfirmationToAdmin,
  sendPaymentReceiptToCustomer
};