const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const userController = require('./user.controller');
const { updateUserSchema } = require('./user.schema');

// Protect all routes in this router
router.use(authMiddleware);

router.route('/me')
  .get(userController.getMe)
  .put(validate({ body: updateUserSchema }), userController.updateMe);

module.exports = router;
