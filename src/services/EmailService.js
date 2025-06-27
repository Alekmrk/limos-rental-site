// Email service for sending notifications via the backend API

// API base URL - dynamically set based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.elitewaylimo.ch/api/email'  // Updated to match your actual production domain
  : 'http://localhost:3001/api/email';       // Updated to match your backend port

/**
 * Prepares reservation data for sending by removing large unnecessary fields
 * that may cause payload size issues
 * @param {Object} reservationInfo - The full reservation information
 * @returns {Object} - Sanitized reservation data
 */
const prepareReservationData = (reservationInfo) => {
  // Create a copy to avoid modifying the original
  const sanitizedData = JSON.parse(JSON.stringify(reservationInfo));
  
  // Remove potentially large or unnecessary fields
  const fieldsToRemove = [
    'routeInfo',
    'optimizedWaypoints',
    'pickupPlaceInfo',
    'dropoffPlaceInfo',
    'extraStopsPlaceInfo'
  ];
  
  fieldsToRemove.forEach(field => {
    if (sanitizedData[field]) {
      delete sanitizedData[field];
    }
  });
  
  // Keep only essential vehicle info
  if (sanitizedData.selectedVehicle) {
    sanitizedData.selectedVehicle = {
      id: sanitizedData.selectedVehicle.id,
      name: sanitizedData.selectedVehicle.name
    };
  }
  
  return sanitizedData;
};

/**
 * Send an email notification about a confirmed transfer
 * @param {Object} reservationInfo - The reservation information
 * @param {string} adminEmail - The admin email address (will be read from backend environment)
 * @returns {Promise} - A promise that resolves when the email is sent
 */
export const sendTransferConfirmationToAdmin = async (reservationInfo) => {
  const requestId = `FRONTEND-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
  console.log(`[${requestId}] Starting transfer confirmation email process:`, {
    customerEmail: reservationInfo.email,
    isDistanceTransfer: !reservationInfo.isSpecialRequest && !reservationInfo.isHourly,
    isSpecialRequest: reservationInfo.isSpecialRequest,
    isHourly: reservationInfo.isHourly,
    hasPaymentDetails: !!reservationInfo.paymentDetails,
    pickup: reservationInfo.pickup,
    dropoff: reservationInfo.dropoff,
    date: reservationInfo.date,
    time: reservationInfo.time,
    timestamp: new Date().toISOString()
  });
  
  // Prepare data for sending
  const sanitizedReservationInfo = prepareReservationData(reservationInfo);
  console.log(`[${requestId}] API URL:`, `${API_BASE_URL}/send-confirmation`);
  console.log(`[${requestId}] Prepared sanitized data for API - removed large fields to prevent payload issues`);

  try {
    console.log(`[${requestId}] Making API request...`);
    const response = await fetch(`${API_BASE_URL}/send-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reservationInfo: sanitizedReservationInfo }),
    });

    console.log(`[${requestId}] API response status:`, response.status);
    
    // Handle non-JSON responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] API returned error status ${response.status}:`, errorText);
      
      try {
        // Try to parse as JSON first
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || 'Failed to send confirmation email');
      } catch (parseError) {
        // If parsing failed, use the text directly
        throw new Error(`Failed to send email: ${errorText || response.statusText}`);
      }
    }
    
    const result = await response.json();
    console.log(`[${requestId}] API response body:`, {
      success: result.success,
      requestId: result.requestId,
      adminEmailSent: result.adminEmail?.success,
      customerEmailSent: result.customerEmail?.success,
      adminMessageId: result.adminEmail?.messageId,
      customerMessageId: result.customerEmail?.messageId,
      errors: {
        admin: result.adminEmail?.error || 'none',
        customer: result.customerEmail?.error || 'none'
      }
    });

    // Log specific issues with admin email delivery
    if (!result.adminEmail?.success) {
      console.error(`[${requestId}] ❌ ADMIN EMAIL FAILED:`, {
        adminEmailResult: result.adminEmail,
        possibleCauses: [
          'Azure Communication Services issue',
          'Invalid admin email address in environment',
          'Email service configuration problem',
          'Network connectivity issue'
        ]
      });
    } else {
      console.log(`[${requestId}] ✅ ADMIN EMAIL SENT SUCCESSFULLY:`, {
        messageId: result.adminEmail.messageId,
        emailId: result.adminEmail.emailId
      });
    }

    // Log customer email status
    if (reservationInfo.email && !result.customerEmail?.success) {
      console.warn(`[${requestId}] ⚠️ CUSTOMER EMAIL FAILED:`, {
        customerEmail: reservationInfo.email,
        customerEmailResult: result.customerEmail
      });
    } else if (reservationInfo.email && result.customerEmail?.success) {
      console.log(`[${requestId}] ✅ CUSTOMER EMAIL SENT SUCCESSFULLY:`, {
        customerEmail: reservationInfo.email,
        messageId: result.customerEmail.messageId
      });
    }
    
    return {
      success: result.success,
      message: result.adminEmail?.message || 'Confirmation email processed',
      requestId: result.requestId,
      adminEmailResult: result.adminEmail,
      customerEmailResult: result.customerEmail
    };
  } catch (error) {
    console.error(`[${requestId}] Error sending email via API:`, {
      error: error.message,
      stack: error.stack,
      apiUrl: `${API_BASE_URL}/send-confirmation`,
      timestamp: new Date().toISOString()
    });
    
    console.error(`[${requestId}] Error details:`, error.stack);
    return {
      success: false,
      message: 'Failed to send confirmation email',
      error: error.message,
      requestId
    };
  }
};

