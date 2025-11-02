import express from 'express';
import { weatherLimiter, searchLimiter } from '../middleware/rateLimiter.js';
import * as weatherController from '../controllers/weatherController.js';

const router = express.Router();

/**
 * @route   GET /api/weather/current/:city
 * @desc    Get current weather for a city
 * @access  Public
 */
router.get('/current/:city', weatherLimiter, weatherController.getCurrentWeather);

/**
 * @route   GET /api/weather/forecast/:city
 * @desc    Get 7-day weather forecast
 * @access  Public
 */
router.get('/forecast/:city', weatherLimiter, weatherController.getForecast);

/**
 * @route   GET /api/weather/hourly/:city
 * @desc    Get hourly weather forecast
 * @access  Public
 */
router.get('/hourly/:city', weatherLimiter, weatherController.getHourlyForecast);

/**
 * @route   GET /api/weather/search
 * @desc    Search cities
 * @access  Public
 */
router.get('/search', searchLimiter, weatherController.searchCities);

/**
 * @route   GET /api/weather/coords
 * @desc    Get weather by coordinates
 * @access  Public
 */
router.get('/coords', weatherLimiter, weatherController.getWeatherByCoords);

export default router;
