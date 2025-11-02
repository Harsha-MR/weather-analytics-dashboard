import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Weather API service
 */

/**
 * Get current weather for a city
 */
export const getCurrentWeather = async (city) => {
  try {
    const response = await api.get(API_ENDPOINTS.WEATHER.CURRENT(city));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get weather forecast for a city
 */
export const getForecast = async (city) => {
  try {
    const response = await api.get(API_ENDPOINTS.WEATHER.FORECAST(city));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get hourly forecast for a city
 */
export const getHourlyForecast = async (city) => {
  try {
    const response = await api.get(API_ENDPOINTS.WEATHER.HOURLY(city));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search cities (autocomplete)
 */
export const searchCities = async (query) => {
  try {
    const response = await api.get(API_ENDPOINTS.WEATHER.SEARCH, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get weather by coordinates
 */
export const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await api.get(API_ENDPOINTS.WEATHER.COORDS, {
      params: { lat, lon },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getCurrentWeather,
  getForecast,
  getHourlyForecast,
  searchCities,
  getWeatherByCoords,
};
