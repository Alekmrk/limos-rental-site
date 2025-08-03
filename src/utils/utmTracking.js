/**
 * UTM Tracking Utilities
 * Preserves marketing attribution through Stripe payment redirects
 */

/**
 * Feature flag to control ALL UTM storage operations
 * Set to false to only preserve UTMs in URL (no storage at all)
 * 
 * When disabled, the system will:
 * - Still capture UTMs from URLs
 * - Still validate UTM data
 * - NOT store UTMs in sessionStorage or localStorage
 * - NOT store conversion data in localStorage  
 * - NOT restore UTMs from storage
 * - NOT preserve UTMs in URLs from storage
 * - Only rely on URL-based UTM preservation
 * 
 * To re-enable storage in the future:
 * 1. Change ENABLE_UTM_STORAGE_RESTORATION to true
 * 2. All storage functionality will work again
 * 3. No other changes needed
 */
const ENABLE_UTM_STORAGE_RESTORATION = false;

// Export the feature flag for easy access
export { ENABLE_UTM_STORAGE_RESTORATION };

const UTM_PARAMS = [
  'utm_source',     // Traffic source (google, facebook, direct)
  'utm_medium',     // Marketing medium (cpc, email, organic)
  'utm_campaign',   // Campaign name
  'utm_term',       // Paid keywords
  'utm_content'     // Ad content differentiation
];

const UTM_STORAGE_KEY = 'eliteway_utm_data';
const UTM_BACKUP_KEY = 'eliteway_utm_backup';

/**
 * Capture UTM parameters from current URL
 */
export const captureUTMParameters = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {};
    let hasUTM = false;

    UTM_PARAMS.forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        utmData[param] = value;
        hasUTM = true;
      }
    });

    if (hasUTM) {
      // Validate UTM data before storing
      const validatedData = validateUTM(utmData);
      
      // Only store if storage is enabled
      if (ENABLE_UTM_STORAGE_RESTORATION) {
        // Store in sessionStorage (survives redirects but not new tabs)
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(validatedData));
        
        // Backup in localStorage with timestamp (survives browser restarts)
        localStorage.setItem(UTM_BACKUP_KEY, JSON.stringify({
          ...validatedData,
          timestamp: new Date().toISOString(),
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }));
        
        console.log('🎯 UTM parameters captured, validated and stored:', validatedData);
      } else {
        console.log('🎯 UTM parameters captured and validated (storage disabled):', validatedData);
      }
      
      return validatedData;
    }

    return null;
  } catch (error) {
    console.error('❌ Error capturing UTM parameters:', error);
    return null;
  }
};

/**
 * Retrieve stored UTM parameters
 */
export const getStoredUTMParameters = () => {
  try {
    // Check if storage restoration is disabled
    if (!ENABLE_UTM_STORAGE_RESTORATION) {
      console.log('🚫 UTM storage restoration is disabled');
      return null;
    }

    // First try sessionStorage (most recent)
    const sessionData = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      console.log('🎯 UTM retrieved from session:', parsed);
      return parsed;
    }

    // Fallback to localStorage backup
    const backupData = localStorage.getItem(UTM_BACKUP_KEY);
    if (backupData) {
      const parsed = JSON.parse(backupData);
      
      // Check if backup hasn't expired
      if (new Date(parsed.expires) > new Date()) {
        console.log('🎯 UTM retrieved from backup:', parsed);
        
        // Restore to sessionStorage for future calls
        const { timestamp, expires, ...utmData } = parsed;
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmData));
        
        return utmData;
      } else {
        // Clean up expired backup
        localStorage.removeItem(UTM_BACKUP_KEY);
        console.log('🧹 Expired UTM backup cleaned up');
      }
    }

    return null;
  } catch (error) {
    console.error('❌ Error retrieving UTM parameters:', error);
    return null;
  }
};

/**
 * Build URL with UTM parameters appended
 */
export const appendUTMToURL = (baseUrl, utmData = null) => {
  try {
    const utms = utmData || getStoredUTMParameters();
    if (!utms) return baseUrl;

    const url = new URL(baseUrl);
    
    UTM_PARAMS.forEach(param => {
      if (utms[param]) {
        url.searchParams.set(param, utms[param]);
      }
    });

    console.log('🎯 UTM appended to URL:', url.toString());
    return url.toString();
  } catch (error) {
    console.error('❌ Error appending UTM to URL:', error);
    return baseUrl;
  }
};

/**
 * Extract UTMs from URL and store them
 */
export const extractAndStoreUTMFromURL = (url = window.location.href) => {
  try {
    const urlObj = new URL(url);
    const utmData = {};
    let hasUTM = false;

    UTM_PARAMS.forEach(param => {
      const value = urlObj.searchParams.get(param);
      if (value) {
        utmData[param] = value;
        hasUTM = true;
      }
    });

    if (hasUTM) {
      // Validate UTM data before storing
      const validatedData = validateUTM(utmData);
      
      // Only store if storage is enabled
      if (ENABLE_UTM_STORAGE_RESTORATION) {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(validatedData));
        console.log('🎯 UTM extracted, validated and stored from URL:', validatedData);
      } else {
        console.log('🎯 UTM extracted and validated from URL (storage disabled):', validatedData);
      }
      
      return validatedData;
    }

    return null;
  } catch (error) {
    console.error('❌ Error extracting UTM from URL:', error);
    return null;
  }
};

