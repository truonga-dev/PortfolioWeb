const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  page: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    country: { type: String, default: 'Unknown' },
    city: { type: String, default: 'Unknown' }
  },
  device: {
    type: String,
    default: 'Unknown'
  },
  browser: {
    type: String,
    default: 'Unknown'
  },
  referrer: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Visitor', visitorSchema);