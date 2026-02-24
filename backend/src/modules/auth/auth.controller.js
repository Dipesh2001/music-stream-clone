const { registerUser, loginUser, logoutUser } = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');
const { successResponse } = require('../../utils/response');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { user, accessToken } = await registerUser(req.body);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Support for cross-origin if needed
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  successResponse(res, { user, accessToken }, 'User registered successfully', 201);
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { user, accessToken } = await loginUser(req.body);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  successResponse(res, { user, accessToken }, 'Logged in successfully');
});


// @desc    Log user out / clear refresh token
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available from auth middleware
  await logoutUser(userId);
  res.clearCookie('accessToken');
  successResponse(res, null, 'Logged out successfully');
});

module.exports = {
  register,
  login,
  logout,
};
