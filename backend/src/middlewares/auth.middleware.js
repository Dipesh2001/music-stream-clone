const { verifyAccessToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

const authMiddleware = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = verifyAccessToken(token);

      // Attach user to the request
      req.user = decoded; // The payload of the JWT becomes req.user
      next();
    } catch (error) {
      if (error.message === 'Invalid or expired access token') {
        return errorResponse(res, 'Not authorized, token failed', 401);
      }
      return errorResponse(res, 'Not authorized, token is invalid', 401);
    }
  }

  if (!token) {
    return errorResponse(res, 'Not authorized, no token', 401);
  }
};

module.exports = authMiddleware;
