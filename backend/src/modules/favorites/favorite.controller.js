const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const favoriteService = require('./favorite.service');

const likeTrack = asyncHandler(async (req, res) => {
  const { trackId } = req.params;
  const userId = req.user._id;
  const favorite = await favoriteService.likeTrack(userId, trackId);
  successResponse(res, favorite, 'Track added to favorites', 201);
});

const unlikeTrack = asyncHandler(async (req, res) => {
  const { trackId } = req.params;
  const userId = req.user._id;
  const result = await favoriteService.unlikeTrack(userId, trackId);
  successResponse(res, result, 'Track removed from favorites');
});

const likeAlbum = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const userId = req.user._id;
  const favorite = await favoriteService.likeAlbum(userId, albumId);
  successResponse(res, favorite, 'Album added to favorites', 201);
});

const unlikeAlbum = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const userId = req.user._id;
  const result = await favoriteService.unlikeAlbum(userId, albumId);
  successResponse(res, result, 'Album removed from favorites');
});

const myFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const favorites = await favoriteService.getMyFavorites(userId);
  successResponse(res, favorites, 'My favorites fetched successfully');
});

module.exports = {
  likeTrack,
  unlikeTrack,
  likeAlbum,
  unlikeAlbum,
  myFavorites,
};
