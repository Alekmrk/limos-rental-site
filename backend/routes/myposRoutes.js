const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Helper function to format private key
const formatPrivateKey = (key) => {
  if (!key) return null;
  // Remove existing line breaks and spaces
  const cleanKey = key.replace(/[\r\n\s]/g, '');
  // Add proper line breaks
  const header = '-----BEGIN RSA PRIVATE KEY-----\n';
  const footer = '\n-----END RSA PRIVATE KEY-----';
  const body = cleanKey
    .replace(/-----BEGIN RSA PRIVATE KEY-----|-----END RSA PRIVATE KEY-----/g, '')
    .match(/.{1,64}/g)
    .join('\n');
  return header + body + footer;
};

// POST /api/mypos-sign
router.post('/mypos-sign', (req, res) => {
  // Add CORS headers explicitly for this route
  res.header('Access-Control-Allow-Origin', 'https://elitewaylimo.ch');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Log request details
  console.log('myPOS sign request received with body:', req.body);
  
  const { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn } = req.body;
  
  if (!sid || !amount || !currency || !orderID || !url_ok || !url_cancel || !keyindex || !cn) {
    console.error('Missing required fields:', { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get and format private key
    const rawKey = process.env.MY_POS_PRIVATE_KEY;
    if (!rawKey) {
      console.error('MY_POS_PRIVATE_KEY environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error: missing private key' });
    }

    const privateKey = formatPrivateKey(rawKey);
    if (!privateKey) {
      console.error('Failed to format private key');
      return res.status(500).json({ error: 'Server configuration error: invalid private key format' });
    }

    // Log formatted key debugging
    console.log('Formatted private key:', privateKey);

    // Create signature
    const data = `${sid}${amount}${currency}${orderID}${url_ok}${url_cancel}${keyindex}${cn}`;
    console.log('Data to sign:', data);

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(data);
    signer.end();
    
    const signature = signer.sign(privateKey, 'base64');
    console.log('Signature generated successfully, length:', signature.length);
    
    return res.json({ sign: signature });
  } catch (err) {
    console.error('Error generating signature:', err);
    return res.status(500).json({ 
      error: 'Failed to generate signature',
      details: err.message
    });
  }
});

module.exports = router;
