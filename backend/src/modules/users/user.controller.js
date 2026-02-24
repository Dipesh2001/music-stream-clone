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

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers(req.query);
  successResponse(res, users, 'Users fetched successfully');
});

// @desc    Update user status (admin only)
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  if (isActive === undefined) {
    return res.status(400).json({ success: false, message: 'isActive status is required' });
  }
  const user = await userService.updateUserStatus(req.params.id, isActive);
  successResponse(res, user, 'User status updated successfully');
});

module.exports = {
  getMe,
  updateMe,
  getAllUsers,
  updateUserStatus,
};
