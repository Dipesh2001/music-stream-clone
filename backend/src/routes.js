const express = require('express');
const router = express.Router();
const asyncHandler = require('./utils/asyncHandler');
const { successResponse } = require('./utils/response');
const authMiddleware = require('./middlewares/auth.middleware'); // Import auth middleware
const artistRoutes = require('./modules/artists/artist.routes');
const albumRoutes = require('./modules/albums/album.routes'); // New import

router.get('/health', asyncHandler(async (req, res) => {
  successResponse(res, { status: 'ok' }, 'Health check successful');
}));

// Protected route example
router.get('/protected', authMiddleware, asyncHandler(async (req, res) => {
  // If we reach here, the token is valid, and req.user contains the decoded payload
  successResponse(res, { user: req.user }, 'Access to protected route granted');
}));

// Auth Routes
router.use('/auth', require('./modules/auth/auth.routes'));

// User Routes
router.use('/users', require('./modules/users/user.routes'));

// Artist Routes
router.use('/artists', artistRoutes);

// Album Routes - New route mount
router.use('/albums', albumRoutes);

// Track Routes - New route mount
router.use('/tracks', require('./modules/tracks/track.routes'));

// Playlist Routes - New route mount
router.use('/playlists', require('./modules/playlists/playlist.routes'));

// Favorite Routes - New route mount
router.use('/favorites', require('./modules/favorites/favorite.routes'));

// Player Routes - New route mount
router.use('/player', require('./modules/player/player.routes'));

// Search Routes - New route mount
router.use('/search', require('./modules/search/search.routes'));

// Analytics Routes - New route mount
router.use('/analytics', require('./modules/analytics/analytics.routes'));

// Recommendation Routes - New route mount
router.use('/recommendations', require('./modules/recommendations/recommendation.routes'));

module.exports = router;
