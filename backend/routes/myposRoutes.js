const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const createPrivateKey = (pemKey) => {
  try {
    console.log('Raw private key received:', pemKey);
    // Clean the key - remove any extra spaces or line breaks
    const cleanKey = pemKey
      .replace(/\\n/g, '\n')
      .replace(/[\r\n]+/g, '\n')
      .trim();
    
    console.log('Cleaned private key:', cleanKey);

    // Create a KeyObject from the PEM key
    return crypto.createPrivateKey({
      key: cleanKey,
      format: 'pem',
      type: 'pkcs1'
    });
  } catch (error) {
    console.error('Error creating private key:', error);
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

    // Get private key from environment and log it
    const pemKey = process.env.MY_POS_PRIVATE_KEY;
    if (!pemKey) {
      console.error('MY_POS_PRIVATE_KEY is not set');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Private key is not configured'
      });
    }

    console.log('Environment MY_POS_PRIVATE_KEY value:', pemKey);
    
    // Create KeyObject from PEM
    const privateKey = createPrivateKey(pemKey);
    if (!privateKey) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Failed to create private key object'
      });
    }

    // Create data string to sign
    const data = `${sid}${amount}${currency}${orderID}${url_ok}${url_cancel}${keyindex}${cn}`;
    console.log('Data to sign:', data);

    try {
      // Create signature using KeyObject
      const signer = crypto.createSign('RSA-SHA256');
      signer.update(data);
      signer.end();
      const signature = signer.sign(privateKey, 'base64');

      if (!signature) {
        throw new Error('Signature generation returned empty result');
      }

      console.log('Signature generated successfully, length:', signature.length);
      console.log('=== myPOS Sign Request End ===');
      
      return res.json({ sign: signature });
    } catch (signError) {
      console.error('Error during signature generation:', signError);
      throw signError;
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
