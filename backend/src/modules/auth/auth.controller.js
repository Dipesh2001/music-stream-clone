const { registerUser, loginUser } = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');
const { verifyRefreshToken, generateAccessToken } = require('../../utils/jwt');

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

  // If decoded, issue new access token (assuming user details are in decoded)
  const newAccessToken = generateAccessToken({ id: decoded.id, role: decoded.role });

  successResponse(res, { accessToken: newAccessToken }, 'New access token generated');
});

module.exports = {
  register,
  login,
  refreshToken,
};
