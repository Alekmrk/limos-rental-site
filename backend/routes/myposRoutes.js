const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Use private key from environment variable (set via GitHub secrets or deployment env)
const PRIVATE_KEY = process.env.VITE_MYPOS_PRIVATE_KEY;

// POST /api/mypos-sign
router.post('/mypos-sign', (req, res) => {
  const { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn } = req.body;
  console.log('myPOS sign request received:', { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn });
  if (!sid || !amount || !currency || !orderID || !url_ok || !url_cancel || !keyindex || !cn) {
    console.error('Missing required fields:', { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn });
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!process.env.MY_POS_PRIVATE_KEY) {
    console.error('MY_POS_PRIVATE_KEY is not set or empty!');
    return res.status(500).json({ error: 'Server misconfiguration: missing private key' });
  }
  // Log the first and last 30 chars of the private key for debug (never log full key in production)
  const pk = process.env.MY_POS_PRIVATE_KEY;
  console.log('MY_POS_PRIVATE_KEY (partial):', pk.substring(0, 30) + '...' + pk.substring(pk.length - 30));
  const data = `${sid}${amount}${currency}${orderID}${url_ok}${url_cancel}${keyindex}${cn}`;
  console.log('Data to sign:', data);
  try {
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(data);
    signer.end();
    const signature = signer.sign(process.env.MY_POS_PRIVATE_KEY, 'base64');
    console.log('Signature generated successfully');
    res.json({ sign: signature });
  } catch (err) {
    console.error('Sign generation failed:', err);
    res.status(500).json({ error: 'Sign generation failed', details: err.message });
  }
});

module.exports = router;
