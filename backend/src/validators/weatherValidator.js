import { param, query } from 'express-validator';

/**
 * Validate city name parameter
 */
export const validateCityParam = [
  param('city')
    .notEmpty()
    .withMessage('City name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('City name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('City name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),
];

/**
 * Validate coordinates
 */
export const validateCoordinates = [
  query('lat')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('lon')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
];

/**
 * Validate search query
 */
export const validateSearchQuery = [
  query('q')
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Search query must be between 2 and 50 characters')
    .trim(),
];

/**
 * Validate temperature unit
 */
export const validateUnit = [
  query('unit')
    .optional()
    .isIn(['metric', 'imperial', 'standard'])
    .withMessage('Unit must be metric, imperial, or standard'),
];

export default {
  validateCityParam,
  validateCoordinates,
  validateSearchQuery,
  validateUnit,
};
