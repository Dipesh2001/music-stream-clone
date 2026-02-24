const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const userController = require('./user.controller');
const { updateUserSchema } = require('./user.schema');

const { requireRole } = require('../../middlewares/role.middleware');

// Protect all routes in this router
router.use(authMiddleware);

router.route('/me')
  .get(userController.getMe)
  .put(validate({ body: updateUserSchema }), userController.updateMe);

// Admin routes
router.use(requireRole('admin'));

router.route('/')
  .get(userController.getAllUsers);

router.route('/:id/status')
  .patch(userController.updateUserStatus);

module.exports = router;
