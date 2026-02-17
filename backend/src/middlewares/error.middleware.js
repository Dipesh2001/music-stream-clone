const { ZodError } = require('zod'); // Zod errors
const jwt = require('jsonwebtoken'); // For JsonWebTokenError

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errors = [];

  // Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errors = err.errors.map((error) => ({
      path: error.path.join('.'),
      message: error.message,
    }));
  }

  // Mongoose Bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = `Resource not found with id of ${err.value}`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    for (let p in err.errors) {
      errors.push({
        path: err.errors[p].path,
        message: err.errors[p].message,
      });
    }
  }

  // Mongoose duplicate key
  if (err.code && err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered: ${Object.keys(err.keyValue)} with value ${Object.values(err.keyValue)}`;
  }

  // JWT errors
  if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = 'Not authorized, token failed';
  }

  if (err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Not authorized, token expired';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
