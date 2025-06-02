const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: function() { return this.role === 'admin'; }, unique: true, sparse: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: function() { return this.role === 'student'; }, unique: true, sparse: true },
  role: { type: String, enum: ['admin', 'student'], required: true }
});

module.exports = mongoose.model('User', userSchema);
