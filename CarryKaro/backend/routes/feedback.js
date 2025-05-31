const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Submit feedback
router.post('/submit', async (req, res) => {
  const { userId, message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Feedback message is required' });
  }
  try {
    const feedback = new Feedback({ userId, message });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
