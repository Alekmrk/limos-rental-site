/**
 * UTM Tracking Utility
 * Handles UTM parameter capture, storage, and restoration across Stripe payment redirects
 * Integrates with existing ReservationContext and cookie consent system
 */

// UTM parameters to track
const UTM_PARAMS = [
  'utm_source',     // Traffic source (google, facebook, direct)
  'utm_medium',     // Marketing medium (cpc, email, organic)
  'utm_campaign',   // Campaign name
  'utm_term',       // Paid keywords
  'utm_content'     // Ad content differentiation
];

// Storage keys
const STORAGE_KEYS = {
  SESSION: 'utm_data',
  LOCAL: 'utm_backup',
  TEMP_MARKER: 'utm_temp_marker'
};

// UTM data expiry time (24 hours)
const UTM_EXPIRY_TIME = 24 * 60 * 60 * 1000;

/**
 * Extract UTM parameters from URL
 * @param {string} url - URL to extract UTMs from (optional, defaults to current URL)
 * @returns {object} UTM data object
 */
export const extractUTMFromURL = (url = window.location.href) => {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    const utmData = {
      source: params.get('utm_source') || '',
      medium: params.get('utm_medium') || '',
      campaign: params.get('utm_campaign') || '',
      term: params.get('utm_term') || '',
      content: params.get('utm_content') || '',
      timestamp: Date.now(),
      hasUTMs: false
    };

    // Check if any UTM parameters exist
    utmData.hasUTMs = UTM_PARAMS.some(param => params.has(param));

    console.log('🎯 [UTM] Extracted UTM parameters:', {
      url: url,
      hasUTMs: utmData.hasUTMs,
      data: utmData.hasUTMs ? utmData : 'No UTMs found'
    });

    return utmData;
  } catch (error) {
    console.error('❌ [UTM] Error extracting UTMs from URL:', error);
    return {
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: '',
      timestamp: Date.now(),
      hasUTMs: false
    };
  }
};

/**
 * Check if UTM data is still valid (not expired)
 * @param {object} utmData - UTM data object
 * @returns {boolean} Whether UTM data is valid
 */
const isUTMDataValid = (utmData) => {
  if (!utmData || !utmData.timestamp) return false;
  return (Date.now() - utmData.timestamp) < UTM_EXPIRY_TIME;
};

/**
 * Store UTM data in multiple storage layers for maximum reliability
 * @param {object} utmData - UTM data to store
 */
export const storeUTMData = (utmData) => {
  if (!utmData.hasUTMs) {
    console.log('🎯 [UTM] No UTMs to store');
    return;
  }

  try {
    console.log('💾 [UTM] Storing UTM data in multiple layers:', utmData);

    // 1. Primary storage (survives redirects)
    sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(utmData));

    // 2. Backup storage (survives browser restart)
    const backupData = {
      data: utmData,
      timestamp: Date.now(),
      expires: Date.now() + UTM_EXPIRY_TIME
    };
    localStorage.setItem(STORAGE_KEYS.LOCAL, JSON.stringify(backupData));

    // 3. Temporary marker for payment flow returns
    const tempMarker = {
      timestamp: Date.now(),
      utmData: utmData
    };
    localStorage.setItem(STORAGE_KEYS.TEMP_MARKER, JSON.stringify(tempMarker));

    console.log('✅ [UTM] UTM data stored successfully');
  } catch (error) {
    console.error('❌ [UTM] Error storing UTM data:', error);
  }
};

/**
 * Retrieve UTM data from storage layers
 * @returns {object|null} UTM data or null if not found/expired
 */
export const retrieveUTMData = () => {
  try {
    // Try session storage first (most recent)
    const sessionData = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      if (isUTMDataValid(parsed)) {
        console.log('✅ [UTM] Retrieved UTM data from session storage:', parsed);
        return parsed;
      }
    }

    // Try backup storage
    const localData = localStorage.getItem(STORAGE_KEYS.LOCAL);
    if (localData) {
      const parsed = JSON.parse(localData);
      if (parsed.expires > Date.now() && isUTMDataValid(parsed.data)) {
        console.log('✅ [UTM] Retrieved UTM data from local storage backup:', parsed.data);
        // Restore to session storage
        sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(parsed.data));
        return parsed.data;
      }
    }

    // Try temporary marker (for payment returns)
    const tempData = localStorage.getItem(STORAGE_KEYS.TEMP_MARKER);
    if (tempData) {
      const parsed = JSON.parse(tempData);
      const markerAge = Date.now() - parsed.timestamp;
      
      // Temp marker valid for 30 minutes
      if (markerAge < (30 * 60 * 1000) && isUTMDataValid(parsed.utmData)) {
        console.log('✅ [UTM] Retrieved UTM data from temp marker:', parsed.utmData);
        // Restore to session storage
        sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(parsed.utmData));
        return parsed.utmData;
      }
    }

    console.log('ℹ️ [UTM] No valid UTM data found in storage');
    return null;
  } catch (error) {
    console.error('❌ [UTM] Error retrieving UTM data:', error);
    return null;
  }
};

/**
 * Clear UTM data from all storage layers
 */
export const clearUTMData = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.LOCAL);
    localStorage.removeItem(STORAGE_KEYS.TEMP_MARKER);
    console.log('🗑️ [UTM] Cleared all UTM data');
  } catch (error) {
    console.error('❌ [UTM] Error clearing UTM data:', error);
  }
};

