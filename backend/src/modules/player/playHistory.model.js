const mongoose = require('mongoose');

const playHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true,
  },
  playedAt: {
    type: Date,
    default: Date.now,
  },
  lastPosition: {
    type: Number,
    default: 0, // seconds
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // This will add createdAt and updatedAt
});

// Index for user + playedAt (descending) for efficient retrieval of recently played tracks
playHistorySchema.index({ user: 1, playedAt: -1 });

const PlayHistory = mongoose.model('PlayHistory', playHistorySchema);

module.exports = PlayHistory;
