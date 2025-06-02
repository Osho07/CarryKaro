const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Admin signup
router.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingAdmin = await User.findOne({ username, role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({ username, password: hashedPassword, role: 'admin' });
    await newAdmin.save();
    return res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Admin signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

const ADMIN_USERNAME = 'Deepika@123';
const ADMIN_PASSWORD = 'Bhavyan$345';

// Admin login
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ message: 'Admin login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// Student login
router.post('/student/login', async (req, res) => {
  const { mobileNumber, password } = req.body;
  try {
    const user = await User.findOne({ mobileNumber, role: 'student' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid student credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid student credentials' });
    }
    return res.json({ message: 'Student login successful' });
  } catch (err) {
    console.error('Student login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
