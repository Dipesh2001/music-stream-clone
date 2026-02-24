const User = require('../users/user.model');
const { generateAccessToken } = require('../../utils/jwt');
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

  // Return user without password and tokens
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return { user: userWithoutPassword, accessToken };
};

const loginUser = async (userData) => {
  const { email, password } = userData;

  // Find user by email, include password
  const user = await User.findOne({ email }).select('+password');
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

  // Return user without password and tokens
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return { user: userWithoutPassword, accessToken };
};

const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return { message: 'Logged out successfully' };
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
