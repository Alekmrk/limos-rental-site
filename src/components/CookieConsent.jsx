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
  const [isInitialized, setIsInitialized] = useState(false);
  // GDPR Compliant: Default all non-essential to false
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, can't be disabled
    analytics: false, // GDPR compliant: default false
    marketing: false, // GDPR compliant: default false
    functional: false // GDPR compliant: default false
  });

  // Enhanced mobile device detection with cache awareness
  const detectMobileAndCache = () => {
    try {
      const userAgent = navigator.userAgent || '';
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);
      
      // Check for touch capability as additional mobile indicator
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Consider smaller screens as mobile
      const isSmallScreen = window.innerWidth <= 768;
      
      const detectedAsMobile = isMobile || (hasTouch && isSmallScreen) || isTablet;
      
      // Check for potential cache issues on mobile
      const isLikelyWebKit = /AppleWebKit/.test(userAgent) && !/Chrome/.test(userAgent);
      const isLikelySafari = isLikelyWebKit && /Safari/.test(userAgent);
      
      // Detect potential cache-related browser behaviors
      const cacheRisks = {
        iosSafari: isIOS && isLikelySafari, // iOS Safari has aggressive memory management
        androidMemoryOptimization: isAndroid && /Chrome/.test(userAgent), // Chrome on Android optimizes memory
        lowMemoryDevice: navigator.deviceMemory && navigator.deviceMemory < 4, // Low memory devices
        privateMode: false // Will be detected separately
      };
      
      // Try to detect private/incognito mode (affects localStorage)
      try {
        localStorage.setItem('__private_test__', '1');
        localStorage.removeItem('__private_test__');
        // If we get here, we're likely not in private mode
      } catch (e) {
        cacheRisks.privateMode = true;
      }
      
      // Check for potential app version cache issues
      const appVersion = '2025.07.28.001'; // Update this when making significant cookie changes
      const lastKnownVersion = localStorage.getItem('app-version');
      const isVersionMismatch = lastKnownVersion && lastKnownVersion !== appVersion;
      
      if (isVersionMismatch) {
        console.log('🍪 App version mismatch detected - may have cached JS:', { lastKnownVersion, appVersion });
        cacheRisks.versionMismatch = true;
        
        // For mobile browsers with old cached JS, try to force a refresh
        if (detectedAsMobile && lastKnownVersion && lastKnownVersion < '2025.07.28') {
          console.warn('🍪 Mobile device with significantly old cached JavaScript detected');
          console.warn('🍪 Recommend manual refresh: Ctrl+F5 or Cmd+Shift+R');
          
          // Add more aggressive detection flag
          cacheRisks.criticalVersionMismatch = true;
        }
      }
      
      // Update version
      try {
        localStorage.setItem('app-version', appVersion);
        
        // Add a runtime marker to detect if we're running the latest code
        localStorage.setItem('cookie-runtime-marker', 'enhanced-mobile-v1');
      } catch (e) {
        console.warn('🍪 Could not update app version in localStorage');
      }
      
      console.log('🍪 Enhanced device detection:', {
        userAgent: userAgent.substring(0, 100) + '...',
        isMobile,
        isTablet,
        isIOS,
        isAndroid,
        hasTouch,
        isSmallScreen,
        detectedAsMobile,
        screenWidth: window.innerWidth,
        cacheRisks,
        deviceMemory: navigator.deviceMemory || 'unknown',
        appVersion,
        lastKnownVersion
      });
      
      return {
        isMobile: detectedAsMobile,
        isIOS,
        isAndroid,
        cacheRisks,
        // Suggest more aggressive retry strategy for high-risk devices
        needsAggressiveRetry: cacheRisks.iosSafari || cacheRisks.androidMemoryOptimization || cacheRisks.lowMemoryDevice || cacheRisks.versionMismatch || cacheRisks.criticalVersionMismatch
      };
    } catch (error) {
      console.error('Error in mobile/cache detection:', error);
      return {
        isMobile: false,
        isIOS: false,
        isAndroid: false,
        cacheRisks: {},
        needsAggressiveRetry: false
      };
    }
  };

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

  // Check consent status and expiration
  const checkConsentStatus = () => {
    try {
      // Enhanced localStorage availability check for mobile browsers
      if (typeof localStorage === 'undefined' || !localStorage) {
        console.warn('🍪 localStorage not available');
        return { hasConsent: false, expired: false };
      }

      // Test localStorage read/write capability (mobile browsers sometimes have issues)
      try {
        const testKey = '__localStorage_test__';
        localStorage.setItem(testKey, 'test');
        const testValue = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        if (testValue !== 'test') {
          console.warn('🍪 localStorage not functioning properly');
          return { hasConsent: false, expired: false };
        }
      } catch (storageError) {
        console.warn('🍪 localStorage access denied:', storageError);
        return { hasConsent: false, expired: false };
      }

      const consent = localStorage.getItem('cookie-consent');
      const timestamp = localStorage.getItem('cookie-consent-timestamp');
      
      console.log('🍪 Raw localStorage values:', { consent, timestamp });
      
      if (!consent || !timestamp) {
        console.log('🍪 No consent or timestamp found in localStorage');
        return { hasConsent: false, expired: false };
      }

      // Check if consent was given very recently (within last 5 minutes)
      // This helps prevent re-showing banner after redirects from payment processors
      const consentDate = new Date(timestamp);
      const now = new Date();
      const minutesOld = (now.getTime() - consentDate.getTime()) / (1000 * 60);
      
      console.log('🍪 Consent age in minutes:', minutesOld);

      // Check if consent is older than 12 months (GDPR requirement)
      const monthsOld = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      console.log('🍪 Consent age in months:', monthsOld);
      
      if (monthsOld > 12) {
        // Consent expired, clear old data
        console.log('🍪 Consent expired, clearing data');
        localStorage.removeItem('cookie-consent');
        localStorage.removeItem('cookie-consent-timestamp');
        return { hasConsent: false, expired: true };
      }

      const savedPreferences = JSON.parse(consent);
      console.log('🍪 Valid consent found:', savedPreferences);
      
      // If consent was given very recently, it's likely from a redirect scenario
      const isRecentConsent = minutesOld < 5;
      
      return { 
        hasConsent: true, 
        expired: false, 
        preferences: savedPreferences,
        isRecentConsent 
      };
    } catch (error) {
      console.error('Error checking consent status:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem('cookie-consent');
        localStorage.removeItem('cookie-consent-timestamp');
      } catch (clearError) {
        console.error('Error clearing corrupted localStorage:', clearError);
      }
      return { hasConsent: false, expired: false };
    }
  };

  useEffect(() => {
    // Enhanced device and cache detection
    const deviceInfo = detectMobileAndCache();
    const { isMobile, isIOS, isAndroid, cacheRisks, needsAggressiveRetry } = deviceInfo;
    
    console.log('🍪 Initializing cookie consent with device info:', deviceInfo);
    
    // Special diagnostic for mobile cache issues
    if (isMobile) {
      const isFromStripeRedirect = document.referrer.includes('stripe') || window.location.search.includes('payment_success');
      const runtimeMarker = localStorage.getItem('cookie-runtime-marker');
      
      console.log('🍪 Mobile diagnostic:', {
        isFromStripeRedirect,
        runtimeMarker,
        hasOldMarker: runtimeMarker && runtimeMarker !== 'enhanced-mobile-v1',
        referrer: document.referrer,
        searchParams: window.location.search
      });
      
      if (isFromStripeRedirect && !runtimeMarker) {
        console.warn('🍪 Mobile user returning from Stripe with no runtime marker - likely cached JS');
      }
    }

    // Add a small delay to ensure localStorage is fully available after page load/redirect
    const checkAndInitialize = () => {
      try {
        // Additional check to ensure localStorage is accessible
        const testAccess = localStorage.getItem('test');
        
        const { hasConsent, expired, preferences: savedPreferences, isRecentConsent } = checkConsentStatus();
        
        console.log('🍪 Cookie consent check:', { hasConsent, expired, preferences: savedPreferences, isRecentConsent, deviceInfo });
        
        if (!hasConsent || expired) {
          // Show banner after a short delay, but only if we really don't have consent
          console.log('🍪 No valid consent found, showing banner');
          // Use longer delays for mobile devices and cache-risky browsers
          const showDelay = isMobile ? (cacheRisks.iosSafari ? 3000 : 2000) : 1000;
          const timer = setTimeout(() => {
            setShowBanner(true);
            setTimeout(() => setAnimateIn(true), 50);
          }, showDelay);
          setIsInitialized(true);
          return () => clearTimeout(timer);
        } else {
          // Load saved preferences and apply them
          console.log('🍪 Valid consent found, hiding banner');
          setPreferences(savedPreferences);
          initializeTracking(savedPreferences);
          setShowBanner(false);
          setIsInitialized(true);
          
          // If consent is very recent, it's likely from a redirect - don't show banner
          if (isRecentConsent) {
            console.log('🍪 Recent consent detected - likely from redirect, ensuring banner stays hidden');
          }
        }
      } catch (error) {
        console.error('Error accessing localStorage during consent check:', error);
        
        // Retry with device-aware strategy
        let retryCount = 0;
        const maxRetries = needsAggressiveRetry ? 7 : (isMobile ? 5 : 3);
        
        const retryCheck = () => {
          retryCount++;
          console.log(`🍪 Retry ${retryCount}/${maxRetries} (device: ${isMobile ? 'mobile' : 'desktop'}, aggressive: ${needsAggressiveRetry})`);
          
          try {
            const { hasConsent, expired, preferences: savedPreferences, isRecentConsent } = checkConsentStatus();
            console.log(`🍪 Retry ${retryCount}: Consent check result:`, { hasConsent, expired, isRecentConsent, deviceInfo });
            
            if (hasConsent && !expired) {
              setPreferences(savedPreferences);
              initializeTracking(savedPreferences);
              setShowBanner(false);
              setIsInitialized(true);
              return;
            }
          } catch (retryError) {
            console.error(`🍪 Retry ${retryCount} failed:`, retryError);
          }
          
          // If we've exhausted retries or still no consent, show the banner
          if (retryCount >= maxRetries) {
            console.log('🍪 Max retries reached, showing banner as fallback');
            setShowBanner(true);
            setTimeout(() => setAnimateIn(true), 50);
            setIsInitialized(true);
          } else {
            // Progressive delay strategy based on device type and cache risks
            let retryDelay = 500 * retryCount; // Base delay
            
            if (isMobile) {
              retryDelay = 1000 * retryCount; // Longer for mobile
            }
            
            if (cacheRisks.iosSafari) {
              retryDelay = Math.max(retryDelay, 1500 * retryCount); // Even longer for iOS Safari
            }
            
            if (cacheRisks.privateMode) {
              retryDelay = Math.max(retryDelay, 2000 * retryCount); // Longest for private mode
            }
            
            if (cacheRisks.versionMismatch) {
              retryDelay = Math.max(retryDelay, 1200 * retryCount); // Extra delay for version mismatches
            }
            
            if (cacheRisks.criticalVersionMismatch) {
              retryDelay = Math.max(retryDelay, 2500 * retryCount); // Much longer delay for critical mismatches
            }
            
            console.log(`🍪 Scheduling retry ${retryCount + 1} in ${retryDelay}ms (cache risks:`, Object.keys(cacheRisks).filter(k => cacheRisks[k]).join(', '), ')');
            setTimeout(retryCheck, retryDelay);
          }
        };
        
        const initialRetryDelay = isMobile ? (cacheRisks.iosSafari ? 1500 : 1000) : 500;
        setTimeout(retryCheck, initialRetryDelay);
      }
    };

    // Use device-aware initialization timeout
    let initDelay = 300; // Default desktop
    
    if (isMobile) {
      initDelay = 1000; // Standard mobile
      
      if (cacheRisks.iosSafari) {
        initDelay = 1500; // iOS Safari needs more time
      }
      
      if (cacheRisks.privateMode) {
        initDelay = 2000; // Private mode needs even more time
      }
      
      if (cacheRisks.versionMismatch) {
        initDelay = Math.max(initDelay, 1200); // Version mismatch needs extra time
      }
      
      if (cacheRisks.criticalVersionMismatch) {
        initDelay = Math.max(initDelay, 2500); // Critical mismatch needs much more time
      }
    } else if (cacheRisks.versionMismatch) {
      initDelay = 800; // Even desktop needs more time for version mismatches
    } else if (cacheRisks.criticalVersionMismatch) {
      initDelay = 1500; // Desktop critical mismatch
    }
    
    console.log(`🍪 Starting initialization with ${initDelay}ms delay for device type:`, deviceInfo);
    const initTimer = setTimeout(checkAndInitialize, initDelay);
    return () => clearTimeout(initTimer);
  }, []); // Empty dependency array to run only once on mount

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

  if (!showBanner && !isInitialized) {
    // Don't render anything until we've determined consent status
    return null;
  }

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
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-700">Essential Cookies</h3>
                        <span className="text-xs bg-green-500/20 text-green-700 px-3 py-1 rounded-full font-medium border border-green-500/30">
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