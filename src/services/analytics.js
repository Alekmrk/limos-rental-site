/**
 * Google Analytics 4 Integration
 * Handles GA4 tracking with UTM data and booking events
 */

import { sendGTMEvent, sendBookingEvent, sendConversionEvent } from './GoogleTagManager';

// GA4 Configuration
const GA4_CONFIG = {
  // Your actual GA4 Measurement ID
  measurementId: 'G-8W9JK6BFHC', // ✅ Real GA4 ID
  debug: import.meta.env.DEV,
  customDimensions: {
    utm_source: 'custom_dimension_1',
    utm_medium: 'custom_dimension_2', 
    utm_campaign: 'custom_dimension_3',
    booking_type: 'custom_dimension_4',
    vehicle_type: 'custom_dimension_5'
  }
};

/**
 * Initialize Google Analytics 4
 */
export const initializeGA4 = (measurementId = GA4_CONFIG.measurementId) => {
  if (typeof window === 'undefined' || !measurementId || measurementId === 'G-XXXXXXXXXX') {
    console.warn('⚠️ GA4 measurement ID not configured');
    return;
  }

  // Initialize GA4 through GTM
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', measurementId, {
      // Enhanced ecommerce
      send_page_view: false, // We'll send manually with UTM data
      
      // Privacy settings
      anonymize_ip: true,
      allow_google_signals: false, // Will be enabled via consent
      
      // Debug mode
      debug_mode: GA4_CONFIG.debug,
      
      // Cookie settings
      cookie_flags: 'SameSite=None;Secure',
      cookie_expires: 63072000, // 2 years
      
      // Custom parameters
      custom_map: GA4_CONFIG.customDimensions
    });

    console.log(`📊 GA4 initialized with ID: ${measurementId}`);
  } else {
    console.warn('⚠️ GTM not available, cannot initialize GA4');
  }
};

/**
 * Send page view with UTM data
 */
export const sendGA4PageView = (pagePath, pageTitle, utmData = null) => {
  if (typeof window.gtag === 'undefined') return;

  const pageViewData = {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href
  };

  // Add UTM data as custom dimensions
  if (utmData && utmData.hasUTMs) {
    pageViewData[GA4_CONFIG.customDimensions.utm_source] = utmData.source;
    pageViewData[GA4_CONFIG.customDimensions.utm_medium] = utmData.medium;
    pageViewData[GA4_CONFIG.customDimensions.utm_campaign] = utmData.campaign;
  }

  window.gtag('event', 'page_view', pageViewData);

  if (GA4_CONFIG.debug) {
    console.log('📄 GA4 Page view sent:', pageViewData);
  }
};

/**
 * Track booking funnel steps
 */
export const trackBookingStep = (step, data = {}) => {
  const stepEvents = {
    'landing': {
      event: 'page_view',
      parameters: {
        page_title: 'Landing Page',
        content_group1: 'acquisition'
      }
    },
    'quote_request': {
      event: 'begin_checkout',
      parameters: {
        currency: 'CHF',
        content_group1: 'booking_funnel'
      }
    },
    'vehicle_selection': {
      event: 'select_item',
      parameters: {
        item_list_name: 'vehicle_fleet',
        content_group1: 'booking_funnel'
      }
    },
    'customer_details': {
      event: 'add_shipping_info',
      parameters: {
        content_group1: 'booking_funnel'
      }
    },
    'payment_page': {
      event: 'add_payment_info',
      parameters: {
        payment_type: 'stripe',
        content_group1: 'booking_funnel'
      }
    },
    'booking_completed': {
      event: 'purchase',
      parameters: {
        content_group1: 'conversion'
      }
    }
  };

  const eventConfig = stepEvents[step];
  if (!eventConfig) {
    console.warn('Unknown booking step:', step);
    return;
  }

  // Merge with provided data
  const eventData = {
    ...eventConfig.parameters,
    ...data
  };

  window.gtag('event', eventConfig.event, eventData);
  
  // Also send to GTM for additional processing
  sendBookingEvent(step, eventData);

  if (GA4_CONFIG.debug) {
    console.log(`🛒 GA4 Booking step tracked: ${step}`, eventData);
  }
};

/**
 * Track quote generation
 */
export const trackQuoteGenerated = (quoteData, utmData = null) => {
  const eventData = {
    event_category: 'engagement',
    currency: 'CHF',
    value: quoteData.amount || 0,
    
    // Booking details
    pickup_location: quoteData.pickup || 'unknown',
    dropoff_location: quoteData.dropoff || 'unknown',
    service_type: quoteData.isHourly ? 'hourly' : 'transfer',
    vehicle_category: quoteData.selectedVehicle?.category || 'unknown',
    
    // Custom dimensions
    [GA4_CONFIG.customDimensions.booking_type]: quoteData.isHourly ? 'hourly' : 'transfer',
    [GA4_CONFIG.customDimensions.vehicle_type]: quoteData.selectedVehicle?.name || 'unknown'
  };

  // Add UTM data
  if (utmData && utmData.hasUTMs) {
    eventData[GA4_CONFIG.customDimensions.utm_source] = utmData.source;
    eventData[GA4_CONFIG.customDimensions.utm_medium] = utmData.medium;
    eventData[GA4_CONFIG.customDimensions.utm_campaign] = utmData.campaign;
  }

  window.gtag('event', 'generate_lead', eventData);

  if (GA4_CONFIG.debug) {
    console.log('💡 GA4 Quote generated:', eventData);
  }
};

