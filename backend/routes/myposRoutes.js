const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.post('/mypos-sign', async (req, res) => {
  try {
    console.log('=== myPOS Sign Request Start ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
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

    // Validate required fields with detailed logging
    if (!sid || !amount || !currency || !orderID || !url_ok || !url_cancel || !keyindex || !cn) {
      const missingFields = [];
      if (!sid) missingFields.push('sid');
      if (!amount) missingFields.push('amount');
      if (!currency) missingFields.push('currency');
      if (!orderID) missingFields.push('orderID');
      if (!url_ok) missingFields.push('url_ok');
      if (!url_cancel) missingFields.push('url_cancel');
      if (!keyindex) missingFields.push('keyindex');
      if (!cn) missingFields.push('cn');
      
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: `Missing fields: ${missingFields.join(', ')}`
      });
    }

    // Get and validate private key
    const privateKey = process.env.MY_POS_PRIVATE_KEY;
    if (!privateKey) {
      console.error('MY_POS_PRIVATE_KEY environment variable is not set');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Private key is not configured'
      });
    }

    // Log private key info (safely)
    console.log('Private key length:', privateKey.length);
    console.log('Private key starts with:', privateKey.substring(0, 27));
    console.log('Private key ends with:', privateKey.substring(privateKey.length - 25));

    // Create data string to sign
    const data = `${sid}${amount}${currency}${orderID}${url_ok}${url_cancel}${keyindex}${cn}`;
    console.log('Data to sign:', data);

    try {
      // Try different signing approaches
      let signature;
      try {
        // Approach 1: Direct key usage
        const signer = crypto.createSign('RSA-SHA256');
        signer.update(data);
        signer.end();
        signature = signer.sign({
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING
        }, 'base64');
        console.log('Signature generated successfully with approach 1');
      } catch (signError1) {
        console.error('First signing attempt failed:', signError1);
        
        // Approach 2: Clean and format key
        const cleanKey = privateKey
          .replace(/\\n/g, '\n')
          .replace(/\s+/g, '\n')
          .trim();

        const signer = crypto.createSign('RSA-SHA256');
        signer.update(data);
        signer.end();
        signature = signer.sign(cleanKey, 'base64');
        console.log('Signature generated successfully with approach 2');
      }

      if (!signature) {
        throw new Error('Failed to generate signature with both approaches');
      }

      console.log('=== myPOS Sign Request End ===');
      return res.json({ sign: signature });
    } catch (signError) {
      console.error('Signing error:', signError);
      throw signError; // Let the outer catch handle it
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
