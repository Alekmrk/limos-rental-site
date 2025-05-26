import https from 'https';
const urls = [
  'https://www.elitewaylimo.ch',
  'https://www.elitewaylimo.ch/services',
  'https://www.elitewaylimo.ch/vehicles',
  'https://api.elitewaylimo.ch/health'
];

const numConcurrent = 50; // Number of concurrent requests per URL
const totalTests = 3; // Number of test rounds

async function makeRequest(url) {
  const startTime = Date.now();
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          url,
          statusCode: res.statusCode,
          time: Date.now() - startTime,
          headers: res.headers
        });
      });
    }).on('error', (err) => {
      resolve({
        url,
        error: err.message,
        time: Date.now() - startTime
      });
    });
  });
}

async function runLoadTest() {
  console.log(`Starting load test with ${numConcurrent} concurrent requests per URL`);
  console.log('Testing URLs:', urls.join('\n'));
  
  for (let test = 1; test <= totalTests; test++) {
    console.log(`\nTest Round ${test}:`);
    
    for (const url of urls) {
      console.log(`\nTesting ${url}`);
      const requests = Array(numConcurrent).fill().map(() => makeRequest(url));
      
      const results = await Promise.all(requests);
      
      const times = results.map(r => r.time);
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);
      
      const errors = results.filter(r => r.error).length;
      const successRate = ((numConcurrent - errors) / numConcurrent) * 100;
      const statusCodes = results.reduce((acc, r) => {
        if (r.statusCode) {
          acc[r.statusCode] = (acc[r.statusCode] || 0) + 1;
        }
        return acc;
      }, {});
      
      console.log(`Results:
        Average response time: ${avgTime.toFixed(2)}ms
        Fastest response: ${minTime}ms
        Slowest response: ${maxTime}ms
        Success rate: ${successRate}%
        Errors: ${errors}
        Status codes: ${JSON.stringify(statusCodes)}
      `);
    }
    
    // Wait 2 seconds between test rounds
    if (test < totalTests) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

runLoadTest().catch(console.error);