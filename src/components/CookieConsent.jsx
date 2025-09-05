import { useState, useEffect, useCallback } from 'react';

// TEMPORARY DISABLE FLAG - Set to true to disable cookie consent popup
const DISABLE_COOKIE_CONSENT = true;

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
  // Early return if cookie consent is disabled
  if (DISABLE_COOKIE_CONSENT) {
    return null;
  }

  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
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
          box-shadow: 0 0 20px rgba(212,175,55,0.4);
        }
        50% {
          box-shadow: 0 0 30px rgba(212,175,55,0.7);
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
      
      .cookie-toggle {
        transition: all 0.3s ease;
      }
      
      .cookie-toggle:hover {
        transform: scale(1.05);
      }
    `;
    document.head.appendChild(style);
  }, []);

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

  // Migration function for legacy cookie data (must be defined before checkConsentStatus)
  const migrateLegacyData = useCallback(() => {
    try {
      const legacyConsent = localStorage.getItem('cookie-consent');
      const legacyTimestamp = localStorage.getItem('cookie-consent-timestamp');
      
      if (legacyConsent && legacyTimestamp) {
        console.log('🔄 Migrating legacy cookie data to v2.0...');
        
        const preferences = JSON.parse(legacyConsent);
        const consentData = {
          preferences: preferences,
          timestamp: legacyTimestamp,
          version: '2.0',
          source: 'migrated_from_v1',
          userAgent: navigator.userAgent.substring(0, 100)
        };
        
        // Save new format
        localStorage.setItem('cookie-consent-data', JSON.stringify(consentData));
        
        // Clean up legacy data
        localStorage.removeItem('cookie-consent');
        localStorage.removeItem('cookie-consent-timestamp');
        localStorage.removeItem('cookie-consent-temp-marker'); // Also remove temp marker
        
        console.log('✅ Migration completed successfully');
        return { hasConsent: true, preferences: preferences, timestamp: legacyTimestamp };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Migration failed:', error);
      // Clean up corrupted legacy data
      localStorage.removeItem('cookie-consent');
      localStorage.removeItem('cookie-consent-timestamp');
      localStorage.removeItem('cookie-consent-temp-marker');
      return null;
    }
  }, []);

  // Simplified consent status checking with atomic storage and migration
  const checkConsentStatus = useCallback(() => {
    try {
      // First check for new format
      const consentData = localStorage.getItem('cookie-consent-data');
      const lastHidden = localStorage.getItem('cookie-consent-last-hidden');
      
      if (!consentData) {
        // Try migration from legacy format
        const migrated = migrateLegacyData();
        if (migrated) {
          return { ...migrated, lastHidden: lastHidden };
        }
        return { hasConsent: false, expired: false, lastHidden: lastHidden };
      }

      const data = JSON.parse(consentData);
      
      // Validate data structure
      if (!data.preferences || !data.timestamp || !data.version) {
        console.warn('🍪 Invalid consent data structure, clearing...');
        localStorage.removeItem('cookie-consent-data');
        return { hasConsent: false, expired: false, lastHidden: lastHidden };
      }

      // Check if consent is older than 12 months (GDPR requirement)
      const consentDate = new Date(data.timestamp);
      const now = new Date();
      const monthsOld = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsOld > 12) {
        console.log('🍪 Consent expired (12+ months), clearing data...');
        localStorage.removeItem('cookie-consent-data');
        return { hasConsent: false, expired: true, lastHidden: lastHidden };
      }

      return { 
        hasConsent: true, 
        expired: false, 
        preferences: data.preferences, 
        lastHidden: lastHidden,
        timestamp: data.timestamp 
      };
    } catch (error) {
      console.error('🍪 Error checking consent status:', error);
      // Clear corrupted data but preserve last hidden timestamp
      const lastHidden = localStorage.getItem('cookie-consent-last-hidden');
      localStorage.removeItem('cookie-consent-data');
      return { hasConsent: false, expired: false, lastHidden: lastHidden };
    }
  }, [migrateLegacyData]);

  // Simplified initialization with atomic checks
  useEffect(() => {
    // Prevent multiple initialization runs
    if (isInitialized || consentChecked) return;
    
    // Add a small delay to ensure localStorage is available and navigation is complete
    const initTimer = setTimeout(() => {
      const currentTime = new Date().getTime();
      
      // Single atomic check for all consent data
      const { hasConsent, preferences: savedPreferences, timestamp } = checkConsentStatus();
      
      // Check for recent consent setting (within 5 minutes)
      const recentlySet = timestamp && 
        (currentTime - new Date(timestamp).getTime()) < (5 * 60 * 1000);
      
      // Check for session markers
      const justSet = sessionStorage.getItem('cookie-consent-just-set');
      const suppressedThisSession = sessionStorage.getItem('cookie-consent-suppressed');
      
      // Check for temporary protection (survives redirects)
      let tempProtection = false;
      const tempProtectionData = localStorage.getItem('cookie-consent-temp-protection');
      if (tempProtectionData) {
        try {
          const protection = JSON.parse(tempProtectionData);
          const notExpired = new Date(protection.expires) > new Date();
          tempProtection = notExpired;
          
          if (!notExpired) {
            localStorage.removeItem('cookie-consent-temp-protection');
            console.log('🧹 Expired temp protection cleaned up');
          }
        } catch (e) {
          localStorage.removeItem('cookie-consent-temp-protection');
        }
      }
      
      // Payment flow detection
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const isPaymentPage = window.location.pathname.includes('/payment');
      const isFromStripe = document.referrer.includes('stripe') || 
                          document.referrer.includes('checkout.stripe.com');
      
      // Enhanced suppression logic with temp protection
      const shouldSuppress = justSet || recentlySet || suppressedThisSession || 
                            tempProtection ||
                            (isFromStripe && (hasConsent || tempProtection)) || 
                            ((sessionId || isPaymentPage) && (hasConsent || tempProtection));
      
      if (shouldSuppress) {
        console.log('🍪 Cookie consent suppressed', {
          justSet: !!justSet,
          recentlySet,
          suppressedThisSession: !!suppressedThisSession,
          tempProtection,
          paymentContext: !!(sessionId || isPaymentPage),
          fromStripe: isFromStripe && (hasConsent || tempProtection),
          timeSinceSet: timestamp ? Math.round((currentTime - new Date(timestamp).getTime()) / 60000) + ' minutes' : 'N/A'
        });
        setConsentChecked(true);
        setIsInitialized(true);
        return;
      }
      
      console.log('🍪 Cookie consent check:', { 
        hasConsent, 
        savedPreferences,
        timestamp: timestamp ? new Date(timestamp).toLocaleString() : 'Never'
      });
      
      setConsentChecked(true);
      
      if (hasConsent && savedPreferences) {
        // Load saved preferences and apply them
        console.log('🍪 Loading saved cookie preferences');
        setPreferences(savedPreferences);
        initializeTracking(savedPreferences);
        setShowBanner(false);
        setIsInitialized(true);
      } else {
        // Check if user recently dismissed banner (within last hour) to prevent spam
        const lastHidden = localStorage.getItem('cookie-consent-last-hidden');
        if (lastHidden) {
          const timeSinceHidden = currentTime - new Date(lastHidden).getTime();
          const oneHour = 60 * 60 * 1000;
          
          if (timeSinceHidden < oneHour) {
            console.log('🍪 Banner was recently hidden, waiting before showing again');
            setIsInitialized(true);
            return;
          }
        }
        
        // Show banner after additional delay to ensure page is fully loaded
        const bannerTimer = setTimeout(() => {
          console.log('🍪 Showing cookie banner');
          setShowBanner(true);
          setTimeout(() => setAnimateIn(true), 50);
        }, 800); // Reduced delay since logic is simpler
        
        setIsInitialized(true);
        return () => clearTimeout(bannerTimer);
      }
    }, 200); // Reduced delay since we're more efficient

    return () => clearTimeout(initTimer);
  }, [isInitialized, consentChecked, checkConsentStatus, initializeTracking]);

  // Simplified cross-tab synchronization with debouncing
  useEffect(() => {
    let eventProcessing = false;
    
    const handleStorageChange = (e) => {
      if (!isInitialized || eventProcessing) return;
      
      // Process main consent data and temp protection
      if (e.key !== 'cookie-consent-data' && 
          e.key !== 'cookie-consent-last-hidden' && 
          e.key !== 'cookie-consent-temp-protection') return;
      
      eventProcessing = true;
      
      console.log(`🍪 Storage change detected: ${e.key}`, { 
        hasNewValue: !!e.newValue,
        source: 'cross-tab-sync'
      });
      
      // Debounce to prevent event storms
      setTimeout(() => {
        const { hasConsent, preferences: savedPreferences } = checkConsentStatus();
        
        // Handle consent data changes
        if (e.key === 'cookie-consent-data') {
          if (hasConsent && savedPreferences) {
            console.log('🍪 Valid consent detected from another tab - applying preferences');
            setPreferences(savedPreferences);
            initializeTracking(savedPreferences);
            setShowBanner(false);
            setShowSettings(false);
          }
        }
        
        // Handle temp protection changes
        if (e.key === 'cookie-consent-temp-protection' && e.newValue) {
          console.log('🔒 Temp protection detected from another tab - hiding banner');
          setShowBanner(false);
          setAnimateIn(false);
        }
        
        // Handle banner dismissal
        if (e.key === 'cookie-consent-last-hidden' && e.newValue) {
          const timeSinceHidden = new Date().getTime() - new Date(e.newValue).getTime();
          const oneHour = 60 * 60 * 1000;
          
          if (timeSinceHidden < oneHour) {
            console.log('🍪 Recent dismissal detected - hiding banner in this tab too');
            setShowBanner(false);
            setAnimateIn(false);
          }
        }
        
        eventProcessing = false;
      }, 100); // 100ms debounce
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isInitialized, checkConsentStatus, initializeTracking]);

  const savePreferences = useCallback((newPreferences) => {
    try {
      console.log('🍪 Saving cookie preferences:', newPreferences);
      const timestamp = new Date().toISOString();
      
      // Atomic storage - save everything in one operation
      const consentData = {
        preferences: newPreferences,
        timestamp: timestamp,
        version: '2.0', // Version for future migrations
        source: 'user_choice',
        userAgent: navigator.userAgent.substring(0, 100) // Truncated for privacy
      };
      
      // Single localStorage write to prevent race conditions
      localStorage.setItem('cookie-consent-data', JSON.stringify(consentData));
      
      // Set session marker for immediate protection
      sessionStorage.setItem('cookie-consent-just-set', 'true');
      
      // Add temporary protection marker for payment flows (survives redirects)
      const tempProtection = {
        timestamp: timestamp,
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 minutes
        preferences: newPreferences,
        reason: 'payment_protection'
      };
      localStorage.setItem('cookie-consent-temp-protection', JSON.stringify(tempProtection));
      
      // Auto-cleanup temp protection after expiry
      setTimeout(() => {
        try {
          const stored = localStorage.getItem('cookie-consent-temp-protection');
          if (stored) {
            const data = JSON.parse(stored);
            if (new Date(data.expires) <= new Date()) {
              localStorage.removeItem('cookie-consent-temp-protection');
              console.log('🧹 Temp protection expired and cleaned up');
            }
          }
        } catch (e) {
          localStorage.removeItem('cookie-consent-temp-protection');
        }
      }, 60 * 60 * 1000); // 60 minutes
      
      // Update component state
      setPreferences(newPreferences);
      
      // Notify components via custom event
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
        detail: newPreferences
      }));
      
      // Apply tracking settings
      initializeTracking(newPreferences);
      
      // Hide banner and settings
      setShowBanner(false);
      setShowSettings(false);
      setAnimateIn(false);
      
      console.log('✅ Cookie preferences saved successfully with timestamp:', timestamp);
    } catch (error) {
      console.error('❌ Error saving cookie preferences:', error);
      // Show user-friendly error message
      alert('Sorry, there was an issue saving your cookie preferences. Please try again.');
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

  // Handle banner dismissal without setting preferences (for later decision)
  const handleDismissBanner = () => {
    console.log('🍪 User dismissed cookie banner without setting preferences');
    localStorage.setItem('cookie-consent-last-hidden', new Date().toISOString());
    setShowBanner(false);
    setAnimateIn(false);
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
      <div className={`fixed bottom-0 left-0 right-0 z-[300] bg-gradient-to-r from-warm-white/85 via-cream/85 to-warm-white/85 backdrop-blur-md border-t-2 border-gold/50 p-4 shadow-2xl ${
        animateIn ? 'cookie-banner-animate' : 'cookie-banner-enter'
      }`}>
        <div className="container-default max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gold/30 rounded-full flex items-center justify-center">
                  <span className="text-lg">🍪</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Privacy & Cookie Preferences
                </h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed max-w-2xl">
                We respect your privacy and use cookies to enhance your experience with our luxury transportation services. 
                Choose your preferences or{' '}
                <a href="/privacy-policy" className="text-gold hover:text-gold/80 underline font-medium">
                  learn more in our Privacy Policy
                </a>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="px-6 py-3 text-sm border-2 border-gray-400/50 text-gray-700 hover:text-gray-800 hover:border-gold/60 hover:bg-gold/10 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
              >
                Customize Settings
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-8 py-3 text-sm bg-gradient-to-r from-gold to-gold/90 text-gray-800 font-semibold hover:from-gold/90 hover:to-gold/80 rounded-lg transition-all duration-300 shadow-lg pulse-glow"
              >
                Accept All Cookies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center bg-gray-900/40 backdrop-blur-lg p-4">
          <div className={`bg-gradient-to-br from-warm-white/95 to-cream-light/95 border-2 border-gold/30 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto backdrop-blur-sm ${
            showSettings ? 'cookie-modal-animate' : 'cookie-modal-enter'
          }`}>
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🍪</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold text-gray-800">Cookie Preferences</h2>
                    <p className="text-gray-600 text-sm">Customize your privacy settings</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-200/50"
                  aria-label="Close settings"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Notice */}
              <div className="bg-gradient-to-r from-gold/10 to-gold/15 p-6 rounded-xl border border-gold/30 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gold text-sm">ℹ️</span>
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-semibold mb-2">Your Privacy, Your Choice</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      At Elite Way Limo, we believe in transparency and giving you complete control over your data. 
                      Choose which cookies you're comfortable with to personalize your luxury travel experience.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookie Categories */}
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="bg-gradient-to-r from-cream/40 to-warm-white/40 border border-soft-gray/40 rounded-xl p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-700">Essential Cookies</h3>
                        <span className="text-xs bg-green-500/20 text-green-700 px-3 py-1 rounded-full font-medium border border-green-500/30 w-fit">
                          Always Active
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-14 h-7 bg-gradient-to-r from-green-400 to-green-500 rounded-full relative shadow-inner">
                        <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Required for our website to function properly. These include security features, 
                    session management, and basic functionality that ensure a safe and reliable experience.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-gradient-to-r from-cream/20 to-warm-white/20 border border-gray-300/40 rounded-xl p-6 hover:border-gold/50 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Analytics Cookies</h3>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handlePreferenceChange('analytics')}
                        className={`cookie-toggle w-14 h-7 rounded-full relative shadow-inner ${
                          preferences.analytics 
                            ? 'bg-gradient-to-r from-gold to-gold/80' 
                            : 'bg-gradient-to-r from-gray-300 to-gray-400'
                        }`}
                        aria-label={`${preferences.analytics ? 'Disable' : 'Enable'} analytics cookies`}
                      >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                          preferences.analytics ? 'translate-x-7' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Help us understand how you interact with our website to improve your luxury travel experience 
                    and optimize our services for better performance.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-gradient-to-r from-cream/20 to-warm-white/20 border border-gray-300/40 rounded-xl p-6 hover:border-gold/50 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Marketing Cookies</h3>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handlePreferenceChange('marketing')}
                        className={`cookie-toggle w-14 h-7 rounded-full relative shadow-inner ${
                          preferences.marketing 
                            ? 'bg-gradient-to-r from-gold to-gold/80' 
                            : 'bg-gradient-to-r from-gray-300 to-gray-400'
                        }`}
                        aria-label={`${preferences.marketing ? 'Disable' : 'Enable'} marketing cookies`}
                      >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                          preferences.marketing ? 'translate-x-7' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Enable personalized offers and relevant content about our luxury transportation services. 
                    Help us measure campaign effectiveness and show you tailored experiences.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="bg-gradient-to-r from-cream/20 to-warm-white/20 border border-gray-300/40 rounded-xl p-6 hover:border-gold/50 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Functional Cookies</h3>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handlePreferenceChange('functional')}
                        className={`cookie-toggle w-14 h-7 rounded-full relative shadow-inner ${
                          preferences.functional 
                            ? 'bg-gradient-to-r from-gold to-gold/80' 
                            : 'bg-gradient-to-r from-gray-300 to-gray-400'
                        }`}
                        aria-label={`${preferences.functional ? 'Disable' : 'Enable'} functional cookies`}
                      >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                          preferences.functional ? 'translate-x-7' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Enable enhanced features like language preferences, location settings, and personalized content 
                    to make your booking experience more convenient and tailored.
                  </p>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t border-soft-gray/40">
                <button
                  onClick={handleAcceptSelected}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-600/80 to-gray-700/80 text-white font-semibold hover:from-gray-700/80 hover:to-gray-800/80 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                >
                  Save My Preferences
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gold to-gold/90 text-gray-800 font-semibold hover:from-gold/90 hover:to-gold/80 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ring-2 ring-gold/30"
                >
                  Accept All Cookies
                </button>
              </div>

              {/* Privacy Policy Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  For detailed information about our data practices, please read our{' '}
                  <a href="/privacy-policy" className="text-gray-700 hover:text-gray-800 underline font-medium">
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