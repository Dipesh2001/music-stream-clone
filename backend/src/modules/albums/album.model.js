const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Album title is required'],
    unique: true,
    trim: true,
    index: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required'],
  },
  coverImage: {
    type: String,
    trim: true,
  },
  releaseDate: {
    type: Date,
  },
  genres: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Add text index for title and genres
albumSchema.index({ title: 'text', genres: 'text' });

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
