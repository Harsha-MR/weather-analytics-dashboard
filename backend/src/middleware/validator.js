import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseFormatter.js';
import { STATUS_CODES } from '../config/constants.js';

/**
 * Validate request using express-validator
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return errorResponse(
      res,
      'Validation failed',
      STATUS_CODES.BAD_REQUEST,
      formattedErrors
    );
  }

  next();
};

/**
 * Sanitize request body
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    // Remove any fields starting with $ (MongoDB operators)
    const sanitized = {};
    for (const key in req.body) {
      if (!key.startsWith('$')) {
        sanitized[key] = req.body[key];
      }
    }
    req.body = sanitized;
  }
  next();
};

/**
 * Validate ObjectId
 */
export const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return errorResponse(
        res,
        `Invalid ${paramName} format`,
        STATUS_CODES.BAD_REQUEST
      );
    }

    next();
  };
};

export default {
  validate,
  sanitizeBody,
  validateObjectId,
};
