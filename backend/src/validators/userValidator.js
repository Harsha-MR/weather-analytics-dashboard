import { body } from 'express-validator';

/**
 * Validate user preferences update
 */
export const validatePreferences = [
  body('preferences.temperatureUnit')
    .optional()
    .isIn(['C', 'F'])
    .withMessage('Temperature unit must be C or F'),
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto'),
  body('preferences.notifications')
    .optional()
    .isBoolean()
    .withMessage('Notifications must be a boolean'),
];

/**
 * Validate profile update
 */
export const validateProfileUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
];

/**
 * Validate favorite city
 */
export const validateFavoriteCity = [
  body('cityName')
    .notEmpty()
    .withMessage('City name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('City name must be between 2 and 50 characters')
    .trim(),
  body('cityId')
    .notEmpty()
    .withMessage('City ID is required')
    .isString()
    .withMessage('City ID must be a string'),
  body('country')
    .optional()
    .isString()
    .withMessage('Country must be a string')
    .trim(),
  body('coordinates.lat')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('coordinates.lon')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
];

/**
 * Validate favorite order update
 */
export const validateFavoriteOrder = [
  body('favorites')
    .isArray({ min: 1 })
    .withMessage('Favorites must be a non-empty array'),
  body('favorites.*.cityId')
    .notEmpty()
    .withMessage('Each favorite must have a cityId'),
  body('favorites.*.order')
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];

export default {
  validatePreferences,
  validateProfileUpdate,
  validateFavoriteCity,
  validateFavoriteOrder,
};
