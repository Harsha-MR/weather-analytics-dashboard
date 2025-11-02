import weatherService from '../services/weatherService.js';
import cacheService from '../services/cacheService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { STATUS_CODES, CACHE_TTL } from '../config/constants.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get current weather for a city
 * @route   GET /api/weather/current/:city
 * @access  Public
 */
export const getCurrentWeather = async (req, res, next) => {
  try {
    const { city } = req.params;
    const cacheKey = `weather:current:${city.toLowerCase()}`;

    // Try to get from cache
    const cachedData = await cacheService.getOrSet(
      cacheKey,
      async () => {
        const data = await weatherService.getCurrentWeather(city);
        return weatherService.transformWeatherData(data);
      },
      CACHE_TTL.WEATHER_CURRENT
    );

    return successResponse(
      res,
      cachedData,
      'Current weather retrieved successfully',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Get current weather error:', error.message);
    return errorResponse(
      res,
      error.message || 'Failed to fetch current weather',
      STATUS_CODES.BAD_REQUEST
    );
  }
};

/**
 * @desc    Get weather forecast for a city
 * @route   GET /api/weather/forecast/:city
 * @access  Public
 */
export const getForecast = async (req, res, next) => {
  try {
    const { city } = req.params;
    const cacheKey = `weather:forecast:${city.toLowerCase()}`;

    const cachedData = await cacheService.getOrSet(
      cacheKey,
      async () => {
        return await weatherService.getForecast(city);
      },
      CACHE_TTL.WEATHER_FORECAST
    );

    return successResponse(
      res,
      cachedData,
      'Weather forecast retrieved successfully',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Get forecast error:', error.message);
    return errorResponse(
      res,
      error.message || 'Failed to fetch weather forecast',
      STATUS_CODES.BAD_REQUEST
    );
  }
};

/**
 * @desc    Get hourly weather forecast
 * @route   GET /api/weather/hourly/:city
 * @access  Public
 */
export const getHourlyForecast = async (req, res, next) => {
  try {
    const { city } = req.params;
    const cacheKey = `weather:hourly:${city.toLowerCase()}`;

    const cachedData = await cacheService.getOrSet(
      cacheKey,
      async () => {
        return await weatherService.getHourlyForecast(city);
      },
      CACHE_TTL.WEATHER_FORECAST
    );

    return successResponse(
      res,
      cachedData,
      'Hourly forecast retrieved successfully',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Get hourly forecast error:', error.message);
    return errorResponse(
      res,
      error.message || 'Failed to fetch hourly forecast',
      STATUS_CODES.BAD_REQUEST
    );
  }
};

/**
 * @desc    Search cities (autocomplete)
 * @route   GET /api/weather/search?q=query
 * @access  Public
 */
export const searchCities = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return errorResponse(
        res,
        'Search query must be at least 2 characters',
        STATUS_CODES.BAD_REQUEST
      );
    }

    const cacheKey = `weather:search:${q.toLowerCase()}`;

    const cachedData = await cacheService.getOrSet(
      cacheKey,
      async () => {
        return await weatherService.searchCities(q);
      },
      CACHE_TTL.CITY_SEARCH
    );

    return successResponse(
      res,
      cachedData,
      'Cities found',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Search cities error:', error.message);
    return errorResponse(
      res,
      error.message || 'Failed to search cities',
      STATUS_CODES.BAD_REQUEST
    );
  }
};

/**
 * @desc    Get weather by coordinates
 * @route   GET /api/weather/coords?lat=xx&lon=xx
 * @access  Public
 */
export const getWeatherByCoords = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    const data = await weatherService.getCurrentWeatherByCoords(
      parseFloat(lat),
      parseFloat(lon)
    );

    const transformedData = weatherService.transformWeatherData(data);

    return successResponse(
      res,
      transformedData,
      'Weather retrieved successfully',
      STATUS_CODES.OK
    );
  } catch (error) {
    logger.error('Get weather by coords error:', error.message);
    return errorResponse(
      res,
      error.message || 'Failed to fetch weather',
      STATUS_CODES.BAD_REQUEST
    );
  }
};

export default {
  getCurrentWeather,
  getForecast,
  getHourlyForecast,
  searchCities,
  getWeatherByCoords,
};
