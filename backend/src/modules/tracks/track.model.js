const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Track title is required'],
    trim: true,
    index: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required'],
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: [true, 'Album is required'],
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required'],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [0, 'Duration cannot be negative'],
  },
  language: {
    type: String,
    trim: true,
  },
  isExplicit: {
    type: Boolean,
    default: false,
  },
  playCount: {
    type: Number,
    default: 0,
    min: [0, 'Play count cannot be negative'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Add text index for title and language
trackSchema.index({ title: 'text', language: 'text' });

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
