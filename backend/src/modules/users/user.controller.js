const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const userService = require('./user.service');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  successResponse(res, user, 'User profile fetched successfully');
});

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user.id, req.body);
  successResponse(res, user, 'User profile updated successfully');
});

module.exports = {
  getMe,
  updateMe,
};
