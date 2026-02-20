const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const albumService = require('./album.service');

const createAlbum = asyncHandler(async (req, res) => {
  if (req.file) {
    req.body.coverImage = `/uploads/albums/${req.file.filename}`; // Save the relative path/URL
  }
  const album = await albumService.createAlbum(req.body);
  return successResponse(res, album, 'Album created successfully', 201);
});

const listAlbums = asyncHandler(async (req, res) => {
  const { page, limit, search, artistId, status } = req.query;
  const albums = await albumService.getAllAlbums({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search: search || '',
    artistId,
    status: status || 'all',
  });
  return successResponse(res, albums, 'Albums retrieved successfully', 200);
});

const getAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const album = await albumService.getAlbumById(id);

  if (!album || album.status !== 'active') { // Check status for public access
    return successResponse(res, null, 'Album not found', 404);
  }
  return successResponse(res, album, 'Album retrieved successfully', 200);
});

const updateAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.file) {
    req.body.coverImage = `/uploads/albums/${req.file.filename}`;
  }
  const album = await albumService.updateAlbum(id, req.body);

  if (!album) {
    return successResponse(res, null, 'Album not found', 404);
  }
  return successResponse(res, album, 'Album updated successfully', 200);
});

const deleteAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const album = await albumService.deleteAlbum(id); // Soft delete

  if (!album) {
    return successResponse(res, null, 'Album not found', 404);
  }
  return successResponse(res, null, 'Album deleted (soft delete) successfully', 200);
});

module.exports = {
  createAlbum,
  listAlbums,
  getAlbum,
  updateAlbum,
  deleteAlbum,
};
