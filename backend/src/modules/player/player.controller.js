const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const playerService = require('./player.service');

const playTrack = asyncHandler(async (req, res) => {
  const { trackId } = req.params;
  const userId = req.user._id; // Assuming req.user is populated by authMiddleware
  const playHistoryEntry = await playerService.logPlay(userId, trackId);
  successResponse(res, playHistoryEntry, 'Play logged successfully', 201);
});

const updateProgress = asyncHandler(async (req, res) => {
  const { trackId } = req.params;
  const { lastPosition, completed } = req.body;
  const userId = req.user._id;
  const playHistoryEntry = await playerService.updateProgress(userId, trackId, lastPosition, completed);
  successResponse(res, playHistoryEntry, 'Play progress updated successfully');
});

const recentlyPlayed = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page, limit } = req.query;
  const recentPlays = await playerService.getRecentlyPlayed(userId, {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  });
  successResponse(res, recentPlays, 'Recently played tracks fetched successfully');
});

module.exports = {
  playTrack,
  updateProgress,
  recentlyPlayed,
};
