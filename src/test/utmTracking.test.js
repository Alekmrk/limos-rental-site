/**
 * UTM Tracking Test Suite
 * Tests the complete UTM tracking system
 */

import { 
  initializeUTMTracking, 
  extractUTMFromURL, 
  storeUTMData, 
  retrieveUTMData, 
  restoreUTMData,
  buildUTMQueryString,
  debugUTMState
} from '../utils/utmTracking';

/**
 * Test UTM extraction from various URLs
 */
export const testUTMExtraction = () => {
  console.group('🧪 Testing UTM Extraction');
  
  const testCases = [
    {
      name: 'Google Ads URL',
      url: 'https://elitewaylimo.ch/?utm_source=google&utm_medium=cpc&utm_campaign=limo_rental&utm_term=luxury+limo&utm_content=ad1',
      expected: {
        source: 'google',
        medium: 'cpc',
        campaign: 'limo_rental',
        term: 'luxury+limo',
        content: 'ad1'
      }
    },
    {
      name: 'Facebook URL',
      url: 'https://elitewaylimo.ch/?utm_source=facebook&utm_medium=social&utm_campaign=summer_promo',
      expected: {
        source: 'facebook',
        medium: 'social',
        campaign: 'summer_promo'
      }
    },
    {
      name: 'Email URL',
      url: 'https://elitewaylimo.ch/?utm_source=newsletter&utm_medium=email&utm_campaign=monthly_deals&utm_content=footer_link',
      expected: {
        source: 'newsletter',
        medium: 'email',
        campaign: 'monthly_deals',
        content: 'footer_link'
      }
    },
    {
      name: 'URL without UTMs',
      url: 'https://elitewaylimo.ch/',
      expected: null
    }
  ];

  testCases.forEach(testCase => {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`URL: ${testCase.url}`);
    
    const result = extractUTMFromURL(testCase.url);
    
    if (testCase.expected === null) {
      if (!result || !result.hasUTMs) {
        console.log('✅ PASS: No UTMs detected as expected');
      } else {
        console.log('❌ FAIL: Expected no UTMs but got:', result);
      }
    } else {
      if (result && result.hasUTMs) {
        let passed = true;
        Object.keys(testCase.expected).forEach(key => {
          if (result[key] !== testCase.expected[key]) {
            console.log(`❌ FAIL: Expected ${key}='${testCase.expected[key]}' but got '${result[key]}'`);
            passed = false;
          }
        });
        if (passed) {
          console.log('✅ PASS: All UTM parameters extracted correctly');
        }
      } else {
        console.log('❌ FAIL: Expected UTMs but none found');
      }
    }
  });
  
  console.groupEnd();
};

/**
 * Test UTM storage and retrieval
 */
export const testUTMStorage = () => {
  console.group('🧪 Testing UTM Storage & Retrieval');
  
  const testUTMData = {
    source: 'test_source',
    medium: 'test_medium',
    campaign: 'test_campaign',
    term: 'test_term',
    content: 'test_content',
    hasUTMs: true,
    timestamp: new Date().toISOString()
  };

  console.log('📝 Storing test UTM data:', testUTMData);
  storeUTMData(testUTMData);

  console.log('📥 Retrieving UTM data...');
  const retrieved = retrieveUTMData();

  if (retrieved && retrieved.hasUTMs) {
    let passed = true;
    ['source', 'medium', 'campaign', 'term', 'content'].forEach(key => {
      if (retrieved[key] !== testUTMData[key]) {
        console.log(`❌ FAIL: Expected ${key}='${testUTMData[key]}' but got '${retrieved[key]}'`);
        passed = false;
      }
    });
    if (passed) {
      console.log('✅ PASS: UTM data stored and retrieved correctly');
    }
  } else {
    console.log('❌ FAIL: Could not retrieve stored UTM data');
  }

  console.groupEnd();
};

/**
 * Test UTM query string building
 */
