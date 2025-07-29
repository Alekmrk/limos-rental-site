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
  // Get current cookie consent state
  getState() {
    const state = {
      localStorage: {
        consent: localStorage.getItem('cookie-consent'),
        timestamp: localStorage.getItem('cookie-consent-timestamp'),
        lastHidden: localStorage.getItem('cookie-consent-last-hidden'),
        tempMarker: localStorage.getItem('cookie-consent-temp-marker')
      },
      sessionStorage: {
        justSet: sessionStorage.getItem('cookie-consent-just-set'),
        suppressed: sessionStorage.getItem('cookie-consent-suppressed')
      },
      computed: {
        hasConsent: !!localStorage.getItem('cookie-consent'),
        isRecentlySet: false,
        isExpired: false,
        timeSinceSet: null,
        timeSinceHidden: null
      }
    };

    // Calculate computed values
    const timestamp = localStorage.getItem('cookie-consent-timestamp');
    if (timestamp) {
      const now = new Date().getTime();
      const setTime = new Date(timestamp).getTime();
      state.computed.timeSinceSet = Math.round((now - setTime) / 60000); // minutes
      state.computed.isRecentlySet = (now - setTime) < (5 * 60 * 1000); // 5 minutes
      
      const monthsOld = (now - setTime) / (1000 * 60 * 60 * 24 * 30);
      state.computed.isExpired = monthsOld > 12;
    }

    const lastHidden = localStorage.getItem('cookie-consent-last-hidden');
    if (lastHidden) {
      const now = new Date().getTime();
      const hiddenTime = new Date(lastHidden).getTime();
      state.computed.timeSinceHidden = Math.round((now - hiddenTime) / 60000); // minutes
    }

    console.table(state.localStorage);
    console.table(state.sessionStorage);
    console.table(state.computed);
    return state;
  },

  // Reset all cookie consent data
  reset() {
    // Clear localStorage
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('cookie-consent-timestamp');
    localStorage.removeItem('cookie-consent-last-hidden');
    localStorage.removeItem('cookie-consent-temp-marker');
    
    // Clear sessionStorage
    sessionStorage.removeItem('cookie-consent-just-set');
    sessionStorage.removeItem('cookie-consent-suppressed');
    
    console.log('✅ All cookie consent data cleared');
    
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

  // Set cookie consent as if user just accepted
  simulateAcceptance() {
    const preferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-timestamp', new Date().toISOString());
    sessionStorage.setItem('cookie-consent-just-set', 'true');
    
    // Set temp marker for payment flows
    const tempMarker = {
      timestamp: new Date().toISOString(),
      preferences: preferences
    };
    localStorage.setItem('cookie-consent-temp-marker', JSON.stringify(tempMarker));
    
    console.log('✅ Simulated cookie acceptance');
    
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

    // Test consent expiration
    expiredConsent() {
      console.log('🧪 Testing expired consent...');
      
      // Set old timestamp (over 12 months ago)
      const oldDate = new Date();
      oldDate.setMonth(oldDate.getMonth() - 13);
      
      localStorage.setItem('cookie-consent', JSON.stringify({
        essential: true,
        analytics: true,
        marketing: false,
        functional: false
      }));
      localStorage.setItem('cookie-consent-timestamp', oldDate.toISOString());
      
      console.log('✅ Set expired consent (13 months old)');
      CookieConsentDebug.getState();
      
      if (confirm('Reload page to test expired consent?')) {
        window.location.reload();
      }
    },

    // Test cross-tab synchronization
    crossTab() {
      console.log('🧪 Testing cross-tab synchronization...');
      console.log('1. Accept cookies in this tab');
      CookieConsentDebug.simulateAcceptance();
      
      console.log('2. Open new tab to test synchronization:');
      console.log('   window.open(window.location.href)');
      window.open(window.location.href);
    }
  },

  // Monitor cookie consent events
  monitorEvents() {
    const originalLog = console.log;
    
    // Listen for cookie consent updates
    window.addEventListener('cookieConsentUpdated', (e) => {
      console.log('🍪 Cookie consent updated:', e.detail);
    });

    // Listen for storage changes
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.includes('cookie-consent')) {
        console.log('💾 Storage change detected:', {
          key: e.key,
          oldValue: e.oldValue,
          newValue: e.newValue
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

console.log('🛠️ Cookie Consent Debug utility loaded. Use CookieConsentDebug.getState() to start.');
