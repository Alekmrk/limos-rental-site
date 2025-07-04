import { useState, useEffect } from 'react';

// Cookie consent hook for easy access throughout the app
const useCookieConsent = () => {
  const [consent, setConsent] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false
  });
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    // Load consent from localStorage
    try {
      const savedConsent = localStorage.getItem('cookie-consent');
      const timestamp = localStorage.getItem('cookie-consent-timestamp');
      
      if (savedConsent && timestamp) {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent(parsedConsent);
        setHasConsented(true);
      }
    } catch (error) {
      console.error('Error loading cookie consent:', error);
    }

    // Listen for consent updates
    const handleStorageChange = (e) => {
      if (e.key === 'cookie-consent') {
        try {
          const newConsent = JSON.parse(e.newValue);
          setConsent(newConsent);
          setHasConsented(true);
        } catch (error) {
          console.error('Error parsing consent update:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const canUse = (category) => {
    return consent[category] === true;
  };

  const showSettings = () => {
    if (window.showCookieSettings) {
      window.showCookieSettings();
    }
  };

  return {
    consent,
    hasConsented,
    canUse,
    showSettings
  };
};

export default useCookieConsent;