const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Artist name is required'],
    unique: true,
    trim: true,
    index: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  genres: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Add text index for name and genres
artistSchema.index({ name: 'text', genres: 'text' });

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
