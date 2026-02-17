const asyncHandler = require('../../utils/asyncHandler');
const { successResponse, errorResponse } = require('../../utils/response');
const trackService = require('./track.service');

const createTrack = asyncHandler(async (req, res) => {
  const track = await trackService.createTrack(req.body);
  successResponse(res, track, 'Track created successfully', 201);
});

const listTracks = asyncHandler(async (req, res) => {
  const { page, limit, search, albumId, artistId } = req.query;
  const includeInactive = req.user && req.user.role === 'admin'; // Admins can see inactive tracks

  const { tracks, totalTracks, totalPages } = await trackService.getAllTracks({
    page,
    limit,
    search,
    albumId,
    artistId,
    includeInactive,
  });
  successResponse(res, { tracks, totalTracks, totalPages }, 'Tracks fetched successfully');
});

const getTrack = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const includeInactive = req.user && req.user.role === 'admin'; // Admins can see inactive tracks
  const track = await trackService.getTrackById(id, includeInactive);
  successResponse(res, track, 'Track fetched successfully');
});

const updateTrack = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const track = await trackService.updateTrack(id, req.body);
  successResponse(res, track, 'Track updated successfully');
});

const deleteTrack = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await trackService.deleteTrack(id);
  successResponse(res, result, 'Track soft-deleted successfully');
});

const incrementPlayCount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const track = await trackService.incrementPlayCount(id);
  successResponse(res, { playCount: track.playCount }, 'Play count incremented successfully');
});

module.exports = {
  createTrack,
  listTracks,
  getTrack,
  updateTrack,
  deleteTrack,
  incrementPlayCount,
};
