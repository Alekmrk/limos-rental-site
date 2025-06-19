import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, can't be disabled
    analytics: true, // Default enabled
    marketing: true, // Default enabled
    functional: true // Default enabled
  });

  useEffect(() => {
    // Add CSS animation to document head
    const style = document.createElement('style');
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

    // Cleanup function to remove style when component unmounts
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
        // Start animation slightly after banner shows
        setTimeout(() => setAnimateIn(true), 50);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
        
        // Only hide banner if user has accepted at least analytics and marketing
        // This ensures popup keeps showing if they rejected important cookies
        if (savedPreferences.analytics && savedPreferences.marketing) {
          setShowBanner(false);
          // Initialize tracking based on saved preferences
          initializeTracking(savedPreferences);
        } else {
          // Show banner again if they previously rejected important cookies
          const timer = setTimeout(() => {
            setShowBanner(true);
            setTimeout(() => setAnimateIn(true), 50);
          }, 1000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
        // Show banner if there's an error parsing preferences
        const timer = setTimeout(() => {
          setShowBanner(true);
          setTimeout(() => setAnimateIn(true), 50);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const initializeTracking = (prefs) => {
    // Initialize Google Analytics if analytics cookies are accepted
    if (prefs.analytics) {
      // Add Google Analytics initialization here
      console.log('Analytics tracking enabled');
    }

    // Initialize marketing pixels if marketing cookies are accepted
    if (prefs.marketing) {
      // Add Facebook Pixel, Google Ads, etc. here
      console.log('Marketing tracking enabled');
    }

    // Initialize functional cookies if accepted
    if (prefs.functional) {
      // Add chat widgets, preference storage, etc.
      console.log('Functional cookies enabled');
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-timestamp', new Date().toISOString());
    initializeTracking(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
    setAnimateIn(false);
  };

  const handleAcceptSelected = () => {
    // Save preferences regardless of selection
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-timestamp', new Date().toISOString());
    
    // Initialize tracking for whatever they accepted
    initializeTracking(preferences);
    
    // Always hide banner and close settings modal when user saves preferences
    setShowBanner(false);
    setShowSettings(false);
    setAnimateIn(false);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(essentialOnly);
    localStorage.setItem('cookie-consent', JSON.stringify(essentialOnly));
    // Don't hide the banner - it will keep showing
    setShowSettings(false);
    // Show message that popup will continue to appear
    alert('The cookie notice will continue to appear until you accept our analytics and marketing cookies, which help us provide you with the best service.');
  };

  const handlePreferenceChange = (category) => {
    if (category === 'essential') return; // Essential cookies can't be disabled
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

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
                We use cookies to enhance your browsing experience, serve personalised content, and analyse our traffic. By clicking 'Accept all', you consent to our use of cookies. 
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
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Notice */}
              <div className="bg-gold/10 p-4 rounded-lg border border-gold/20 mb-6">
                <h4 className="text-gold font-medium mb-2">💡 Recommended Settings</h4>
                <p className="text-sm text-zinc-300">
                  For the best experience, we recommend keeping all cookies enabled. This allows us to:
                </p>
                <ul className="text-sm text-zinc-300 mt-2 ml-4 space-y-1">
                  <li>• Provide personalized content and offers</li>
                  <li>• Improve our services based on your usage</li>
                  <li>• Remember your preferences</li>
                </ul>
              </div>

              {/* Cookie Categories */}
              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="border border-zinc-700/50 rounded-lg p-4">
                  <div className="flex items-start sm:items-center justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white">Essential Cookies</h3>
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
                      <h3 className="text-lg font-medium text-white flex flex-wrap items-center gap-2">
                        <span>Analytics Cookies</span>
                        <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full whitespace-nowrap">Recommended</span>
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handlePreferenceChange('analytics')}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          preferences.analytics ? 'bg-gold' : 'bg-zinc-600'
                        }`}
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
                      <h3 className="text-lg font-medium text-white flex flex-wrap items-center gap-2">
                        <span>Marketing Cookies</span>
                        <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full whitespace-nowrap">Recommended</span>
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handlePreferenceChange('marketing')}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          preferences.marketing ? 'bg-gold' : 'bg-zinc-600'
                        }`}
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
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.functional ? 'translate-x-6' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Enable enhanced functionality like chat widgets, language preferences, and personalized content.
                  </p>
                </div>
              </div>

              {/* Warning for disabled cookies */}
              {(!preferences.analytics || !preferences.marketing) && (
                <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20 mt-6">
                  <h4 className="text-yellow-400 font-medium mb-2">⚠️ Limited Experience</h4>
                  <p className="text-sm text-yellow-200">
                    Disabling analytics or marketing cookies will limit our ability to provide you with 
                    personalized content and special offers. The cookie notice will continue to appear 
                    until these are enabled.
                  </p>
                </div>
              )}

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