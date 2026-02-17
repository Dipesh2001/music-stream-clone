const express = require('express');
const playerController = require('./player.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

// All player routes require authentication
router.use(authMiddleware);

router.post('/play/:trackId', playerController.playTrack);
router.post('/progress/:trackId', playerController.updateProgress);
router.get('/recent', playerController.recentlyPlayed);

module.exports = router;
