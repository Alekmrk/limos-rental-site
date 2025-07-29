import { useState, useEffect, useCallback } from 'react';

// Cookie consent hook for easy access throughout the app
const useCookieConsent = () => {
  const [consent, setConsent] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false
  });
  const [hasConsented, setHasConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load consent from storage
  const loadConsent = useCallback(() => {
    try {
      const savedConsent = localStorage.getItem('cookie-consent');
      const timestamp = localStorage.getItem('cookie-consent-timestamp');
      
      if (savedConsent && timestamp) {
        // Check if consent is still valid (not older than 12 months)
        const consentDate = new Date(timestamp);
        const now = new Date();
        const monthsOld = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        if (monthsOld <= 12) {
          const parsedConsent = JSON.parse(savedConsent);
          setConsent(parsedConsent);
          setHasConsented(true);
          return true;
        } else {
          // Consent expired
          localStorage.removeItem('cookie-consent');
          localStorage.removeItem('cookie-consent-timestamp');
        }
      }
      return false;
    } catch (error) {
      console.error('Error loading cookie consent:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    // Initial load with small delay to ensure localStorage is available
    const timer = setTimeout(() => {
      loadConsent();
      setIsLoading(false);
    }, 50);

    // Listen for consent updates in other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'cookie-consent') {
        console.log('🍪 Cookie consent updated in another tab');
        loadConsent();
      }
    };

    // Listen for consent updates in the same tab
    const handleConsentUpdate = () => {
      console.log('🍪 Cookie consent updated in current tab');
      loadConsent();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
    };
  }, [loadConsent]);

  const canUse = useCallback((category) => {
    return consent[category] === true;
  }, [consent]);

  const showSettings = useCallback(() => {
    if (window.showCookieSettings) {
      window.showCookieSettings();
    }
  }, []);

  return {
    consent,
    hasConsented,
    isLoading,
    canUse,
    showSettings
  };
};

export default useCookieConsent;