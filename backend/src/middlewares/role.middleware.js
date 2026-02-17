const successResponse = require('../utils/response');

const requireRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    // Use the error structure from successResponse for consistency
    const error = new Error('Forbidden: Insufficient role permissions');
    error.statusCode = 403;
    next(error);
  }
};

module.exports = { requireRole };
