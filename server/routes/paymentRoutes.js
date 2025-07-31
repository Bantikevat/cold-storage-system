const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// POST /api/payments/add
router.post('/add', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json({ message: 'Payment saved' });
  } catch (err) {
    res.status(500).json({ message: 'Payment failed', error: err.message });
  }
});

module.exports = router;
