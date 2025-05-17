const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Helper function to format private key with proper PEM format
const formatPrivateKey = (key) => {
  if (!key) {
    console.error('Private key is empty or undefined');
    return null;
  }

  try {
    // Remove all spaces and newlines
    let cleanKey = key.replace(/\s+/g, '');
    
    // Check if the key has PEM headers
    if (!cleanKey.includes('-----BEGIN') && !cleanKey.includes('-----END')) {
      console.error('Private key is missing PEM headers');
      return null;
    }

    // Extract the base64 part between the headers
    const base64Match = cleanKey.match(/-----BEGIN RSA PRIVATE KEY-----(.*?)-----END RSA PRIVATE KEY-----/);
    if (!base64Match || !base64Match[1]) {
      console.error('Could not extract base64 part of the key');
      return null;
    }

    const base64Content = base64Match[1];
    
    // Format with proper line breaks (64 characters per line)
    const lines = base64Content.match(/.{1,64}/g) || [];
    
    // Reconstruct PEM format
    const formattedKey = [
      '-----BEGIN RSA PRIVATE KEY-----',
      ...lines,
      '-----END RSA PRIVATE KEY-----'
    ].join('\n');

    console.log('Key formatting successful:', formattedKey);
    console.log('First line after header:', lines[0]); // Debug first line
    return formattedKey;
  } catch (error) {
    console.error('Error formatting private key:', error);
    return null;
  }
};

// POST /api/mypos-sign
router.post('/mypos-sign', (req, res) => {
  console.log('Received myPOS sign request');
  
  // Handle CORS
  const allowedOrigins = ['https://elitewaylimo.ch', 'https://www.elitewaylimo.ch'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  }

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn } = req.body;

  // Validate required fields
  if (!sid || !amount || !currency || !orderID || !url_ok || !url_cancel || !keyindex || !cn) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get and format private key
    const rawKey = process.env.MY_POS_PRIVATE_KEY;
    if (!rawKey) {
      console.error('MY_POS_PRIVATE_KEY is not set in environment');
      return res.status(500).json({ error: 'Server configuration error: missing private key' });
    }

    // Log raw key length for debugging
    console.log('Raw key:', rawKey);

    const privateKey = formatPrivateKey(rawKey);
    if (!privateKey) {
      console.error('Failed to format private key');
      return res.status(500).json({ error: 'Server configuration error: invalid private key format' });
    }

    // Create data string to sign
    const data = `${sid}${amount}${currency}${orderID}${url_ok}${url_cancel}${keyindex}${cn}`;
    console.log('Data to sign:', data);

    try {
      // Try alternative key format if default fails
      const keyOptions = [
        privateKey,
        { key: privateKey, format: 'pem' },
        { key: privateKey, format: 'pem', type: 'pkcs1' }
      ];

      let signature = null;
      let error = null;

      for (const keyOption of keyOptions) {
        try {
          const signer = crypto.createSign('RSA-SHA256');
          signer.update(data);
          signature = signer.sign(keyOption, 'base64');
          console.log('Signature generated successfully with format:', typeof keyOption === 'string' ? 'string' : keyOption.format);
          break;
        } catch (e) {
          error = e;
          console.log('Attempt failed:', e.message);
          continue;
        }
      }

      if (signature) {
        return res.json({ sign: signature });
      } else {
        throw error || new Error('All signature attempts failed');
      }
    } catch (signError) {
      console.error('Final error during signature generation:', signError);
      return res.status(500).json({ 
        error: 'Failed to generate signature',
        details: signError.message
      });
    }
  } catch (err) {
    console.error('General error:', err);
    return res.status(500).json({ 
      error: 'Server error',
      details: err.message
    });
  }
});

module.exports = router;
