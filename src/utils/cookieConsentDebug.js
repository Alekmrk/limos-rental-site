/**
 * Cookie Consent Debug Utility
 * 
 * Use this in browser console to debug cookie consent issues:
 * 
 * // Check current state
 * CookieConsentDebug.getState();
 * 
 * // Simulate payment flow
 * CookieConsentDebug.simulatePaymentFlow();
 * 
 * // Reset all data
 * CookieConsentDebug.reset();
 * 
 * // Test scenarios
 * CookieConsentDebug.testScenarios.paymentRedirect();
 */

window.CookieConsentDebug = {
  // Get current cookie consent state (updated for v2.0)
  getState() {
    const state = {
      localStorage: {
        consentData: localStorage.getItem('cookie-consent-data'),
        tempProtection: localStorage.getItem('cookie-consent-temp-protection'),
        lastHidden: localStorage.getItem('cookie-consent-last-hidden'),
        // Legacy keys (should not exist in v2.0)
        legacyConsent: localStorage.getItem('cookie-consent'),
        legacyTimestamp: localStorage.getItem('cookie-consent-timestamp'),
        legacyTempMarker: localStorage.getItem('cookie-consent-temp-marker')
      },
      sessionStorage: {
        justSet: sessionStorage.getItem('cookie-consent-just-set'),
        suppressed: sessionStorage.getItem('cookie-consent-suppressed')
      },
      parsed: {},
      computed: {
        hasConsent: false,
        hasTempProtection: false,
        tempProtectionExpired: false,
        isRecentlySet: false,
        isExpired: false,
        timeSinceSet: null,
        timeSinceHidden: null,
        version: null
      }
    };

    // Parse consent data
    if (state.localStorage.consentData) {
      try {
        state.parsed = JSON.parse(state.localStorage.consentData);
        state.computed.hasConsent = !!state.parsed.preferences;
        state.computed.version = state.parsed.version || '1.0';
        
        if (state.parsed.timestamp) {
          const now = new Date().getTime();
          const setTime = new Date(state.parsed.timestamp).getTime();
          state.computed.timeSinceSet = Math.round((now - setTime) / 60000); // minutes
          state.computed.isRecentlySet = (now - setTime) < (5 * 60 * 1000); // 5 minutes
          
          const monthsOld = (now - setTime) / (1000 * 60 * 60 * 24 * 30);
          state.computed.isExpired = monthsOld > 12;
        }
      } catch (e) {
        console.error('Failed to parse consent data:', e);
      }
    }

    // Parse temp protection
    if (state.localStorage.tempProtection) {
      try {
        const protection = JSON.parse(state.localStorage.tempProtection);
        const notExpired = new Date(protection.expires) > new Date();
        state.computed.hasTempProtection = notExpired;
        state.computed.tempProtectionExpired = !notExpired;
        state.parsed.tempProtection = protection;
      } catch (e) {
        console.error('Failed to parse temp protection:', e);
      }
    }

    // Parse last hidden
    const lastHidden = localStorage.getItem('cookie-consent-last-hidden');
    if (lastHidden) {
      const now = new Date().getTime();
      const hiddenTime = new Date(lastHidden).getTime();
      state.computed.timeSinceHidden = Math.round((now - hiddenTime) / 60000); // minutes
    }

    console.log('🍪 Cookie Consent State (v2.0):');
    console.table(state.localStorage);
    console.table(state.sessionStorage);
    console.table(state.parsed);
    console.table(state.computed);
    
    // Warn about legacy keys
    if (state.localStorage.legacyConsent || state.localStorage.legacyTimestamp || state.localStorage.legacyTempMarker) {
      console.warn('⚠️ Legacy consent keys detected - consider migration');
    }
    
    return state;
  },

  // Reset all cookie consent data (updated for v2.0)
  reset() {
    // Clear v2.0 data
    localStorage.removeItem('cookie-consent-data');
    localStorage.removeItem('cookie-consent-temp-protection');
    localStorage.removeItem('cookie-consent-last-hidden');
    
    // Clear legacy data (if any)
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('cookie-consent-timestamp');
    localStorage.removeItem('cookie-consent-temp-marker');
    
    // Clear sessionStorage
    sessionStorage.removeItem('cookie-consent-just-set');
    sessionStorage.removeItem('cookie-consent-suppressed');
    
    console.log('✅ All cookie consent data cleared (v2.0)');
    
    // Reload page to show banner
    if (confirm('Reload page to test fresh state?')) {
      window.location.reload();
    }
  },

  // Simulate payment flow suppression
  simulatePaymentFlow() {
    sessionStorage.setItem('cookie-consent-suppressed', 'true');
    console.log('🔒 Payment flow suppression activated');
    
    setTimeout(() => {
      sessionStorage.removeItem('cookie-consent-suppressed');
      console.log('🔓 Payment flow suppression cleared');
    }, 5000);
  },

  // Set cookie consent as if user just accepted (updated for v2.0)
  simulateAcceptance() {
    const preferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    
    const timestamp = new Date().toISOString();
    
    const consentData = {
      preferences: preferences,
      timestamp: timestamp,
      version: '2.0',
      source: 'debug_simulation',
      userAgent: navigator.userAgent.substring(0, 100)
    };
    
    // Add temp protection for payment flows
    const tempProtection = {
      timestamp: timestamp,
      expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 minutes
      preferences: preferences,
      reason: 'debug_simulation'
    };
    
    localStorage.setItem('cookie-consent-data', JSON.stringify(consentData));
    localStorage.setItem('cookie-consent-temp-protection', JSON.stringify(tempProtection));
    sessionStorage.setItem('cookie-consent-just-set', 'true');
    
    console.log('✅ Simulated cookie acceptance (v2.0 with temp protection)');
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
      detail: preferences
    }));
  },

  // Simulate banner dismissal
  simulateDismissal() {
    localStorage.setItem('cookie-consent-last-hidden', new Date().toISOString());
    console.log('❌ Simulated banner dismissal');
  },

  // Test various scenarios
  testScenarios: {
    // Test payment redirect scenario
    paymentRedirect() {
      console.log('🧪 Testing payment redirect scenario...');
      
      // Step 1: User accepts cookies
      CookieConsentDebug.simulateAcceptance();
      console.log('1. ✅ User accepted cookies');
      
      // Step 2: User goes to payment (suppression activated)
      setTimeout(() => {
        sessionStorage.setItem('cookie-consent-suppressed', 'true');
        console.log('2. 🔒 Payment flow started (suppression active)');
        
        // Step 3: Simulate Stripe redirect (sessionStorage might clear)
        setTimeout(() => {
          sessionStorage.removeItem('cookie-consent-just-set');
          console.log('3. 🌐 Simulated Stripe redirect (sessionStorage cleared)');
          
          // Step 4: Return from Stripe
          setTimeout(() => {
            sessionStorage.removeItem('cookie-consent-suppressed');
            console.log('4. 🔓 Returned from Stripe (suppression cleared)');
            console.log('5. 🔍 Check if banner shows (should NOT show):');
            CookieConsentDebug.getState();
            
            // The temp marker should prevent banner from showing
            const tempMarker = localStorage.getItem('cookie-consent-temp-marker');
            if (tempMarker) {
              console.log('✅ Temp marker exists - banner should not show');
            } else {
              console.log('❌ Temp marker missing - banner might show');
            }
          }, 1000);
        }, 2000);
      }, 1000);
    },

    // Test expired consent (updated for v2.0)
    expiredConsent() {
      console.log('🧪 Testing expired consent...');
      
      // Set old timestamp (over 12 months ago)
      const oldDate = new Date();
      oldDate.setMonth(oldDate.getMonth() - 13);
      
      const consentData = {
        preferences: {
          essential: true,
          analytics: true,
          marketing: false,
          functional: false
        },
        timestamp: oldDate.toISOString(),
        version: '2.0',
        source: 'debug_expired_test'
      };
      
      localStorage.setItem('cookie-consent-data', JSON.stringify(consentData));
      
      console.log('✅ Set expired consent (13 months old, v2.0)');
      CookieConsentDebug.getState();
      
      if (confirm('Reload page to test expired consent?')) {
        window.location.reload();
      }
    },

    // Test simplified cross-tab synchronization (updated for v2.0)
    crossTab() {
      console.log('🧪 Testing simplified cross-tab synchronization (v2.0)...');
      console.log('1. ✅ Accepting cookies in this tab');
      CookieConsentDebug.simulateAcceptance();
      
      console.log('2. 🌐 Opening new tab to test synchronization...');
      const newTab = window.open(window.location.href);
      
      console.log('3. 🔄 Testing atomic data consistency...');
      setTimeout(() => {
        const consentData = localStorage.getItem('cookie-consent-data');
        
        console.log('📊 Current storage state:', {
          hasConsentData: !!consentData,
          dataSize: consentData ? consentData.length : 0,
          timestamp: consentData ? JSON.parse(consentData).timestamp : 'N/A'
        });
        
        if (consentData) {
          console.log('✅ Atomic data saved - new tab should sync immediately');
          try {
            const parsed = JSON.parse(consentData);
            console.log('📋 Consent data structure:', parsed);
          } catch (e) {
            console.log('❌ Failed to parse consent data');
          }
        } else {
          console.log('❌ No consent data found');
        }
      }, 1000);
    },
    // Test Stripe redirect scenario (updated for v2.0 with temp protection)
    stripeRedirectTest() {
      console.log('🧪 Testing Stripe redirect with temp protection (v2.0)...');
      
      // Step 1: User accepts cookies
      CookieConsentDebug.simulateAcceptance();
      console.log('1. ✅ User accepted cookies (v2.0 with temp protection)');
      
      // Step 2: Simulate Stripe payment flow
      setTimeout(() => {
        console.log('2. 🌐 Simulating Stripe payment...');
        
        // Simulate return from Stripe
        setTimeout(() => {
          // Clear sessionStorage (as Stripe redirect might do)
          sessionStorage.removeItem('cookie-consent-just-set');
          sessionStorage.removeItem('cookie-consent-suppressed');
          console.log('3. 🧹 SessionStorage cleared (Stripe redirect effect)');
          
          // Test if temp protection still works
          setTimeout(() => {
            console.log('4. 🔍 Checking protection after Stripe redirect:');
            CookieConsentDebug.getState();
            
            const consentData = localStorage.getItem('cookie-consent-data');
            const tempProtection = localStorage.getItem('cookie-consent-temp-protection');
            
            if (consentData && tempProtection) {
              try {
                const consent = JSON.parse(consentData);
                const protection = JSON.parse(tempProtection);
                const notExpired = new Date(protection.expires) > new Date();
                
                console.log('Protection status:', {
                  hasConsentData: true,
                  hasTempProtection: true,
                  tempProtectionExpired: !notExpired,
                  hasPreferences: !!consent.preferences,
                  version: consent.version,
                  shouldShowBanner: false
                });
                
                if (notExpired) {
                  console.log('✅ Temp protection working - banner should NOT show');
                } else {
                  console.log('⚠️ Temp protection expired - might need longer duration');
                }
              } catch (e) {
                console.log('❌ Corrupted protection data');
              }
            } else {
              console.log('❌ Protection failed - missing data');
            }
          }, 500);
        }, 2000);
      }, 1000);
    }
  },

  // Monitor cookie consent events
  monitorEvents() {
    const originalLog = console.log;
    
    // Listen for cookie consent updates
    window.addEventListener('cookieConsentUpdated', (e) => {
      console.log('🍪 Cookie consent updated:', e.detail);
    });

    // Listen for storage changes (updated for v2.0)
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.includes('cookie-consent')) {
        console.log('💾 Storage change detected (v2.0):', {
          key: e.key,
          oldValue: e.oldValue ? 'present' : 'null',
          newValue: e.newValue ? 'present' : 'null',
          isMainData: e.key === 'cookie-consent-data'
        });
      }
    });

    console.log('👂 Started monitoring cookie consent events');
  }
};

// Auto-monitor if in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  CookieConsentDebug.monitorEvents();
}

console.log('🛠️ Cookie Consent Debug utility loaded (v2.0). Use CookieConsentDebug.getState() to start.');
