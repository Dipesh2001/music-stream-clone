const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const analyticsService = require('./analytics.service');

const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await analyticsService.getDashboardStats();
    successResponse(res, stats, 'Dashboard stats fetched successfully');
});

const getTopTracks = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const tracks = await analyticsService.getTopTracks({
        limit: parseInt(limit, 10) || 10,
    });
    successResponse(res, tracks, 'Top tracks fetched successfully');
});

const getTopArtists = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const artists = await analyticsService.getTopArtists({
        limit: parseInt(limit, 10) || 10,
    });
    successResponse(res, artists, 'Top artists fetched successfully');
});

const getTopAlbums = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const albums = await analyticsService.getTopAlbums({
        limit: parseInt(limit, 10) || 10,
    });
    successResponse(res, albums, 'Top albums fetched successfully');
});

module.exports = {
    getDashboardStats,
    getTopTracks,
    getTopArtists,
    getTopAlbums,
};
