const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const artistService = require('./artist.service');

const createArtist = asyncHandler(async (req, res) => {
  const artist = await artistService.createArtist(req.body);
  return successResponse(res, artist, 'Artist created successfully', 201);
});

const listArtists = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const artists = await artistService.getAllArtists({
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    search,
  });
  return successResponse(res, artists, 'Artists retrieved successfully', 200);
});

const getArtist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const artist = await artistService.getArtistById(id);

  if (!artist || !artist.isActive) { // Check isActive for public access
    return successResponse(res, null, 'Artist not found', 404);
  }
  return successResponse(res, artist, 'Artist retrieved successfully', 200);
});

const updateArtist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const artist = await artistService.updateArtist(id, req.body);

  if (!artist) {
    return successResponse(res, null, 'Artist not found', 404);
  }
  return successResponse(res, artist, 'Artist updated successfully', 200);
});

const deleteArtist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const artist = await artistService.deleteArtist(id); // Soft delete

  if (!artist) {
    return successResponse(res, null, 'Artist not found', 404);
  }
  return successResponse(res, null, 'Artist deleted (soft delete) successfully', 200);
});

module.exports = {
  createArtist,
  listArtists,
  getArtist,
  updateArtist,
  deleteArtist,
};
