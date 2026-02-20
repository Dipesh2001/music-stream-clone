const asyncHandler = require('../../utils/asyncHandler');
const { successResponse, errorResponse } = require('../../utils/response');
const playlistService = require('./playlist.service');

const createPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (req.file) {
    req.body.coverImage = `/uploads/albums/${req.file.filename}`;
  }

  const playlist = await playlistService.createPlaylist(userId, req.body);
  successResponse(res, playlist, 'Playlist created successfully', 201);
});

const listPlaylists = asyncHandler(async (req, res) => {
  const { page, limit, search, userId, visibility } = req.query;
  const result = await playlistService.getAllPlaylists({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search: search || '',
    userId: userId || '',
    visibility: visibility || '',
  });
  successResponse(res, result, 'Playlists fetched successfully');
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (req.file) {
    req.body.coverImage = `/uploads/albums/${req.file.filename}`;
  }

  const playlist = await playlistService.updatePlaylist(id, userId, req.body);
  successResponse(res, playlist, 'Playlist updated successfully');
});

const myPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user.id;
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
  const result = await playlistService.getPublicPlaylists({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search: search || '',
  });
  successResponse(res, result, 'Public playlists fetched successfully');
});

const getPlaylist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user ? req.user.id : null; // userId might not be available for public access
  const playlist = await playlistService.getPlaylistById(id, userId);
  successResponse(res, playlist, 'Playlist fetched successfully');
});

const addTrack = asyncHandler(async (req, res) => {
  const { id: playlistId } = req.params;
  const { trackId } = req.body;
  const userId = req.user.id;
  const playlist = await playlistService.addTrackToPlaylist(playlistId, trackId, userId);
  successResponse(res, playlist, 'Track added to playlist successfully');
});

const removeTrack = asyncHandler(async (req, res) => {
  const { id: playlistId, trackId } = req.params;
  const userId = req.user.id;
  const playlist = await playlistService.removeTrackFromPlaylist(playlistId, trackId, userId);
  successResponse(res, playlist, 'Track removed from playlist successfully');
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { id: playlistId } = req.params;
  const userId = req.user.id;
  const result = await playlistService.deletePlaylist(playlistId, userId);
  successResponse(res, result, 'Playlist soft-deleted successfully');
});

module.exports = {
  createPlaylist,
  listPlaylists,
  myPlaylists,
  publicPlaylists,
  getPlaylist,
  updatePlaylist,
  addTrack,
  removeTrack,
  deletePlaylist,
};
