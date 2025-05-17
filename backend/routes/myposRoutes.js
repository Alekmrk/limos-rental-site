const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const formatPrivateKey = (key) => {
  try {
    console.log('Original key value:', key);
    console.log('Key length:', key.length);

    // Basic cleanup - remove any windows-style line endings and extra spaces
    let cleanKey = key.replace(/\r/g, '');
    
    // If the key doesn't have proper line breaks, add them
    if (!cleanKey.includes('\n')) {
      cleanKey = cleanKey
        .replace('-----BEGIN RSA PRIVATE KEY-----', '-----BEGIN RSA PRIVATE KEY-----\n')
        .replace('-----END RSA PRIVATE KEY-----', '\n-----END RSA PRIVATE KEY-----');
    }

    console.log('Formatted key:', cleanKey);
    console.log('Formatted key length:', cleanKey.length);
    
    return cleanKey;
  } catch (error) {
    console.error('Error in formatPrivateKey:', error);
    return null;
  }
};

router.post('/mypos-sign', async (req, res) => {
  try {
    console.log('=== myPOS Sign Request Start ===');
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    
    // Handle CORS
    const allowedOrigins = ['https://elitewaylimo.ch', 'https://www.elitewaylimo.ch'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Credentials', 'true');
    }

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn } = req.body;

    // Validate required fields
    if (!sid || !amount || !currency || !orderID || !url_ok || !url_cancel || !keyindex || !cn) {
      console.error('Missing required fields:', { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn });
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'One or more required fields are missing'
      });
    }

    // Get and format private key
    const rawKey = process.env.MY_POS_PRIVATE_KEY;
    if (!rawKey) {
      console.error('MY_POS_PRIVATE_KEY is not set');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Private key is not configured'
      });
    }

    const privateKey = formatPrivateKey(rawKey);
    if (!privateKey) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Failed to format private key'
      });
    }

    // Create data string to sign
    const data = `${sid}${amount}${currency}${orderID}${url_ok}${url_cancel}${keyindex}${cn}`;
    console.log('Data to sign:', data);

    try {
      // Try signing with the formatted key directly
      const signer = crypto.createSign('RSA-SHA256');
      signer.update(data);
      signer.end();

      console.log('Attempting to sign with key...');
      const signature = signer.sign(privateKey, 'base64');

      if (!signature) {
        throw new Error('Signature generation returned empty result');
      }

      console.log('Signature generated successfully, length:', signature.length);
      console.log('=== myPOS Sign Request End ===');
      
      return res.json({ sign: signature });
    } catch (signError) {
      console.error('Error during signature generation:', signError);
      return res.status(500).json({ 
        error: 'Signature generation failed',
        details: signError.message,
        keyFormat: 'Key type: ' + typeof privateKey,
        keyStartsWith: privateKey.substring(0, 50)
      });
    }
  } catch (err) {
    console.error('=== myPOS Sign Request Error ===');
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    return res.status(500).json({ 
      error: 'Failed to generate signature',
      details: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
