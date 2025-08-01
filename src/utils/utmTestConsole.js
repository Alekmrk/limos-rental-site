/**
 * UTM Tracking Test Console
 * Open this in browser console to test UTM parameter preservation
 */

console.log('🎯 UTM Tracking Test Console Loaded');

const utmTest = {
  // Test URLs with UTM parameters
  testUrls: {
    google: 'https://elitewaylimo.com/?utm_source=google&utm_medium=cpc&utm_campaign=luxury_promo&utm_term=luxury+limo&utm_content=homepage',
    facebook: 'https://elitewaylimo.com/?utm_source=facebook&utm_medium=social&utm_campaign=wedding_special',
    email: 'https://elitewaylimo.com/?utm_source=newsletter&utm_medium=email&utm_campaign=monthly_promo'
  },

  // Simulate different scenarios
  simulateGoogleAd() {
    console.log('🔗 Simulating Google Ad click...');
    // Change URL to simulate Google ad click
    window.history.pushState({}, '', '/?utm_source=google&utm_medium=cpc&utm_campaign=luxury_promo&utm_term=luxury+limo&utm_content=homepage');
    
    // Capture parameters
    if (window.captureUTMParameters) {
      const captured = window.captureUTMParameters();
      console.log('✅ Captured:', captured);
    } else {
      console.log('❌ captureUTMParameters not available - add to window for testing');
    }
  },

  simulateStripeRedirect() {
    console.log('💳 Simulating Stripe payment redirect...');
    // Simulate what happens after Stripe redirect
    window.history.pushState({}, '', '/payment-success?session_id=cs_test_123&utm_source=google&utm_medium=cpc&utm_campaign=luxury_promo');
    
    if (window.extractAndStoreUTMFromURL) {
      const extracted = window.extractAndStoreUTMFromURL();
      console.log('✅ Extracted from redirect:', extracted);
    } else {
      console.log('❌ extractAndStoreUTMFromURL not available');
    }
  },

  checkCurrentState() {
    console.log('📊 Current UTM State:');
    
    const session = sessionStorage.getItem('eliteway_utm_data');
    const backup = localStorage.getItem('eliteway_utm_backup');
    
    console.log('SessionStorage:', session ? JSON.parse(session) : null);
    console.log('LocalStorage Backup:', backup ? JSON.parse(backup) : null);
    console.log('Current URL:', window.location.href);
    
    if (window.debugUTMState) {
      window.debugUTMState();
    }
  },

  clearAll() {
    console.log('🧹 Clearing all UTM data...');
    sessionStorage.removeItem('eliteway_utm_data');
    localStorage.removeItem('eliteway_utm_backup');
    console.log('✅ Cleared');
  },

  testComplete() {
    console.log('🎯 Testing complete UTM flow...');
    this.clearAll();
    this.simulateGoogleAd();
    setTimeout(() => {
      this.simulateStripeRedirect();
      setTimeout(() => {
        this.checkCurrentState();
      }, 100);
    }, 100);
  }
};

// Make available globally for testing
window.utmTest = utmTest;

// Instructions
console.log(`
🎯 UTM Test Commands:
- utmTest.simulateGoogleAd() - Simulate Google ad click
- utmTest.simulateStripeRedirect() - Simulate return from Stripe
- utmTest.checkCurrentState() - Check current UTM data
- utmTest.clearAll() - Clear all UTM data
- utmTest.testComplete() - Run full test

📝 Manual Testing:
1. Visit: ${utmTest.testUrls.google}
2. Check that UTMs are captured
3. Go through booking flow
4. Verify UTMs are preserved after Stripe redirect
`);

// Export for module compatibility but primary usage is via window.utmTest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = utmTest;
}

// Also support ES6 exports
export default utmTest;
