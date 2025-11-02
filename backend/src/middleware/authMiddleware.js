import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/responseFormatter.js';
import { STATUS_CODES } from '../config/constants.js';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Protect routes - Verify JWT token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return errorResponse(
        res,
        'Not authorized to access this route. Please login.',
        STATUS_CODES.UNAUTHORIZED
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return errorResponse(
          res,
          'User not found',
          STATUS_CODES.UNAUTHORIZED
        );
      }

      if (!user.isActive) {
        return errorResponse(
          res,
          'User account is inactive',
          STATUS_CODES.FORBIDDEN
        );
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification failed:', error.message);
      return errorResponse(
        res,
        'Invalid or expired token',
        STATUS_CODES.UNAUTHORIZED
      );
    }
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    return errorResponse(
      res,
      'Authentication error',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Optional authentication - Attach user if token is valid
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid, but continue without user
        logger.info('Optional auth - invalid token, continuing without user');
      }
    }

    next();
  } catch (error) {
    // Continue without user
    next();
  }
};

/**
 * Check if user is admin (future use)
 */
export const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return errorResponse(
        res,
        'Admin access required',
        STATUS_CODES.FORBIDDEN
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      'Authorization error',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

export default {
  protect,
  optionalAuth,
  isAdmin,
};
