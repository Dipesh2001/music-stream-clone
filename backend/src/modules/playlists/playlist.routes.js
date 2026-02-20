const express = require('express');
const playlistController = require('./playlist.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { createPlaylistSchema, addTrackSchema } = require('./playlist.schema');

const upload = require('../../utils/upload');

const router = express.Router();

router.get('/', authMiddleware, playlistController.listPlaylists);

// Middleware to parse fields from FormData (comes as strings)
const parsePlaylistBody = (req, res, next) => {
  if (req.body.visibility) {
    req.body.isPublic = req.body.visibility === 'public';
  }
  next();
};

// Authenticated routes (owner specific)
router.post(
  '/',
  authMiddleware,
  upload.single('coverImage'),
  parsePlaylistBody,
  validateMiddleware(createPlaylistSchema),
  playlistController.createPlaylist
);
router.get('/me', authMiddleware, playlistController.myPlaylists);
router.put(
  '/:id',
  authMiddleware,
  upload.single('coverImage'),
  parsePlaylistBody,
  // Using same schema for now, might need separate update schema later if fields differ
  validateMiddleware(createPlaylistSchema),
  playlistController.updatePlaylist
);
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
