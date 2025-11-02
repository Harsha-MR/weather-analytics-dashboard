import rateLimit from 'express-rate-limit';
import { STATUS_CODES } from '../config/constants.js';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(STATUS_CODES.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Too many requests, please try again later',
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Strict limiter for authentication routes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Weather API limiter (more restrictive)
 */
export const weatherLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  message: {
    success: false,
    message: 'Weather API rate limit exceeded, please try again later',
  },
});

/**
 * Search API limiter
 */
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 searches per minute
  message: {
    success: false,
    message: 'Search rate limit exceeded, please slow down',
  },
});

export default {
  apiLimiter,
  authLimiter,
  weatherLimiter,
  searchLimiter,
};
