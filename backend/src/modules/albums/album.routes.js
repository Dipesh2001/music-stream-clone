const router = require('express').Router();
const albumController = require('./album.controller');
const validate = require('../../middlewares/validate.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/role.middleware');
const { createAlbumSchema, updateAlbumSchema } = require('./album.schema');

// Public routes - accessible without authentication
router.get('/', albumController.listAlbums);
router.get('/:id', albumController.getAlbum);

// Admin-only routes - require authentication and admin role
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  validate(createAlbumSchema),
  albumController.createAlbum
);
router.put(
  '/:id',
  authMiddleware,
  requireRole('admin'),
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
