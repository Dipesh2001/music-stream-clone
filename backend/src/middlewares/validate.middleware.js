const { ZodError } = require('zod');
const { errorResponse } = require('../utils/response');

const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Pass ZodError to the central error middleware
      return next(error);
    }
    return errorResponse(res, 'Validation failed', 400, error.message);
  }
};

module.exports = validate;
