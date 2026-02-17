const express = require('express');
const trackController = require('./track.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/role.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { createTrackSchema, updateTrackSchema } = require('./track.schema');

const router = express.Router();

// Admin-only routes
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  validateMiddleware(createTrackSchema),
  trackController.createTrack
);
router.put(
  '/:id',
  authMiddleware,
  requireRole('admin'),
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