/**
 * Send a confirmation email to the customer
 * @param {Object} reservationInfo - The reservation information
 * @returns {Promise} - A promise that resolves when the email is sent
 */
export const sendConfirmationToCustomer = async (reservationInfo) => {
  if (!reservationInfo.email) {
    return {
      success: false,
      message: 'No customer email provided'
    };
  }
  
  // This is now handled by the backend API in the same call as sendTransferConfirmationToAdmin
  // The API will automatically send to both admin and customer if an email is provided
  console.log(`Customer email will be sent via backend API to: ${reservationInfo.email}`);
  
  return {
    success: true,
    message: `Confirmation email will be sent to ${reservationInfo.email}`
  };
};

/**
 * Send payment confirmation emails (to both admin and customer if email provided)
 * @param {Object} reservationInfo - The reservation information including payment details
 * @returns {Promise} - A promise that resolves when the emails are sent
 */
export const sendPaymentConfirmation = async (reservationInfo) => {
  console.log('Sending payment confirmation emails via backend API');
  
  const sanitizedReservationInfo = prepareReservationData(reservationInfo);
  console.log('API URL:', `${API_BASE_URL}/payment-confirmation`);

  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`Attempt ${attempt} of ${maxRetries}...`);
      
      const response = await fetch(`${API_BASE_URL}/payment-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationInfo: sanitizedReservationInfo }),
        timeout: 30000 // 30 second timeout
      });
      
      console.log('Payment API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Failed to send payment confirmation emails');
        } catch (parseError) {
          throw new Error(`Failed to send payment confirmation: ${errorText || response.statusText}`);
        }
      }
      
      const result = await response.json();
      console.log('Payment API response body:', result);
      
      if (result.success) {
        return {
          success: true,
          adminEmail: result.adminEmail,
          customerEmail: result.customerEmail
        };
      }
      
      // If we get here, the API returned success: false
      throw new Error(result.message || 'Failed to send confirmation emails');
      
    } catch (error) {
      console.error(`Error sending payment confirmation (attempt ${attempt}):`, error);
      
      if (attempt === maxRetries) {
        return {
          success: false,
          message: 'Failed to send payment confirmation emails after multiple attempts',
          error: error.message
        };
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};

/**
 * Send crypto payment confirmation emails (to both admin and customer if email provided)
 * @param {Object} reservationInfo - The reservation information including payment details
 * @returns {Promise} - A promise that resolves when the emails are sent
 */
export const sendCryptoPaymentConfirmation = async (reservationInfo) => {
  console.log('Sending crypto payment confirmation emails via backend API');
  
  const sanitizedReservationInfo = prepareReservationData(reservationInfo);
  console.log('API URL:', `${API_BASE_URL}/crypto-payment`);

  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`Attempt ${attempt} of ${maxRetries}...`);
      
      const response = await fetch(`${API_BASE_URL}/crypto-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationInfo: sanitizedReservationInfo }),
        timeout: 30000 // 30 second timeout
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Failed to send crypto payment confirmation');
        } catch (parseError) {
          throw new Error(`Failed to send crypto payment confirmation: ${errorText || response.statusText}`);
        }
      }
      
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          adminEmail: result.adminEmail,
          customerEmail: result.customerEmail
        };
      }
      
      throw new Error(result.message || 'Failed to send confirmation emails');
      
    } catch (error) {
      console.error(`Error sending crypto payment confirmation (attempt ${attempt}):`, error);
      
      if (attempt === maxRetries) {
        return {
          success: false,
          message: 'Failed to send crypto payment confirmation after multiple attempts',
          error: error.message
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};