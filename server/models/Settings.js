const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  type: { 
    type: String, 
    unique: true, 
    required: true,
    enum: ['profile', 'social', 'seo', 'password']
  },
  data: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Settings', settingsSchema);