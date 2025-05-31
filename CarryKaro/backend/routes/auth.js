const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Signup route
router.post('/signup', async (req, res) => {
  const { name, mobileNumber, password, isSeller, gstNumber } = req.body;
  if (!name || !mobileNumber || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  if (isSeller && !gstNumber) {
    return res.status(400).json({ message: 'GST number is required for sellers' });
  }
  try {
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this mobile number' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, mobileNumber, password: hashedPassword, isSeller: !!isSeller, gstNumber });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { mobileNumber, password } = req.body;
  if (!mobileNumber || !password) {
    return res.status(400).json({ message: 'Please provide mobile number and password' });
  }
  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', userId: user._id, isAdmin: user.isAdmin, isSeller: user.isSeller });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
