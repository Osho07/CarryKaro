const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create new order
router.post('/create', async (req, res) => {
  const { userId, products, name, address, contact, paymentMode } = req.body;
  if (!userId || !products || !name || !address || !contact || !paymentMode) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  try {
    const order = new Order({ userId, products, name, address, contact, paymentMode });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