/**
 * Clear stored UTM data
 */
export const clearUTMData = () => {
  try {
    if (ENABLE_UTM_STORAGE_RESTORATION) {
      sessionStorage.removeItem(UTM_STORAGE_KEY);
      localStorage.removeItem(UTM_BACKUP_KEY);
      console.log('🧹 UTM data cleared');
    } else {
      console.log('🚫 UTM data clearing skipped (storage disabled)');
    }
  } catch (error) {
    console.error('❌ Error clearing UTM data:', error);
  }
};

/**
 * Get UTM data for analytics/tracking
 */
export const getUTMForAnalytics = () => {
  const utms = getStoredUTMParameters();
  return utms ? {
    source: utms.utm_source || 'direct',
    medium: utms.utm_medium || 'none',
    campaign: utms.utm_campaign || 'none',
    term: utms.utm_term || '',
    content: utms.utm_content || ''
  } : {
    source: 'direct',
    medium: 'none',
    campaign: 'none',
    term: '',
    content: ''
  };
};

/**
 * Debug function to show current UTM state
 */
export const debugUTMState = () => {
  const session = sessionStorage.getItem(UTM_STORAGE_KEY);
  const backup = localStorage.getItem(UTM_BACKUP_KEY);
  
  console.log('🔍 UTM Debug State:', {
    sessionStorage: session ? JSON.parse(session) : null,
    localStorage: backup ? JSON.parse(backup) : null,
    currentURL: window.location.href,
    hasUTMInURL: UTM_PARAMS.some(param => new URLSearchParams(window.location.search).has(param))
  });
  
  return {
    session: session ? JSON.parse(session) : null,
    backup: backup ? JSON.parse(backup) : null
  };
};

/**
 * Enable cross-tab UTM synchronization
 */
export const enableCrossTabSync = () => {
  try {
    // Check if storage restoration is disabled
    if (!ENABLE_UTM_STORAGE_RESTORATION) {
      console.log('🚫 Cross-tab sync disabled - storage restoration is off');
      return null;
    }

    // Always check localStorage backup first for cross-tab support
    const backup = localStorage.getItem(UTM_BACKUP_KEY);
    if (backup && !sessionStorage.getItem(UTM_STORAGE_KEY)) {
      const data = JSON.parse(backup);
      if (new Date(data.expires) > new Date()) {
        const { timestamp, expires, ...utmData } = data;
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmData));
        console.log('🔄 UTM data synced from localStorage to sessionStorage for cross-tab support');
        return utmData;
      }
    }
    return null;
  } catch (error) {
    console.error('❌ Error enabling cross-tab UTM sync:', error);
    return null;
  }
};

/**
 * Initialize UTM tracking with cross-tab support
 */
export const initUTMTracking = () => {
  // Skip storage restoration if disabled
  if (!ENABLE_UTM_STORAGE_RESTORATION) {
    console.log('🚫 UTM storage restoration is disabled, only capturing from URL');
    // Only capture new UTMs if present in URL
    captureUTMParameters();
    return;
  }

  // Check localStorage backup first for cross-tab support
  const backup = localStorage.getItem(UTM_BACKUP_KEY);
  if (backup && !sessionStorage.getItem(UTM_STORAGE_KEY)) {
    const data = JSON.parse(backup);
    if (new Date(data.expires) > new Date()) {
      const { timestamp, expires, ...utmData } = data;
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmData));
      console.log('🔄 UTM restored from backup on init');
    }
  }
  
  // Then capture new UTMs if present
  captureUTMParameters();
};

/**
 * Consent-aware UTM capture - only captures if analytics consent is given
 */
export const captureUTMWithConsent = () => {
  try {
    const consentData = localStorage.getItem('cookie-consent-data');
    if (consentData) {
      const consent = JSON.parse(consentData);
      if (consent.preferences?.analytics) {
        return captureUTMParameters();
      } else {
        console.log('🚫 UTM capture skipped - analytics consent not given');
        return null;
      }
    }
    
    // If no consent data exists, allow capture (user hasn't seen banner yet)
    return captureUTMParameters();
  } catch (error) {
    console.error('❌ Error in consent-aware UTM capture:', error);
    // Fallback to regular capture on error
    return captureUTMParameters();
  }
};

/**
 * Validate UTM parameters to prevent invalid data
 */
export const validateUTM = (utmData) => {
  const validSources = ['google', 'facebook', 'email', 'direct', 'bing', 'linkedin', 'twitter', 'instagram', 'youtube', 'referral'];
  const validMediums = ['cpc', 'organic', 'email', 'social', 'referral', 'display', 'video', 'affiliate', 'sms'];
  
  return {
    ...utmData,
    utm_source: validSources.includes(utmData.utm_source?.toLowerCase()) ? utmData.utm_source.toLowerCase() : (utmData.utm_source || 'direct'),
    utm_medium: validMediums.includes(utmData.utm_medium?.toLowerCase()) ? utmData.utm_medium.toLowerCase() : (utmData.utm_medium || 'none'),
    utm_campaign: utmData.utm_campaign || 'none',
    utm_term: utmData.utm_term || '',
    utm_content: utmData.utm_content || ''
  };
};

