import axios from 'axios';
import logger from './logger.js';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'; // ✅ FIXED

/**
 * Create axios instance for OpenWeatherMap API
 */
const weatherApiClient = axios.create({
  baseURL: OPENWEATHER_BASE_URL,
  timeout: 10000,
  params: {
    appid: OPENWEATHER_API_KEY,
    units: 'metric', // Use metric by default (Celsius)
  },
});

/**
 * Request interceptor
 */
weatherApiClient.interceptors.request.use(
  (config) => {
    logger.info(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    logger.error('API Request Error:', error.message);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 */
weatherApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      logger.error(`API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      logger.error('API Error: No response received');
    } else {
      logger.error(`API Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default weatherApiClient;
