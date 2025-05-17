const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.post('/mypos-sign', (req, res) => {
  console.log('Received myPOS sign request');
  
  // Handle CORS with credentials
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
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const privateKey = process.env.MY_POS_PRIVATE_KEY;
    if (!privateKey) {
      console.error('MY_POS_PRIVATE_KEY is not set');
      return res.status(500).json({ error: 'Server configuration error: missing private key' });
    }

    // Create data string to sign
    const data = `${sid}${amount}${currency}${orderID}${url_ok}${url_cancel}${keyindex}${cn}`;
    console.log('Data to sign:', data);

    // Try different signing approaches
    try {
      // Approach 1: Direct key usage
      const signer = crypto.createSign('RSA-SHA256');
      signer.update(data);
      signer.end();
      const signature = signer.sign({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
      }, 'base64');

      console.log('Signature generated successfully');
      return res.json({ sign: signature });
    } catch (signError1) {
      console.error('First signing attempt failed:', signError1);
      
      try {
        // Approach 2: Parse key as PEM
        const cleanKey = privateKey
          .replace(/\\n/g, '\n')
          .replace(/\s+/g, '\n')
          .trim();

        const signer = crypto.createSign('RSA-SHA256');
        signer.update(data);
        signer.end();
        const signature = signer.sign(cleanKey, 'base64');

        console.log('Signature generated successfully with cleaned key');
        return res.json({ sign: signature });
      } catch (signError2) {
        console.error('Second signing attempt failed:', signError2);
        throw signError2;
      }
    }
  } catch (err) {
    console.error('Final error:', err);
    return res.status(500).json({ 
      error: 'Failed to generate signature',
      details: err.message
    });
  }
});

module.exports = router;
