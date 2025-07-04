import { useState, useEffect, useCallback } from 'react';

// Cookie utility functions
const CookieManager = {
  set: (name, value, days = 365) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  },
  
  get: (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  
  delete: (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },
  
  deleteByCategory: (category) => {
    // Define cookies by category for cleanup
    const cookiesByCategory = {
      analytics: ['_ga', '_ga_*', '_gid', '_gat', '_gtag', 'gtag'],
      marketing: ['_fbp', '_fbc', 'fr', 'sb', 'wd', '_gcl_au', 'ads'],
      functional: ['lang', 'theme', 'preferences']
    };
    
    const cookies = cookiesByCategory[category] || [];
    cookies.forEach(cookieName => {
      if (cookieName.includes('*')) {
        // Handle wildcard cookies like _ga_*
        const prefix = cookieName.replace('*', '');
        const allCookies = document.cookie.split(';');
        allCookies.forEach(cookie => {
          const name = cookie.split('=')[0].trim();
          if (name.startsWith(prefix)) {
            CookieManager.delete(name);
          }
        });
      } else {
        CookieManager.delete(cookieName);
      }
    });
  }
};

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  // GDPR Compliant: Default all non-essential to false
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, can't be disabled
    analytics: false, // GDPR compliant: default false
    marketing: false, // GDPR compliant: default false
    functional: false // GDPR compliant: default false
  });

  // Add styles only once using a ref to prevent re-injection
  useEffect(() => {
    // Check if styles already exist
    if (document.getElementById('cookie-consent-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'cookie-consent-styles';
    style.textContent = `
      .pulse-glow {
        animation: pulse-glow 2s infinite;
      }
      
      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 0 0 20px rgba(212,175,55,0.3);
        }
        50% {
          box-shadow: 0 0 30px rgba(212,175,55,0.6);
        }
      }

      .cookie-banner-enter {
        transform: translateY(100%);
        opacity: 0;
      }

      .cookie-banner-animate {
        transform: translateY(0);
        opacity: 1;
        transition: transform 0.5s ease-out, opacity 0.5s ease-out;
      }

      .cookie-modal-enter {
        transform: scale(0.9);
        opacity: 0;
      }

      .cookie-modal-animate {
        transform: scale(1);
        opacity: 1;
        transition: transform 0.3s ease-out, opacity 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Check consent status and expiration
  const checkConsentStatus = useCallback(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      const timestamp = localStorage.getItem('cookie-consent-timestamp');
      
      if (!consent || !timestamp) {
        return { hasConsent: false, expired: false };
      }

      // Check if consent is older than 12 months (GDPR requirement)
      const consentDate = new Date(timestamp);
      const now = new Date();
      const monthsOld = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsOld > 12) {
        // Consent expired, clear old data
        localStorage.removeItem('cookie-consent');
        localStorage.removeItem('cookie-consent-timestamp');
        return { hasConsent: false, expired: true };
      }

      const savedPreferences = JSON.parse(consent);
      return { hasConsent: true, expired: false, preferences: savedPreferences };
    } catch (error) {
      console.error('Error checking consent status:', error);
      // Clear corrupted data
      localStorage.removeItem('cookie-consent');
      localStorage.removeItem('cookie-consent-timestamp');
      return { hasConsent: false, expired: false };
    }
  }, []);

  useEffect(() => {
    const { hasConsent, expired, preferences: savedPreferences } = checkConsentStatus();
    
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setAnimateIn(true), 50);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences and apply them
      setPreferences(savedPreferences);
      initializeTracking(savedPreferences);
      setShowBanner(false);
    }
  }, [checkConsentStatus]);

  const initializeTracking = useCallback((prefs) => {
    // Clean up cookies for disabled categories first
    Object.keys(prefs).forEach(category => {
      if (category !== 'essential' && !prefs[category]) {
        CookieManager.deleteByCategory(category);
      }
    });

    // Initialize Google Analytics if analytics cookies are accepted
    if (prefs.analytics) {
      // Initialize Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }
      
      // Set analytics cookies
      CookieManager.set('analytics_consent', 'granted', 365);
      console.log('Analytics tracking enabled');
    } else {
      CookieManager.delete('analytics_consent');
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }
    }

    // Initialize marketing pixels if marketing cookies are accepted
    if (prefs.marketing) {
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
      }
      
      CookieManager.set('marketing_consent', 'granted', 365);
      console.log('Marketing tracking enabled');
    } else {
      CookieManager.delete('marketing_consent');
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied'
        });
      }
    }

    // Initialize functional cookies if accepted
    if (prefs.functional) {
      CookieManager.set('functional_consent', 'granted', 365);
      console.log('Functional cookies enabled');
    } else {
      CookieManager.delete('functional_consent');
    }

    // Always set essential cookies
    CookieManager.set('essential_consent', 'granted', 365);
  }, []);

  const savePreferences = useCallback((newPreferences) => {
    try {
      setPreferences(newPreferences);
      localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
      localStorage.setItem('cookie-consent-timestamp', new Date().toISOString());
      initializeTracking(newPreferences);
      
      // Hide banner regardless of choices (GDPR compliant)
      setShowBanner(false);
      setShowSettings(false);
      setAnimateIn(false);
    } catch (error) {
      console.error('Error saving cookie preferences:', error);
    }
  }, [initializeTracking]);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    savePreferences(allAccepted);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    savePreferences(essentialOnly);
  };

  const handlePreferenceChange = (category) => {
    if (category === 'essential') return;
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Method to show settings (for privacy policy page or user preference changes)
  const showCookieSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  // Expose method globally for other components to use
  useEffect(() => {
    window.showCookieSettings = showCookieSettings;
    return () => {
      delete window.showCookieSettings;
    };
  }, [showCookieSettings]);

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className={`fixed bottom-0 left-0 right-0 z-[300] bg-zinc-900/98 backdrop-blur-sm border-t border-gold/30 p-3 shadow-2xl ${
        animateIn ? 'cookie-banner-animate' : 'cookie-banner-enter'
      }`}>
        <div className="container-default max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Content */}
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                🍪 WE VALUE YOUR PRIVACY
              </h3>
              <p className="text-zinc-300 text-xs leading-relaxed">
                We use cookies to enhance your browsing experience. You can choose which cookies to accept. 
                <a href="/privacy-policy" className="text-gold hover:text-gold/80 underline ml-1">Learn more</a>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="px-3 py-1.5 text-xs border border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-500 rounded-md transition-all duration-200 order-2 sm:order-1"
              >
                Customize
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm bg-gold text-black font-semibold hover:bg-gold/90 rounded-md transition-all duration-200 shadow-[0_0_15px_rgba(212,175,55,0.3)] pulse-glow order-1 sm:order-2"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`bg-zinc-800 border border-zinc-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto ${
            showSettings ? 'cookie-modal-animate' : 'cookie-modal-enter'
          }`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Cookie Preferences</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                  aria-label="Close settings"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Notice */}
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 mb-6">
                <h4 className="text-blue-400 font-medium mb-2">ℹ️ Your Choice Matters</h4>
                <p className="text-sm text-zinc-300">
                  You have full control over your privacy. Choose which cookies you're comfortable with.
                </p>
              </div>

              {/* Cookie Categories */}
              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="border border-zinc-700/50 rounded-lg p-4">
                  <div className="flex items-start sm:items-center justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        Essential Cookies
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Required</span>
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-12 h-6 bg-gold rounded-full relative">
                        <div className="absolute top-1 right-1 w-4 h-4 bg-black rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Required for the website to function properly. These include session management, 
                    security features, and basic functionality.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-zinc-700/50 rounded-lg p-4">
                  <div className="flex items-start sm:items-center justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white">Analytics Cookies</h3>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handlePreferenceChange('analytics')}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          preferences.analytics ? 'bg-gold' : 'bg-zinc-600'
                        }`}
                        aria-label={`${preferences.analytics ? 'Disable' : 'Enable'} analytics cookies`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Help us understand how visitors interact with our website and improve your experience.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-zinc-700/50 rounded-lg p-4">
                  <div className="flex items-start sm:items-center justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white">Marketing Cookies</h3>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handlePreferenceChange('marketing')}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          preferences.marketing ? 'bg-gold' : 'bg-zinc-600'
                        }`}
                        aria-label={`${preferences.marketing ? 'Disable' : 'Enable'} marketing cookies`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Allow us to show you relevant offers and measure campaign effectiveness.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="border border-zinc-700/50 rounded-lg p-4">
                  <div className="flex items-start sm:items-center justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white">Functional Cookies</h3>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handlePreferenceChange('functional')}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          preferences.functional ? 'bg-gold' : 'bg-zinc-600'
                        }`}
                        aria-label={`${preferences.functional ? 'Disable' : 'Enable'} functional cookies`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.functional ? 'translate-x-6' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Enable enhanced functionality like language preferences and personalized content.
                  </p>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-zinc-700/50">
                <button
                  onClick={handleAcceptSelected}
                  className="flex-1 px-4 py-2 bg-gold text-black font-medium hover:bg-gold/90 rounded-lg transition-all duration-200"
                >
                  Save Preferences
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-4 py-2 bg-gold text-black font-medium hover:bg-gold/90 rounded-lg transition-all duration-200 ring-2 ring-gold/50"
                >
                  Accept All
                </button>
              </div>

              {/* Privacy Policy Link */}
              <div className="mt-4 text-center">
                <p className="text-zinc-400 text-xs">
                  For more information, read our{' '}
                  <a href="/privacy-policy" className="text-gold hover:text-gold/80 underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;