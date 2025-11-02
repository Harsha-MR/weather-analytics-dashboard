import express from 'express';
import weatherController from '../controllers/weatherController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validator.js';
import { weatherLimiter, searchLimiter } from '../middleware/rateLimiter.js';
import { cacheMiddleware } from '../middleware/cache.js';
import {
  validateCityParam,
  validateSearchQuery,
  validateCoordinates,
} from '../validators/weatherValidator.js';

const router = express.Router();

// All weather routes are public but can benefit from auth (for personalization)
router.get(
  '/current/:city',
  weatherLimiter,
  optionalAuth,
  validateCityParam,
  validate,
  cacheMiddleware(300), // Cache for 5 minutes
  weatherController.getCurrentWeather
);

router.get(
  '/forecast/:city',
  weatherLimiter,
  optionalAuth,
  validateCityParam,
  validate,
  cacheMiddleware(1800), // Cache for 30 minutes
  weatherController.getForecast
);

router.get(
  '/hourly/:city',
  weatherLimiter,
  optionalAuth,
  validateCityParam,
  validate,
  cacheMiddleware(1800),
  weatherController.getHourlyForecast
);

router.get(
  '/search',
  searchLimiter,
  optionalAuth,
  validateSearchQuery,
  validate,
  cacheMiddleware(600), // Cache for 10 minutes
  weatherController.searchCities
);

router.get(
  '/coords',
  weatherLimiter,
  optionalAuth,
  validateCoordinates,
  validate,
  weatherController.getWeatherByCoords
);

export default router;
