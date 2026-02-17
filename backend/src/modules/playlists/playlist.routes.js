const express = require('express');
const playlistController = require('./playlist.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { createPlaylistSchema, addTrackSchema } = require('./playlist.schema');

const router = express.Router();

// Authenticated routes (owner specific)
router.post(
  '/',
  authMiddleware,
  validateMiddleware(createPlaylistSchema),
  playlistController.createPlaylist
);
router.get('/me', authMiddleware, playlistController.myPlaylists);
router.post(
  '/:id/tracks',
  authMiddleware,
  validateMiddleware(addTrackSchema),
  playlistController.addTrack
);
router.delete(
  '/:id/tracks/:trackId',
  authMiddleware,
  playlistController.removeTrack
);
router.delete(
  '/:id',
  authMiddleware,
  playlistController.deletePlaylist
);
router.get('/:id', authMiddleware, playlistController.getPlaylist); // Handles both public access (if playlist is public) and owner access (if authenticated)

// Public routes
router.get('/public', playlistController.publicPlaylists);

module.exports = router;
