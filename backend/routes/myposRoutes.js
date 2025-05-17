const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Use private key from environment variable (set via GitHub secrets or deployment env)
const PRIVATE_KEY = process.env.VITE_MYPOS_PRIVATE_KEY;

// POST /api/mypos-sign
router.post('/mypos-sign', (req, res) => {
  const { sid, amount, currency, orderID, url_ok, url_cancel, keyindex, cn } = req.body;
  if (!sid || !amount || !currency || !orderID || !url_ok || !url_cancel || !keyindex || !cn) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Concatenate fields as per myPOS documentation
  const data = `${sid}${amount}${currency}${orderID}${url_ok}${url_cancel}${keyindex}${cn}`;
  try {
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(data);
    signer.end();
    const signature = signer.sign(PRIVATE_KEY, 'base64');
    res.json({ sign: signature });
  } catch (err) {
    res.status(500).json({ error: 'Sign generation failed' });
  }
});

module.exports = router;
