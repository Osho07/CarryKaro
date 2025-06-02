require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 5000;

// Security middlewares
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(bodyParser.json());

// MongoDB connection with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
    setTimeout(connectWithRetry, 5000);
  });
};
connectWithRetry();

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Routes
app.get('/', (req, res) => {
  res.send('Bhavyan Tutorials Backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
