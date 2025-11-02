import logger from '../utils/logger.js';
import { STATUS_CODES } from '../config/constants.js';

/**
 * Error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      message,
      statusCode: STATUS_CODES.NOT_FOUND,
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = {
      message,
      statusCode: STATUS_CODES.CONFLICT,
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = {
      message: messages.join(', '),
      statusCode: STATUS_CODES.BAD_REQUEST,
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      statusCode: STATUS_CODES.UNAUTHORIZED,
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      statusCode: STATUS_CODES.UNAUTHORIZED,
    };
  }

  res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};

/**
 * Handle 404 - Not Found
 */
export const notFound = (req, res, next) => {
  const message = `Route not found - ${req.originalUrl}`;
  logger.warn(message);
  
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
};

export default {
  errorHandler,
  notFound,
};
