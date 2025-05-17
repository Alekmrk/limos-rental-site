const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.use((req, res, next) => {
  console.log('myPOS Route Headers:', {
    origin: req.headers.origin,
    method: req.method,
    contentType: req.headers['content-type']
  });
  next();
});

// Helper function to format private key with proper PEM format
const formatPrivateKey = (key) => {
  if (!key) {
    console.error('Private key is empty or undefined');
    return null;
  }

  try {
    // Remove all whitespace and newlines
    let cleanKey = key.replace(/[\s\r\n]+/g, '');
    
    // Remove existing headers if present
    cleanKey = cleanKey.replace(/-----BEGIN RSA PRIVATE KEY-----|-----END RSA PRIVATE KEY-----/g, '');
    
    // Split into 64-character chunks
    const chunks = cleanKey.match(/.{1,64}/g) || [];
    
    // Reconstruct PEM format with proper line breaks
    return [
      '-----BEGIN RSA PRIVATE KEY-----',
      ...chunks,
      '-----END RSA PRIVATE KEY-----'
    ].join('\n');
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
      return res.status(500).json({ error: 'Server configuration error: missing private key' });
    }

    const privateKey = formatPrivateKey(rawKey);
    if (!privateKey) {
      return res.status(500).json({ error: 'Server configuration error: invalid private key format' });
    }

    // Log key format for debugging (only first and last few characters)
    console.log('Formatted key starts with:', privateKey.substring(0, 40) + '...');
    console.log('Formatted key ends with:', '...' + privateKey.substring(privateKey.length - 40));

    // Create signature
    const data = `${sid}${amount}${currency}${orderID}${url_ok}${url_cancel}${keyindex}${cn}`;
    console.log('Data to sign:', data);

    try {
      const signer = crypto.createSign('RSA-SHA256');
      signer.update(data);
      signer.end();
      const signature = signer.sign(privateKey, 'base64');
      
      console.log('Signature generated successfully, length:', signature.length);
      return res.json({ sign: signature });
    } catch (signError) {
      console.error('Error during signature generation:', signError);
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
