const router = require('express').Router();
const artistController = require('./artist.controller');
const validate = require('../../middlewares/validate.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/role.middleware');
const { createArtistSchema, updateArtistSchema } = require('./artist.schema');

// Public routes - accessible without authentication
router.get('/', artistController.listArtists);
router.get('/:id', artistController.getArtist);

// Admin-only routes - require authentication and admin role
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  validate(createArtistSchema),
  artistController.createArtist
);
router.put(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  validate(updateArtistSchema),
  artistController.updateArtist
);
router.delete(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  artistController.deleteArtist
);

module.exports = router;
