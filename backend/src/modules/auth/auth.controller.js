const { registerUser, loginUser, logoutUser } = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const { verifyRefreshToken, generateAccessToken, generateRefreshToken } = require('../../utils/jwt');
const User = require('../users/user.model');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await registerUser(req.body);
  successResponse(res, { user, accessToken, refreshToken }, 'User registered successfully', 201);
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body);
  successResponse(res, { user, accessToken, refreshToken }, 'Logged in successfully');
});

// @desc    Get new access token using refresh token
// @route   POST /api/auth/refresh-token
// @access  Public (with refresh token)
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.body;

  if (!oldRefreshToken) {
    throw new Error('Refresh token not provided');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(oldRefreshToken);

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || !user.refreshToken) {
    throw new Error('Invalid refresh token or user not found');
  }

  const isMatch = await user.compareRefreshToken(oldRefreshToken);
  if (!isMatch) {
    throw new Error('Invalid refresh token');
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken({ id: user._id, role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user._id, role: user.role });

  // Hash and save new refresh token
  const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
  user.refreshToken = hashedNewRefreshToken;
  await user.save();

  successResponse(res, { accessToken: newAccessToken, refreshToken: newRefreshToken }, 'New token pair generated');
});

// @desc    Log user out / clear refresh token
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available from auth middleware
  await logoutUser(userId);
  // If refresh token is in HTTP-only cookie, clear it here:
  // res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  successResponse(res, null, 'Logged out successfully');
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