/**
 * Track vehicle selection
 */
export const trackVehicleSelected = (vehicleData, utmData = null) => {
  const eventData = {
    event_category: 'ecommerce',
    currency: 'CHF',
    value: vehicleData.basePrice || 0,
    
    // Item details for GA4 ecommerce
    item_id: vehicleData.id,
    item_name: vehicleData.name,
    item_category: vehicleData.category || 'luxury_vehicle',
    item_variant: vehicleData.type || 'standard',
    quantity: 1,
    
    // Custom dimensions
    [GA4_CONFIG.customDimensions.vehicle_type]: vehicleData.name
  };

  // Add UTM data
  if (utmData && utmData.hasUTMs) {
    eventData[GA4_CONFIG.customDimensions.utm_source] = utmData.source;
    eventData[GA4_CONFIG.customDimensions.utm_medium] = utmData.medium;
    eventData[GA4_CONFIG.customDimensions.utm_campaign] = utmData.campaign;
  }

  window.gtag('event', 'select_item', eventData);

  if (GA4_CONFIG.debug) {
    console.log('🚗 GA4 Vehicle selected:', eventData);
  }
};

/**
 * Track conversion (booking completion)
 */
export const trackConversion = (reservationData, utmData = null) => {
  const transactionData = {
    transaction_id: reservationData.paymentDetails?.reference || `booking_${Date.now()}`,
    value: reservationData.paymentDetails?.amount || 0,
    currency: reservationData.paymentDetails?.currency || 'CHF',
    
    // Transaction details
    shipping: 0,
    tax: 0,
    
    // Items array for enhanced ecommerce
    items: [{
      item_id: reservationData.selectedVehicle?.id || 'vehicle',
      item_name: reservationData.selectedVehicle?.name || 'Limo Rental',
      item_category: reservationData.isHourly ? 'hourly_rental' : 'point_to_point',
      quantity: 1,
      price: reservationData.paymentDetails?.amount || 0
    }],
    
    // Custom dimensions
    [GA4_CONFIG.customDimensions.booking_type]: reservationData.isHourly ? 'hourly' : 'transfer',
    [GA4_CONFIG.customDimensions.vehicle_type]: reservationData.selectedVehicle?.name || 'unknown'
  };

  // Add UTM data for attribution
  if (utmData && utmData.hasUTMs) {
    transactionData[GA4_CONFIG.customDimensions.utm_source] = utmData.source;
    transactionData[GA4_CONFIG.customDimensions.utm_medium] = utmData.medium;
    transactionData[GA4_CONFIG.customDimensions.utm_campaign] = utmData.campaign;
  }

  // Send purchase event
  window.gtag('event', 'purchase', transactionData);
  
  // Send custom conversion event
  window.gtag('event', 'limo_booking_conversion', {
    event_category: 'conversion',
    event_label: 'booking_completed',
    value: transactionData.value,
    currency: transactionData.currency
  });

  // Also send to GTM
  sendConversionEvent(reservationData, utmData);

  if (GA4_CONFIG.debug) {
    console.log('🎉 GA4 Conversion tracked:', transactionData);
  }
};

/**
 * Track payment failures
 */
export const trackPaymentFailure = (errorData, utmData = null) => {
  const eventData = {
    event_category: 'ecommerce',
    event_label: 'payment_failed',
    error_message: errorData.message || 'unknown_error',
    payment_method: 'stripe',
    
    // Context data
    booking_value: errorData.amount || 0,
    currency: 'CHF'
  };

  // Add UTM data
  if (utmData && utmData.hasUTMs) {
    eventData[GA4_CONFIG.customDimensions.utm_source] = utmData.source;
    eventData[GA4_CONFIG.customDimensions.utm_medium] = utmData.medium;
    eventData[GA4_CONFIG.customDimensions.utm_campaign] = utmData.campaign;
  }

  window.gtag('event', 'exception', eventData);

  if (GA4_CONFIG.debug) {
    console.log('💥 GA4 Payment failure tracked:', eventData);
  }
};

/**
 * Track custom events
 */
export const trackCustomEvent = (eventName, eventData = {}, utmData = null) => {
  const fullEventData = { ...eventData };

  // Add UTM data if available
  if (utmData && utmData.hasUTMs) {
    fullEventData[GA4_CONFIG.customDimensions.utm_source] = utmData.source;
    fullEventData[GA4_CONFIG.customDimensions.utm_medium] = utmData.medium;
    fullEventData[GA4_CONFIG.customDimensions.utm_campaign] = utmData.campaign;
  }

  window.gtag('event', eventName, fullEventData);

  if (GA4_CONFIG.debug) {
    console.log(`📊 GA4 Custom event: ${eventName}`, fullEventData);
  }
};

export {
  GA4_CONFIG,
  initializeGA4,
  sendGA4PageView,
  trackBookingStep,
  trackQuoteGenerated,
  trackVehicleSelected,
  trackConversion,
  trackPaymentFailure,
  trackCustomEvent
};
