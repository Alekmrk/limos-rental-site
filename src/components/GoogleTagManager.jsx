/**
 * Google Tag Manager Integration
 * Handles GTM initialization with cookie consent integration
 */

import { useEffect } from 'react';
import useUTMTracking from '../hooks/useUTMTracking';

// GTM Configuration
const GTM_CONFIG = {
  // Your actual GTM container ID
  containerId: 'GTM-M54BVJHK', // ✅ Real GTM ID
  debug: import.meta.env.DEV,
  dataLayerName: 'dataLayer'
};

/**
 * Initialize Google Tag Manager
 */
export const initializeGTM = (containerId = GTM_CONFIG.containerId) => {
  if (typeof window === 'undefined') return;

  // Create dataLayer if it doesn't exist
  window[GTM_CONFIG.dataLayerName] = window[GTM_CONFIG.dataLayerName] || [];
  
  // GTM initialization function
  window.gtag = window.gtag || function() {
    window[GTM_CONFIG.dataLayerName].push(arguments);
  };
  
  // Set initial timestamp
  window.gtag('js', new Date());

  // Initialize consent mode (GDPR compliant)
  window.gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'functionality_storage': 'granted',
    'personalization_storage': 'denied',
    'security_storage': 'granted',
    'wait_for_update': 2000
  });

  // Load GTM script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
  document.head.appendChild(script);

  // Add GTM noscript iframe
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${containerId}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  noscript.appendChild(iframe);
  document.body.insertBefore(noscript, document.body.firstChild);

  console.log(`🏷️ GTM initialized with container: ${containerId}`);
};

/**
 * Update consent settings
 */
export const updateGTMConsent = (consentSettings) => {
  if (typeof window.gtag === 'undefined') return;

  const consentMap = {
    analytics: 'analytics_storage',
    marketing: 'ad_storage',
    functional: 'functionality_storage',
    personalization: 'personalization_storage'
  };

  const gtagConsent = {};
  Object.entries(consentSettings).forEach(([category, granted]) => {
    const gtagKey = consentMap[category];
    if (gtagKey) {
      gtagConsent[gtagKey] = granted ? 'granted' : 'denied';
    }
  });

  window.gtag('consent', 'update', gtagConsent);
  
  console.log('🍪 GTM consent updated:', gtagConsent);
};

/**
 * Send custom event to GTM
 */
export const sendGTMEvent = (eventName, eventData = {}) => {
  if (typeof window.gtag === 'undefined') {
    console.warn('GTM not initialized, event not sent:', eventName);
    return;
  }

  window.gtag('event', eventName, {
    event_category: eventData.category || 'general',
    event_label: eventData.label || '',
    value: eventData.value || 0,
    custom_parameter_1: eventData.custom1 || '',
    custom_parameter_2: eventData.custom2 || '',
    ...eventData
  });

  if (GTM_CONFIG.debug) {
    console.log('📊 GTM Event sent:', eventName, eventData);
  }
};

/**
 * Send UTM data to GTM
 */
export const sendUTMToGTM = (utmData) => {
  if (!utmData || !utmData.hasUTMs) return;

  sendGTMEvent('utm_data_captured', {
    category: 'limo_acquisition',
    label: 'utm_tracking',
    utm_source: utmData.source,
    utm_medium: utmData.medium,
    utm_campaign: utmData.campaign,
    utm_term: utmData.term,
    utm_content: utmData.content,
    utm_timestamp: utmData.timestamp
  });
};

/**
 * Send booking milestone events
 */
export const sendBookingEvent = (milestone, data = {}) => {
  const eventMap = {
    'page_view': {
      event_name: 'page_view',
      category: 'engagement'
    },
    'quote_started': {
      event_name: 'start_booking',
      category: 'limo_booking'
    },
    'vehicle_selected': {
      event_name: 'select_vehicle',
      category: 'limo_booking'
    },
    'details_entered': {
      event_name: 'enter_customer_details',
      category: 'limo_booking'
    },
    'payment_initiated': {
      event_name: 'initiate_payment',
      category: 'limo_booking'
    },
    'payment_completed': {
      event_name: 'booking_completed',
      category: 'limo_conversion'
    },
    'payment_failed': {
      event_name: 'payment_failed',
      category: 'limo_booking'
    }
  };

  const eventConfig = eventMap[milestone];
  if (!eventConfig) {
    console.warn('Unknown booking milestone:', milestone);
    return;
  }

  sendGTMEvent(eventConfig.event_name, {
    category: eventConfig.category,
    label: milestone,
    ...data
  });
};

/**
 * Send conversion event
 */
export const sendConversionEvent = (reservationData, utmData = null) => {
  const conversionData = {
    category: 'ecommerce',
    transaction_id: reservationData.paymentDetails?.reference || 'unknown',
    value: reservationData.paymentDetails?.amount || 0,
    currency: reservationData.paymentDetails?.currency || 'CHF',
    item_category: reservationData.isHourly ? 'hourly_rental' : 'point_to_point',
    item_name: reservationData.selectedVehicle?.name || 'vehicle_rental',
    quantity: 1
  };

  // Add UTM data if available
  if (utmData && utmData.hasUTMs) {
    conversionData.utm_source = utmData.source;
    conversionData.utm_medium = utmData.medium;
    conversionData.utm_campaign = utmData.campaign;
    conversionData.utm_term = utmData.term;
    conversionData.utm_content = utmData.content;
  }

  sendGTMEvent('booking_completed', conversionData);
  
  // Also send a custom conversion event for better tracking
  sendGTMEvent('limo_booking_completed', {
    category: 'limo_conversion',
    label: 'successful_booking',
    value: conversionData.value,
    booking_type: reservationData.isHourly ? 'hourly' : 'transfer',
    vehicle_type: reservationData.selectedVehicle?.name || 'unknown',
    pickup_location: reservationData.pickup || 'unknown',
    dropoff_location: reservationData.dropoff || 'unknown'
  });
};

/**
 * GTM React Component
 */
const GoogleTagManager = ({ 
  containerId = GTM_CONFIG.containerId,
  initializeOnMount = true 
}) => {
  const { utmData, hasUTMs } = useUTMTracking({ autoCapture: false });

  useEffect(() => {
    if (initializeOnMount && containerId && containerId !== 'GTM-XXXXXX') {
      initializeGTM(containerId);
    }
  }, [containerId, initializeOnMount]);

  // Send UTM data to GTM when available
  useEffect(() => {
    if (hasUTMs && utmData) {
      // Small delay to ensure GTM is loaded
      setTimeout(() => {
        sendUTMToGTM(utmData);
      }, 1000);
    }
  }, [hasUTMs, utmData]);

  // Listen for consent changes
  useEffect(() => {
    const handleConsentUpdate = (event) => {
      if (event.detail) {
        updateGTMConsent(event.detail);
      }
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);
    return () => window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
  }, []);

  return null; // This component doesn't render anything
};

export default GoogleTagManager;
