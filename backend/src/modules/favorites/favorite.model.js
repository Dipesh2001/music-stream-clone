const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    default: null,
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    default: null,
  },
}, {
  timestamps: true,
});

// Custom validator: Either track OR album must exist (not both)
favoriteSchema.pre('validate', function(next) {
  if (this.track && this.album) {
    next(new Error('A favorite cannot be both a track and an album.'));
  } else if (!this.track && !this.album) {
    next(new Error('A favorite must be either a track or an album.'));
  } else {
    next();
  }
});

// Enforce uniqueness: user + track (if track exists) or user + album (if album exists)
favoriteSchema.index({ user: 1, track: 1 }, { unique: true, partialFilterExpression: { track: { $exists: true, $ne: null } } });
favoriteSchema.index({ user: 1, album: 1 }, { unique: true, partialFilterExpression: { album: { $exists: true, $ne: null } } });


const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
