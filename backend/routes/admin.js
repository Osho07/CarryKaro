const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage for notes upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const subject = req.body.subject;
    const dir = path.join(__dirname, '..', 'uploads', subject);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.doc' && ext !== '.docx') {
      return cb(new Error('Only PDF and Word documents are allowed'));
    }
    cb(null, true);
  }
});

// Create student by admin
router.post('/create-student', async (req, res) => {
  const { mobileNumber, password } = req.body;
  if (!mobileNumber || !password) {
    return res.status(400).json({ message: 'Mobile number and password are required' });
  }
  try {
    const existingUser = await User.findOne({ mobileNumber, role: 'student' });
    if (existingUser) {
      return res.status(400).json({ message: 'Student with this mobile number already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: mobileNumber,
      mobileNumber,
      password: hashedPassword,
      role: 'student'
    });
    await newUser.save();
    res.json({ message: 'Student created successfully' });
  } catch (err) {
    console.error('Create student error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload notes by admin
router.post('/upload-notes', (req, res) => {
  upload.single('file')(req, res, function (err) {
    if (err) {
      console.error('Upload notes error:', err);
      return res.status(400).json({ message: err.message });
    }
    const subject = req.body.subject;
    if (!subject) {
      return res.status(400).json({ message: 'Subject is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }
    res.json({ message: 'File uploaded successfully', file: req.file.filename });
  });
});

module.exports = router;
