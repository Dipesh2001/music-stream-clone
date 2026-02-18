const User = require('../users/user.model');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt');
const bcrypt = require('bcryptjs');

const registerUser = async (userData) => {
  const { email, password, name } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with that email already exists');
  }

  // Create new user
  const user = await User.create({ email, password, name });

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  // Hash and save refresh token
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10); // Using 10 salt rounds
  user.refreshToken = hashedRefreshToken;
  await user.save();

  // Return user without password and tokens
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return { user: userWithoutPassword, accessToken, refreshToken };
};

const loginUser = async (userData) => {
  const { email, password } = userData;

  // Find user by email, include password and refreshToken
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  // Hash and save new refresh token
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10); // Using 10 salt rounds
  user.refreshToken = hashedRefreshToken;
  await user.save();

  // Return user without password and tokens
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return { user: userWithoutPassword, accessToken, refreshToken };
};

const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.refreshToken = null; // Invalidate refresh token
  await user.save();
  return { message: 'Logged out successfully' };
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
