const asyncHandler = require('../../utils/asyncHandler');
const { successResponse, errorResponse } = require('../../utils/response');
const playlistService = require('./playlist.service');

const createPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming req.user is populated by authMiddleware
  const playlist = await playlistService.createPlaylist(userId, req.body);
  successResponse(res, playlist, 'Playlist created successfully', 201);
});

const myPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page, limit, search } = req.query;
  const playlists = await playlistService.getMyPlaylists(userId, {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    search,
  });
  successResponse(res, playlists, 'My playlists fetched successfully');
});

const publicPlaylists = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const { playlists, totalPlaylists, totalPages } = await playlistService.getPublicPlaylists({ page, limit, search });
  successResponse(res, { playlists, totalPlaylists, totalPages }, 'Public playlists fetched successfully');
});

const getPlaylist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user ? req.user._id : null; // userId might not be available for public access
  const playlist = await playlistService.getPlaylistById(id, userId);
  successResponse(res, playlist, 'Playlist fetched successfully');
});

const addTrack = asyncHandler(async (req, res) => {
  const { id: playlistId } = req.params;
  const { trackId } = req.body;
  const userId = req.user._id;
  const playlist = await playlistService.addTrackToPlaylist(playlistId, trackId, userId);
  successResponse(res, playlist, 'Track added to playlist successfully');
});

const removeTrack = asyncHandler(async (req, res) => {
  const { id: playlistId, trackId } = req.params;
  const userId = req.user._id;
  const playlist = await playlistService.removeTrackFromPlaylist(playlistId, trackId, userId);
  successResponse(res, playlist, 'Track removed from playlist successfully');
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { id: playlistId } = req.params;
  const userId = req.user._id;
  const result = await playlistService.deletePlaylist(playlistId, userId);
  successResponse(res, result, 'Playlist soft-deleted successfully');
});

module.exports = {
  createPlaylist,
  myPlaylists,
  publicPlaylists,
  getPlaylist,
  addTrack,
  removeTrack,
  deletePlaylist,
};
