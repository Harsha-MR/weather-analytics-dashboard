import Favorite from '../models/Favorite.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { STATUS_CODES } from '../config/constants.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get all favorites for user
 * @route   GET /api/favorites
 * @access  Private
 */
export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .sort({ order: 1 })
      .lean();

    return successResponse(
      res,
      { favorites, count: favorites.length },
      'Favorites retrieved successfully',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Get favorites error:', error.message);
    return errorResponse(
      res,
      'Failed to get favorites',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * @desc    Add city to favorites
 * @route   POST /api/favorites
 * @access  Private
 */
export const addFavorite = async (req, res, next) => {
  try {
    const { cityName, cityId, country, coordinates } = req.body;

    // Check if already exists
    const existingFavorite = await Favorite.findOne({
      userId: req.user._id,
      cityId,
    });

    if (existingFavorite) {
      return errorResponse(
        res,
        'City already in favorites',
        STATUS_CODES.CONFLICT
      );
    }

    // Get current max order
    const maxOrderFavorite = await Favorite.findOne({ userId: req.user._id })
      .sort({ order: -1 })
      .select('order');

    const newOrder = maxOrderFavorite ? maxOrderFavorite.order + 1 : 0;

    // Create favorite
    const favorite = await Favorite.create({
      userId: req.user._id,
      cityName,
      cityId,
      country,
      coordinates,
      order: newOrder,
    });

    return successResponse(
      res,
      { favorite },
      'City added to favorites',
      STATUS_CODES.CREATED
    );
  } catch (error) {
    logger.error('Add favorite error:', error.message);
    return errorResponse(
      res,
      error.message || 'Failed to add favorite',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * @desc    Remove city from favorites
 * @route   DELETE /api/favorites/:id
 * @access  Private
 */
export const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;

    const favorite = await Favorite.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!favorite) {
      return errorResponse(
        res,
        'Favorite not found',
        STATUS_CODES.NOT_FOUND
      );
    }

    await favorite.deleteOne();

    // Reorder remaining favorites
    await Favorite.updateMany(
      { userId: req.user._id, order: { $gt: favorite.order } },
      { $inc: { order: -1 } }
    );

    return successResponse(
      res,
      null,
      'City removed from favorites',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Remove favorite error:', error.message);
    return errorResponse(
      res,
      'Failed to remove favorite',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * @desc    Update favorites order
 * @route   PUT /api/favorites/order
 * @access  Private
 */
export const updateFavoritesOrder = async (req, res, next) => {
  try {
    const { favorites } = req.body;

    // Validate all favorites belong to user
    const favoriteIds = favorites.map((f) => f.cityId);
    const userFavorites = await Favorite.find({
      userId: req.user._id,
      cityId: { $in: favoriteIds },
    });

    if (userFavorites.length !== favorites.length) {
      return errorResponse(
        res,
        'Invalid favorites list',
        STATUS_CODES.BAD_REQUEST
      );
    }

    // Update order for each favorite
    const updatePromises = favorites.map((fav) =>
      Favorite.findOneAndUpdate(
        { userId: req.user._id, cityId: fav.cityId },
        { order: fav.order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    const updatedFavorites = await Favorite.find({ userId: req.user._id })
      .sort({ order: 1 })
      .lean();

    return successResponse(
      res,
      { favorites: updatedFavorites },
      'Favorites order updated',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Update favorites order error:', error.message);
    return errorResponse(
      res,
      'Failed to update favorites order',
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavoritesOrder,
};