export const testUTMQueryString = () => {
  console.group('🧪 Testing UTM Query String Building');
  
  const testUTMData = {
    source: 'google',
    medium: 'cpc',
    campaign: 'test_campaign',
    term: 'luxury limo',
    content: 'ad1',
    hasUTMs: true
  };

  const queryString = buildUTMQueryString(testUTMData);
  console.log('🔗 Generated query string:', queryString);

  const expectedParams = [
    'utm_source=google',
    'utm_medium=cpc',
    'utm_campaign=test_campaign',
    'utm_term=luxury%20limo',
    'utm_content=ad1'
  ];

  let passed = true;
  expectedParams.forEach(param => {
    if (!queryString.includes(param)) {
      console.log(`❌ FAIL: Expected parameter '${param}' not found in query string`);
      passed = false;
    }
  });

  if (passed) {
    console.log('✅ PASS: Query string built correctly');
  }

  console.groupEnd();
};

/**
 * Test complete UTM workflow
 */
export const testCompleteWorkflow = () => {
  console.group('🧪 Testing Complete UTM Workflow');
  
  // Clear any existing data
  localStorage.removeItem('eliteway_utm_data');
  sessionStorage.removeItem('eliteway_utm_data');
  
  // Simulate landing on page with UTMs
  const testURL = 'https://elitewaylimo.ch/?utm_source=google&utm_medium=cpc&utm_campaign=winter_special&utm_term=airport+transfer&utm_content=headline1';
  
  console.log('🌐 Simulating page load with UTMs:', testURL);
  
  // Extract and store UTMs
  const utmData = extractUTMFromURL(testURL);
  if (utmData && utmData.hasUTMs) {
    storeUTMData(utmData);
    console.log('✅ UTMs extracted and stored');
  } else {
    console.log('❌ Failed to extract UTMs');
    console.groupEnd();
    return;
  }

  // Simulate navigation (UTMs should persist)
  console.log('🧭 Simulating navigation to another page...');
  const retrievedAfterNav = retrieveUTMData();
  if (retrievedAfterNav && retrievedAfterNav.hasUTMs) {
    console.log('✅ UTMs persisted during navigation');
  } else {
    console.log('❌ UTMs lost during navigation');
  }

  // Simulate payment flow (Stripe redirect)
  console.log('💳 Simulating Stripe payment redirect...');
  
  // Build redirect URL with UTMs
  const stripeReturnURL = `https://elitewaylimo.ch/payment-success?session_id=cs_test_123&${buildUTMQueryString(utmData)}`;
  console.log('🔗 Stripe return URL:', stripeReturnURL);

  // Simulate returning from Stripe
  console.log('🔄 Simulating return from Stripe...');
  const restoredUTMs = restoreUTMData();
  if (restoredUTMs && restoredUTMs.hasUTMs) {
    console.log('✅ UTMs successfully restored after payment redirect');
    
    // Verify all parameters match
    let allMatch = true;
    ['source', 'medium', 'campaign', 'term', 'content'].forEach(key => {
      if (restoredUTMs[key] !== utmData[key]) {
        console.log(`❌ UTM ${key} mismatch: expected '${utmData[key]}', got '${restoredUTMs[key]}'`);
        allMatch = false;
      }
    });
    
    if (allMatch) {
      console.log('✅ COMPLETE WORKFLOW PASSED: All UTM parameters preserved through payment flow');
    } else {
      console.log('❌ WORKFLOW FAILED: UTM parameters corrupted');
    }
  } else {
    console.log('❌ WORKFLOW FAILED: Could not restore UTMs after payment redirect');
  }

  console.groupEnd();
};

/**
 * Run all UTM tests
 */
export const runAllUTMTests = () => {
  console.log('🚀 Starting UTM Tracking System Tests...\n');
  
  testUTMExtraction();
  testUTMStorage();
  testUTMQueryString();
  testCompleteWorkflow();
  
  console.log('\n🏁 UTM Testing Complete!');
  console.log('💡 Check the debug state with debugUTMState() if needed');
};

// Make tests available globally for manual testing
if (typeof window !== 'undefined') {
  window.utmTests = {
    runAll: runAllUTMTests,
    extraction: testUTMExtraction,
    storage: testUTMStorage,
    queryString: testUTMQueryString,
    workflow: testCompleteWorkflow,
    debug: debugUTMState
  };
  
  console.log('🧪 UTM tests available at window.utmTests');
  console.log('Run window.utmTests.runAll() to test everything');
}