/**
 * Get UTM debug information
 */
export const getUTMDebugInfo = () => {
  return {
    sessionStorage: !!sessionStorage.getItem(UTM_STORAGE_KEY),
    localStorage: !!localStorage.getItem(UTM_BACKUP_KEY),
    currentUTMs: getStoredUTMParameters(),
    timestamp: new Date().toISOString(),
    urlHasUTMs: UTM_PARAMS.some(param => new URLSearchParams(window.location.search).has(param))
  };
};

/**
 * Track conversion with UTM attribution
 */
export const trackConversion = (utmData, conversionType = 'purchase') => {
  try {
    const attribution = {
      ...utmData,
      conversionType,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Only store conversion data if storage is enabled
    if (ENABLE_UTM_STORAGE_RESTORATION) {
      const existingConversions = JSON.parse(localStorage.getItem('eliteway_conversions') || '[]');
      existingConversions.push(attribution);
      
      // Keep only last 10 conversions
      if (existingConversions.length > 10) {
        existingConversions.splice(0, existingConversions.length - 10);
      }
      
      localStorage.setItem('eliteway_conversions', JSON.stringify(existingConversions));
      console.log('🎯 Conversion tracked with UTM attribution and stored:', attribution);
    } else {
      console.log('🎯 Conversion tracked with UTM attribution (storage disabled):', attribution);
    }
    
    // Trigger analytics events if available (this should still work regardless of storage)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION_ID', // Replace with actual conversion ID
        'value': 1.0,
        'currency': 'CHF',
        'transaction_id': Date.now().toString(),
        'custom_parameters': {
          'utm_source': utmData.utm_source || 'direct',
          'utm_medium': utmData.utm_medium || 'none',
          'utm_campaign': utmData.utm_campaign || 'none'
        }
      });
    }
    
    return attribution;
  } catch (error) {
    console.error('❌ Error tracking conversion:', error);
    return null;
  }
};

/**
 * Preserve UTMs in the current URL
 */
export const preserveUTMsInURL = () => {
  try {
    // Skip if storage is disabled
    if (!ENABLE_UTM_STORAGE_RESTORATION) {
      console.log('🚫 UTM URL preservation skipped (storage disabled)');
      return;
    }

    // Get stored UTMs
    const storedUTMs = getStoredUTMParameters();
    if (!storedUTMs || Object.keys(storedUTMs).length === 0) return;
    
    // Get current URL
    const currentURL = new URL(window.location.href);
    
    // Check if UTMs already in URL (prevent infinite loops)
    const hasUTMs = UTM_PARAMS.some(param => currentURL.searchParams.has(param));
    if (hasUTMs) {
      console.log('🔗 UTMs already in URL, skipping preservation');
      return;
    }
    
    // Don't add UTMs to certain pages where they don't make sense
    const excludePaths = ['/privacy-policy', '/terms-of-service', '/legal-notice'];
    if (excludePaths.includes(currentURL.pathname)) {
      console.log('🔗 Skipping UTM preservation on legal page');
      return;
    }
    
    // Add UTMs to URL
    let added = false;
    Object.entries(storedUTMs).forEach(([key, value]) => {
      if (value && UTM_PARAMS.includes(key)) {
        currentURL.searchParams.set(key, value);
        added = true;
      }
    });
    
    if (added) {
      // Update URL without reload
      window.history.replaceState({}, '', currentURL.toString());
      console.log('🔗 UTMs preserved in URL:', currentURL.toString());
    }
  } catch (error) {
    console.error('❌ Error preserving UTMs in URL:', error);
  }
};

/**
 * Initialize UTM tracking with URL preservation
 */
export const initUTMTrackingWithURLPreservation = () => {
  // First do normal init
  initUTMTracking();
  
  // Then preserve UTMs in URL
  preserveUTMsInURL();
};

/**
 * Preserve UTMs on navigation (for React Router)
 */
export const preserveUTMsOnNavigation = () => {
  // Skip if storage is disabled
  if (!ENABLE_UTM_STORAGE_RESTORATION) {
    console.log('🚫 UTM navigation preservation skipped (storage disabled)');
    return;
  }

  // Small delay to ensure the route has changed and DOM is updated
  setTimeout(() => {
    // Only preserve if we have stored UTMs and current URL doesn't have them
    const storedUTMs = getStoredUTMParameters();
    if (storedUTMs && Object.keys(storedUTMs).length > 0) {
      const hasUTMsInURL = UTM_PARAMS.some(param => 
        new URLSearchParams(window.location.search).has(param)
      );
      
      if (!hasUTMsInURL) {
        preserveUTMsInURL();
      }
    }
  }, 100);
};
