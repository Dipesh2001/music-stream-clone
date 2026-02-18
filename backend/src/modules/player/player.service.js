const PlayHistory = require('./playHistory.model');
const Track = require('../tracks/track.model');
const mongoose = require('mongoose');

const SESSION_WINDOW_MINUTES = 5; // Define a time window for an ongoing play session

const logPlay = async (userId, trackId) => {
  if (!mongoose.Types.ObjectId.isValid(trackId)) {
    throw new Error('Invalid Track ID format');
  }

  const track = await Track.findById(trackId);
  if (!track || track.status !== 'active') {
    throw new Error('Track not found or is inactive');
  }

  const fiveMinutesAgo = new Date(Date.now() - SESSION_WINDOW_MINUTES * 60 * 1000);

  // Find a recent, uncompleted play history entry for this user and track
  const recentPlay = await PlayHistory.findOne({
    user: userId,
    track: trackId,
    completed: false,
    playedAt: { $gte: fiveMinutesAgo },
  });

  if (recentPlay) {
    // If a recent, uncompleted session exists, update its playedAt to extend the session
    recentPlay.playedAt = Date.now();
    recentPlay.lastPosition = 0; // Reset position for a fresh "start" within the session
    await recentPlay.save();
    // Do NOT increment playCount again for an ongoing session
    return recentPlay;
  } else {
    // If no recent, uncompleted session, this is a new play. Create a new entry.
    const newPlay = new PlayHistory({
      user: userId,
      track: trackId,
      playedAt: Date.now(),
      lastPosition: 0,
      completed: false,
    });
    await newPlay.save();

    // Increment track.playCount for the first play of this new session
    track.playCount = (track.playCount || 0) + 1;
    await track.save();
    return newPlay;
  }
};

const updateProgress = async (userId, trackId, lastPosition, completed) => {
  if (!mongoose.Types.ObjectId.isValid(trackId)) {
    throw new Error('Invalid Track ID format');
  }

  const track = await Track.findById(trackId);
  if (!track || track.status !== 'active') {
    throw new Error('Track not found or is inactive');
  }

  // Find the most recent play history entry for this user and track that is not completed
  const mostRecentPlay = await PlayHistory.findOne({
    user: userId,
    track: trackId,
    completed: false,
  }).sort({ playedAt: -1 });

  if (!mostRecentPlay) {
    throw new Error('No active play session found for this track');
  }

  mostRecentPlay.lastPosition = lastPosition;
  if (completed !== undefined) {
    mostRecentPlay.completed = completed;
  }
  await mostRecentPlay.save();
  return mostRecentPlay;
};

const getRecentlyPlayed = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const query = { user: userId };

  const recentPlays = await PlayHistory.find(query)
    .sort({ playedAt: -1 }) // Sort by most recent
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'track',
      select: 'title duration audioUrl artist',
      populate: {
        path: 'artist',
        select: 'name -_id',
      },
    })
    .lean();

  const total = await PlayHistory.countDocuments(query);

  return {
    recentPlays,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  logPlay,
  updateProgress,
  getRecentlyPlayed,
};