/**
 * Build URL query string from UTM data for Stripe redirects
 * @param {object} utmData - UTM data object
 * @returns {string} URL query string
 */
export const buildUTMQueryString = (utmData) => {
  if (!utmData || !utmData.hasUTMs) return '';

  const params = new URLSearchParams();
  
  UTM_PARAMS.forEach(param => {
    const key = param.replace('utm_', '');
    const value = utmData[key];
    if (value && value.trim()) {
      params.append(param, value.trim());
    }
  });

  const queryString = params.toString();
  console.log('🔗 [UTM] Built query string:', queryString);
  return queryString ? `&${queryString}` : '';
};

/**
 * Initialize UTM tracking on app entry
 * Captures UTMs from current URL and stores them
 */
export const initializeUTMTracking = () => {
  try {
    console.log('🚀 [UTM] Initializing UTM tracking...');

    // Extract UTMs from current URL
    const currentUTMs = extractUTMFromURL();

    if (currentUTMs.hasUTMs) {
      // Store new UTMs
      storeUTMData(currentUTMs);
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('utmCaptured', {
        detail: currentUTMs
      }));

      console.log('🎯 [UTM] New UTMs captured and stored');
      return currentUTMs;
    } else {
      // Try to retrieve existing UTMs
      const existingUTMs = retrieveUTMData();
      if (existingUTMs) {
        console.log('📥 [UTM] Using existing stored UTMs');
        return existingUTMs;
      }
    }

    console.log('ℹ️ [UTM] No UTMs found - direct traffic or organic');
    return null;
  } catch (error) {
    console.error('❌ [UTM] Error initializing UTM tracking:', error);
    return null;
  }
};

/**
 * Restore UTM data after payment redirect
 * Combines URL UTMs with stored UTMs for maximum reliability
 */
export const restoreUTMData = () => {
  try {
    console.log('🔄 [UTM] Restoring UTM data after redirect...');

    // First, check if UTMs are in current URL (from Stripe redirect)
    const urlUTMs = extractUTMFromURL();
    
    if (urlUTMs.hasUTMs) {
      // UTMs found in URL - use them and update storage
      storeUTMData(urlUTMs);
      console.log('✅ [UTM] UTMs restored from URL');
      return urlUTMs;
    }

    // No UTMs in URL - try to retrieve from storage
    const storedUTMs = retrieveUTMData();
    if (storedUTMs) {
      console.log('✅ [UTM] UTMs restored from storage');
      return storedUTMs;
    }

    console.log('⚠️ [UTM] No UTMs to restore');
    return null;
  } catch (error) {
    console.error('❌ [UTM] Error restoring UTM data:', error);
    return null;
  }
};

/**
 * Get formatted UTM data for analytics
 * @param {object} utmData - UTM data object
 * @returns {object} Formatted UTM data for analytics
 */
export const getAnalyticsUTMData = (utmData) => {
  if (!utmData || !utmData.hasUTMs) {
    return {
      utm_source: '(direct)',
      utm_medium: '(none)',
      utm_campaign: '(not set)',
      utm_term: '(not provided)',
      utm_content: '(not set)'
    };
  }

  return {
    utm_source: utmData.source || '(not set)',
    utm_medium: utmData.medium || '(not set)',
    utm_campaign: utmData.campaign || '(not set)',
    utm_term: utmData.term || '(not provided)',
    utm_content: utmData.content || '(not set)'
  };
};

/**
 * Debug function to log current UTM state
 */
export const debugUTMState = () => {
  console.group('🔍 [UTM] Debug State');
  
  try {
    const currentURL = window.location.href;
    const urlUTMs = extractUTMFromURL(currentURL);
    const storedUTMs = retrieveUTMData();
    
    console.log('Current URL:', currentURL);
    console.log('URL UTMs:', urlUTMs);
    console.log('Stored UTMs:', storedUTMs);
    
    // Check storage contents
    const sessionData = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    const localData = localStorage.getItem(STORAGE_KEYS.LOCAL);
    const tempData = localStorage.getItem(STORAGE_KEYS.TEMP_MARKER);
    
    console.log('Session Storage:', sessionData ? JSON.parse(sessionData) : 'Empty');
    console.log('Local Storage:', localData ? JSON.parse(localData) : 'Empty');
    console.log('Temp Marker:', tempData ? JSON.parse(tempData) : 'Empty');
    
  } catch (error) {
    console.error('Error in debug:', error);
  }
  
  console.groupEnd();
};

// Global UTM tracking object for easy access
window.UTMTracking = {
  init: initializeUTMTracking,
  extract: extractUTMFromURL,
  store: storeUTMData,
  retrieve: retrieveUTMData,
  restore: restoreUTMData,
  clear: clearUTMData,
  buildQuery: buildUTMQueryString,
  getAnalytics: getAnalyticsUTMData,
  debug: debugUTMState
};

console.log('🎯 [UTM] UTM Tracking utility loaded');

export default {
  initializeUTMTracking,
  extractUTMFromURL,
  storeUTMData,
  retrieveUTMData,
  restoreUTMData,
  clearUTMData,
  buildUTMQueryString,
  getAnalyticsUTMData,
  debugUTMState
};
