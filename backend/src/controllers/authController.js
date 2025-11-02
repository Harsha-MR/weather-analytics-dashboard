import authService from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { STATUS_CODES } from '../config/constants.js';
import logger from '../utils/logger.js';

/**
 * @desc    Google OAuth login
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const result = await authService.googleLogin(idToken);

    return successResponse(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      'Login successful',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Google login controller error:', error.message);
    return errorResponse(
      res,
      error.message || 'Google authentication failed',
      STATUS_CODES.UNAUTHORIZED
    );
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    return successResponse(
      res,
      {
        accessToken: result.accessToken,
        user: result.user,
      },
      'Token refreshed successfully',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Refresh token controller error:', error.message);
    return errorResponse(
      res,
      error.message || 'Token refresh failed',
      STATUS_CODES.UNAUTHORIZED
    );
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    // In a production app, you might want to:
    // 1. Invalidate refresh token in database
    // 2. Add token to blacklist
    // 3. Clear cookies

    return successResponse(
      res,
      null,
      'Logout successful',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Logout controller error:', error.message);
    return errorResponse(
      res,
      'Logout failed',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    return successResponse(
      res,
      { user: req.user },
      'User retrieved successfully',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Get current user controller error:', error.message);
    return errorResponse(
      res,
      'Failed to get user',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

export default {
  googleLogin,
  refreshToken,
  logout,
  getCurrentUser,
};
