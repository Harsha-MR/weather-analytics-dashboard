import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { STATUS_CODES } from '../config/constants.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return errorResponse(
        res,
        'User not found',
        STATUS_CODES.NOT_FOUND
      );
    }

    return successResponse(
      res,
      { user },
      'Profile retrieved successfully',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Get profile error:', error.message);
    return errorResponse(
      res,
      'Failed to get profile',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(
        res,
        'User not found',
        STATUS_CODES.NOT_FOUND
      );
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    await user.save();

    return successResponse(
      res,
      { user },
      'Profile updated successfully',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Update profile error:', error.message);
    return errorResponse(
      res,
      'Failed to update profile',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * @desc    Update user preferences
 * @route   PUT /api/users/preferences
 * @access  Private
 */
export const updatePreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(
        res,
        'User not found',
        STATUS_CODES.NOT_FOUND
      );
    }

    // Update preferences
    if (preferences.temperatureUnit) {
      user.preferences.temperatureUnit = preferences.temperatureUnit;
    }
    if (preferences.theme) {
      user.preferences.theme = preferences.theme;
    }
    if (preferences.notifications !== undefined) {
      user.preferences.notifications = preferences.notifications;
    }

    await user.save();

    return successResponse(
      res,
      { preferences: user.preferences },
      'Preferences updated successfully',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Update preferences error:', error.message);
    return errorResponse(
      res,
      'Failed to update preferences',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/profile
 * @access  Private
 */
export const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(
        res,
        'User not found',
        STATUS_CODES.NOT_FOUND
      );
    }

    // Soft delete - mark as inactive
    user.isActive = false;
    await user.save();

    return successResponse(
      res,
      null,
      'Account deactivated successfully',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Delete account error:', error.message);
    return errorResponse(
      res,
      'Failed to delete account',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

export default {
  getProfile,
  updateProfile,
  updatePreferences,
  deleteAccount,
};
