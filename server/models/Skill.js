const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'soft-skills', 'learning'],
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  certifications: [{
    name: String,
    url: String,
    date: Date
  }],
  relatedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  isHighlighted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Skill', skillSchema);