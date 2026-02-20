const express = require('express');
const trackController = require('./track.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/role.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { createTrackSchema, updateTrackSchema, batchUpdateOrderSchema } = require('./track.schema');

const upload = require('../../utils/upload');

const router = express.Router();

// Middleware to parse fields from FormData (comes as strings)
const parseTrackBody = (req, res, next) => {
  if (req.body.duration) req.body.duration = parseFloat(req.body.duration);
  if (req.body.order) req.body.order = parseInt(req.body.order, 10);
  if (req.body.isExplicit !== undefined) {
    req.body.isExplicit = req.body.isExplicit === 'true' || req.body.isExplicit === true;
  }
  next();
};

const normalizeArtists = (req, res, next) => {
  if (req.body['artists[]']) {
    req.body.artists = Array.isArray(req.body['artists[]'])
      ? req.body['artists[]']
      : [req.body['artists[]']];
    delete req.body['artists[]'];
  }
  next();
};

// Admin-only routes
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  upload.single('audioFile'),
  normalizeArtists,
  parseTrackBody,
  validateMiddleware(createTrackSchema),
  trackController.createTrack
);
router.patch(
  '/order',
  authMiddleware,
  requireRole('admin'),
  validateMiddleware(batchUpdateOrderSchema),
  trackController.updateTrackOrder
);
router.put(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  upload.single('audioFile'),
  normalizeArtists,
  parseTrackBody,
  validateMiddleware(updateTrackSchema),
  trackController.updateTrack
);
router.delete(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  trackController.deleteTrack
);

// Public routes
router.get('/', authMiddleware, trackController.listTracks); // authMiddleware is optional for public routes, but required for req.user check in controller for admin access
router.get('/:id', authMiddleware, trackController.getTrack); // Same as above
router.post('/:id/play', trackController.incrementPlayCount); // Public endpoint for incrementing play count

module.exports = router;
