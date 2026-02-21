const express = require('express');
const analyticsController = require('./analytics.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

// All analytics routes require authentication
router.get('/stats', authMiddleware, analyticsController.getDashboardStats);
router.get('/top-tracks', authMiddleware, analyticsController.getTopTracks);
router.get('/top-artists', authMiddleware, analyticsController.getTopArtists);
router.get('/top-albums', authMiddleware, analyticsController.getTopAlbums);

module.exports = router;
