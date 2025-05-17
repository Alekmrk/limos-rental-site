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

// Helper function to format private key
const formatPrivateKey = (key) => {
  if (!key) {
    console.error('Private key is empty or undefined');
    return null;
  }
  try {
    // Remove existing line breaks and spaces
    const cleanKey = key.replace(/[\r\n\s]/g, '');
    // Add proper line breaks
    const header = '-----BEGIN RSA PRIVATE KEY-----\n';
    const footer = '\n-----END RSA PRIVATE KEY-----';
    const body = cleanKey
      .replace(/-----BEGIN RSA PRIVATE KEY-----|-----END RSA PRIVATE KEY-----/g, '')
      .match(/.{1,64}/g)
      .join('\n');
    const formattedKey = header + body + footer;
    console.log('Private key formatting successful:', formattedKey);
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
  } else {
    console.error('Invalid origin:', origin);
  }

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }

  console.log('Request body:', req.body);
  const { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn } = req.body;

  // Validate required fields
  if (!sid || !amount || !currency || !orderID || !url_ok || !url_cancel || !keyindex || !cn) {
    console.error('Missing required fields:', { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get and validate private key
    const rawKey = process.env.MY_POS_PRIVATE_KEY;
    if (!rawKey) {
      console.error('MY_POS_PRIVATE_KEY environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error: missing private key' });
    }

    console.log('Raw private key length:', rawKey.length);
    const privateKey = formatPrivateKey(rawKey);
    if (!privateKey) {
      console.error('Failed to format private key');
      return res.status(500).json({ error: 'Server configuration error: invalid private key format' });
    }

    // Create data string to sign
    const data = `${sid}${amount}${currency}${orderID}${url_ok}${url_cancel}${keyindex}${cn}`;
    console.log('Data to sign:', data);

    // Generate signature
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(data);
    signer.end();
    
    const signature = signer.sign(privateKey, 'base64');
    console.log('Signature generated successfully, length:', signature.length);
    
    return res.json({ sign: signature });
  } catch (err) {
    console.error('Error generating signature:', err);
    console.error('Stack trace:', err.stack);
    return res.status(500).json({ 
      error: 'Failed to generate signature',
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
