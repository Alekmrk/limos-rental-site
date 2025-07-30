/**
 * React Hook for UTM Tracking
 * Provides easy-to-use React interface for UTM management
 * Integrates with existing ReservationContext
 */

import { useState, useEffect, useContext, useCallback } from 'react';
import ReservationContext from '../contexts/ReservationContext';
import {
  initializeUTMTracking,
  extractUTMFromURL,
  storeUTMData,
  retrieveUTMData,
  restoreUTMData,
  getAnalyticsUTMData,
  debugUTMState
} from '../utils/utmTracking';

/**
 * Custom hook for UTM tracking management
 * @param {object} options - Configuration options
 * @returns {object} UTM tracking state and methods
 */
export const useUTMTracking = (options = {}) => {
  const {
    autoCapture = true,
    debug = false,
    storeInContext = true
  } = options;

  const [utmData, setUtmData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUTMs, setHasUTMs] = useState(false);

  // Access reservation context if available
  const reservationContext = useContext(ReservationContext);
  const { handleInput } = reservationContext || {};

  /**
   * Update UTM data in state and optionally in context
   */
  const updateUTMData = useCallback((newUtmData) => {
    setUtmData(newUtmData);
    setHasUTMs(newUtmData?.hasUTMs || false);

    // Store in ReservationContext if available and enabled
    if (storeInContext && handleInput && newUtmData?.hasUTMs) {
      handleInput({
        target: {
          name: 'utmData',
          value: newUtmData
        }
      });

      if (debug) {
        console.log('🎯 [UTM Hook] Stored UTM data in ReservationContext:', newUtmData);
      }
    }

    // Dispatch custom event for other components
    if (newUtmData?.hasUTMs) {
      window.dispatchEvent(new CustomEvent('utmDataUpdated', {
        detail: newUtmData
      }));
    }
  }, [handleInput, storeInContext, debug]);

  /**
   * Initialize UTM tracking
   */
  const initializeTracking = useCallback(() => {
    if (debug) {
      console.log('🚀 [UTM Hook] Initializing UTM tracking...');
    }

    setIsLoading(true);

    try {
      // Try to get UTMs from current URL or storage
      const utms = initializeUTMTracking();
      updateUTMData(utms);

      if (debug && utms) {
        console.log('✅ [UTM Hook] UTM tracking initialized:', utms);
      }
    } catch (error) {
      console.error('❌ [UTM Hook] Error initializing UTM tracking:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateUTMData, debug]);

  /**
   * Manually capture UTMs from URL
   */
  const captureUTMs = useCallback((url) => {
    try {
      const utms = extractUTMFromURL(url);
      if (utms.hasUTMs) {
        storeUTMData(utms);
        updateUTMData(utms);
        
        if (debug) {
          console.log('🎯 [UTM Hook] Manually captured UTMs:', utms);
        }
        
        return utms;
      }
      return null;
    } catch (error) {
      console.error('❌ [UTM Hook] Error capturing UTMs:', error);
      return null;
    }
  }, [updateUTMData, debug]);

  /**
   * Restore UTMs after redirect (e.g., from Stripe)
   */
  const restoreUTMs = useCallback(() => {
    try {
      if (debug) {
        console.log('🔄 [UTM Hook] Restoring UTMs after redirect...');
      }

      const utms = restoreUTMData();
      updateUTMData(utms);

      if (debug && utms) {
        console.log('✅ [UTM Hook] UTMs restored:', utms);
      }

      return utms;
    } catch (error) {
      console.error('❌ [UTM Hook] Error restoring UTMs:', error);
      return null;
    }
  }, [updateUTMData, debug]);

  /**
   * Get formatted UTM data for analytics
   */
  const getFormattedUTMData = useCallback(() => {
    return getAnalyticsUTMData(utmData);
  }, [utmData]);

  /**
   * Check if we're on a payment return page
   */
  const isPaymentReturn = useCallback(() => {
    const path = window.location.pathname;
    const hasSessionId = new URLSearchParams(window.location.search).has('session_id');
    
    return (path.includes('/payment-success') || path.includes('/payment-cancel')) && hasSessionId;
  }, []);

  /**
   * Clear UTM data
   */
  const clearUTMs = useCallback(() => {
    try {
      // Clear from storage
      const { clearUTMData } = require('../utils/utmTracking');
      clearUTMData();

      // Clear from state
      setUtmData(null);
      setHasUTMs(false);

      // Clear from context if available
      if (storeInContext && handleInput) {
        handleInput({
          target: {
            name: 'utmData',
            value: null
          }
        });
      }

      if (debug) {
        console.log('🗑️ [UTM Hook] UTM data cleared');
      }
    } catch (error) {
      console.error('❌ [UTM Hook] Error clearing UTMs:', error);
    }
  }, [handleInput, storeInContext, debug]);

  // Initialize on mount
  useEffect(() => {
    if (autoCapture) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        // Check if this is a payment return page
        if (isPaymentReturn()) {
          // For payment returns, restore UTMs instead of initializing
          restoreUTMs();
        } else {
          // For normal pages, initialize tracking
          initializeTracking();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [autoCapture, initializeTracking, restoreUTMs, isPaymentReturn]);

  // Listen for UTM events from other components
  useEffect(() => {
    const handleUTMCaptured = (event) => {
      if (debug) {
        console.log('📨 [UTM Hook] Received UTM captured event:', event.detail);
      }
      updateUTMData(event.detail);
    };

    window.addEventListener('utmCaptured', handleUTMCaptured);
    return () => window.removeEventListener('utmCaptured', handleUTMCaptured);
  }, [updateUTMData, debug]);

  // Debug logging
  useEffect(() => {
    if (debug && utmData) {
      console.group('🔍 [UTM Hook] State Update');
      console.log('UTM Data:', utmData);
      console.log('Has UTMs:', hasUTMs);
      console.log('Formatted for Analytics:', getFormattedUTMData());
      console.groupEnd();
    }
  }, [utmData, hasUTMs, debug, getFormattedUTMData]);

  return {
    // State
    utmData,
    hasUTMs,
    isLoading,

    // Methods
    initializeTracking,
    captureUTMs,
    restoreUTMs,
    clearUTMs,
    getFormattedUTMData,

    // Utilities
    isPaymentReturn,
    debugState: debug ? debugUTMState : null,

    // Computed values
    source: utmData?.source || null,
    medium: utmData?.medium || null,
    campaign: utmData?.campaign || null,
    term: utmData?.term || null,
    content: utmData?.content || null,

    // For analytics
    analyticsData: getFormattedUTMData()
  };
};

export default useUTMTracking;
