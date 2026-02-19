const router = require('express').Router();
const albumController = require('./album.controller');
const validate = require('../../middlewares/validate.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/role.middleware');
const { createAlbumSchema, updateAlbumSchema } = require('./album.schema');

const upload = require('../../utils/upload');

// Middleware to normalize artists[] from FormData to artists array for Zod/Mongoose
const normalizeArtists = (req, res, next) => {
  if (req.body['artists[]']) {
    req.body.artists = Array.isArray(req.body['artists[]'])
      ? req.body['artists[]']
      : [req.body['artists[]']];
    delete req.body['artists[]'];
  } else if (!req.body.artists) {
    req.body.artists = [];
  }
  next();
};

// Public routes - accessible without authentication
router.get('/', albumController.listAlbums);
router.get('/:id', albumController.getAlbum);

// Admin-only routes - require authentication and admin role
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  upload.single('coverImage'),
  normalizeArtists,
  validate(createAlbumSchema),
  albumController.createAlbum
);
router.put(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  upload.single('coverImage'),
  normalizeArtists,
  validate(updateAlbumSchema),
  albumController.updateAlbum
);
router.delete(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  albumController.deleteAlbum
);

module.exports = router;
