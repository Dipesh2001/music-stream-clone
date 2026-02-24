const jwt = require('jsonwebtoken');
const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
} = require('../config/env');

// Generate Access Token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });
};


// Verify Access Token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};


module.exports = {
  generateAccessToken,
  verifyAccessToken,
};
