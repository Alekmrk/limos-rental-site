/**
 * React Hook for Analytics Integration
 * Provides easy-to-use analytics functions with UTM integration
 */

import { useEffect, useCallback, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import useUTMTracking from './useUTMTracking';
import ReservationContext from '../contexts/ReservationContext';
import {
  sendGA4PageView,
  trackBookingStep,
  trackQuoteGenerated,
  trackVehicleSelected,
  trackConversion,
  trackPaymentFailure,
  trackCustomEvent
} from '../services/analytics';

/**
 * Analytics hook with UTM integration
 */
const useAnalytics = (options = {}) => {
  const {
    autoTrackPageViews = true,
    debug = import.meta.env.DEV
  } = options;

  const location = useLocation();
  const { utmData, hasUTMs } = useUTMTracking({ autoCapture: false });
  const reservationContext = useContext(ReservationContext);

  /**
   * Track page view with UTM data
   */
  const trackPageView = useCallback((customPath = null, customTitle = null) => {
    const path = customPath || location.pathname;
    const title = customTitle || document.title;
    
    sendGA4PageView(path, title, utmData);
    
    if (debug) {
      console.log('📄 [Analytics] Page view tracked:', { path, title, utmData });
    }
  }, [location.pathname, utmData, debug]);

  /**
   * Track booking funnel progression
   */
  const trackFunnelStep = useCallback((step, additionalData = {}) => {
    const stepData = {
      ...additionalData,
      timestamp: new Date().toISOString(),
      page_path: location.pathname
    };

    // Add reservation context data if available
    if (reservationContext?.reservationInfo) {
      const reservation = reservationContext.reservationInfo;
      
      if (reservation.selectedVehicle) {
        stepData.vehicle_name = reservation.selectedVehicle.name;
        stepData.vehicle_id = reservation.selectedVehicle.id;
      }
      
      if (reservation.pickup) {
        stepData.pickup_location = reservation.pickup;
      }
      
      if (reservation.dropoff) {
        stepData.dropoff_location = reservation.dropoff;
      }
      
      stepData.service_type = reservation.isHourly ? 'hourly' : 'transfer';
    }

    trackBookingStep(step, stepData);
    
    if (debug) {
      console.log(`🛒 [Analytics] Funnel step tracked: ${step}`, stepData);
    }
  }, [location.pathname, reservationContext, debug]);

  /**
   * Track quote generation
   */
  const trackQuote = useCallback((quoteData = {}) => {
    const reservation = reservationContext?.reservationInfo || {};
    
    const fullQuoteData = {
      amount: quoteData.amount || 0,
      pickup: reservation.pickup || quoteData.pickup,
      dropoff: reservation.dropoff || quoteData.dropoff,
      isHourly: reservation.isHourly || quoteData.isHourly,
      selectedVehicle: reservation.selectedVehicle || quoteData.selectedVehicle,
      ...quoteData
    };

    trackQuoteGenerated(fullQuoteData, utmData);
    
    if (debug) {
      console.log('💡 [Analytics] Quote tracked:', fullQuoteData);
    }
  }, [reservationContext, utmData, debug]);

  /**
   * Track vehicle selection
   */
  const trackVehicle = useCallback((vehicleData) => {
    trackVehicleSelected(vehicleData, utmData);
    
    if (debug) {
      console.log('🚗 [Analytics] Vehicle selection tracked:', vehicleData);
    }
  }, [utmData, debug]);

  /**
   * Track successful conversion
   */
  const trackBookingConversion = useCallback((reservationData = null) => {
    const reservation = reservationData || reservationContext?.reservationInfo;
    
    if (!reservation) {
      console.warn('⚠️ [Analytics] No reservation data for conversion tracking');
      return;
    }

    trackConversion(reservation, utmData);
    
    if (debug) {
      console.log('🎉 [Analytics] Conversion tracked:', reservation);
    }
  }, [reservationContext, utmData, debug]);

  /**
   * Track payment failure
   */
  const trackPaymentError = useCallback((errorData) => {
    trackPaymentFailure(errorData, utmData);
    
    if (debug) {
      console.log('💥 [Analytics] Payment failure tracked:', errorData);
    }
  }, [utmData, debug]);

  /**
   * Track custom events with UTM context
   */
  const track = useCallback((eventName, eventData = {}) => {
    trackCustomEvent(eventName, eventData, utmData);
    
    if (debug) {
      console.log(`📊 [Analytics] Custom event: ${eventName}`, eventData);
    }
  }, [utmData, debug]);

  /**
   * Get current analytics context
   */
  const getAnalyticsContext = useCallback(() => {
    return {
      utmData,
      hasUTMs,
      currentPath: location.pathname,
      reservationData: reservationContext?.reservationInfo || null,
      timestamp: new Date().toISOString()
    };
  }, [utmData, hasUTMs, location.pathname, reservationContext]);

  // Auto-track page views
  useEffect(() => {
    if (autoTrackPageViews) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        trackPageView();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, autoTrackPageViews, trackPageView]);

  // Track funnel steps based on current page
  useEffect(() => {
    const pathToStep = {
      '/': 'landing',
      '/vehicles': 'quote_request',
      '/vehicle-selection': 'vehicle_selection',
      '/booking': 'vehicle_selection',
      '/customer-details': 'customer_details',
      '/payment': 'payment_page',
      '/payment-success': 'booking_completed',
      '/thankyou': 'booking_completed'
    };

    const step = pathToStep[location.pathname];
    if (step) {
      // Small delay to ensure page is settled
      const timer = setTimeout(() => {
        trackFunnelStep(step);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, trackFunnelStep]);

  return {
    // Core tracking functions
    trackPageView,
    trackFunnelStep,
    trackQuote,
    trackVehicle,
    trackBookingConversion,
    trackPaymentError,
    track,

    // Context
    getAnalyticsContext,
    utmData,
    hasUTMs,

    // Utilities
    isAnalyticsEnabled: typeof window !== 'undefined' && typeof window.gtag !== 'undefined',
    debugMode: debug
  };
};

export default useAnalytics;
