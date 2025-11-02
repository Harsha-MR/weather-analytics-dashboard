import apiClient from '../utils/apiClient.js';
import logger from '../utils/logger.js';

const OPENWEATHER_BASE_URL = process.env.OPENWEATHER_BASE_URL;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

/**
 * Get current weather for a city
 */
export const getCurrentWeather = async (city) => {
  try {
    const response = await apiClient.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });

    return response.data;
  } catch (error) {
    logger.error(`Error fetching current weather for ${city}:`, error.message);
    throw new Error(`Failed to fetch current weather: ${error.message}`);
  }
};

/**
 * Get weather forecast for a city (5 days, 3-hour intervals)
 */
export const getForecast = async (city) => {
  try {
    const response = await apiClient.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });

    return response.data;
  } catch (error) {
    logger.error(`Error fetching forecast for ${city}:`, error.message);
    throw new Error(`Failed to fetch forecast: ${error.message}`);
  }
};

/**
 * Get current weather by coordinates
 */
export const getCurrentWeatherByCoords = async (lat, lon) => {
  try {
    const response = await apiClient.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });

    return response.data;
  } catch (error) {
    logger.error(`Error fetching weather by coords (${lat}, ${lon}):`, error.message);
    throw new Error(`Failed to fetch weather: ${error.message}`);
  }
};

/**
 * Search cities by name (autocomplete)
 */
export const searchCities = async (query) => {
  try {
    const response = await apiClient.get(
      `http://api.openweathermap.org/geo/1.0/direct`,
      {
        params: {
          q: query,
          limit: 5,
          appid: OPENWEATHER_API_KEY,
        },
      }
    );

    return response.data.map((city) => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
      displayName: city.state
        ? `${city.name}, ${city.state}, ${city.country}`
        : `${city.name}, ${city.country}`,
    }));
  } catch (error) {
    logger.error(`Error searching cities with query "${query}":`, error.message);
    throw new Error(`Failed to search cities: ${error.message}`);
  }
};

/**
 * Get hourly forecast (48 hours)
 */
export const getHourlyForecast = async (city) => {
  try {
    // First get coordinates
    const currentWeather = await getCurrentWeather(city);
    const { lat, lon } = currentWeather.coord;

    // Get hourly data using One Call API (requires subscription)
    // For free tier, we'll use the 5-day forecast and extract hourly data
    const forecast = await getForecast(city);

    return {
      city: forecast.city,
      list: forecast.list.slice(0, 16), // Get next 48 hours (16 * 3-hour intervals)
    };
  } catch (error) {
    logger.error(`Error fetching hourly forecast for ${city}:`, error.message);
    throw new Error(`Failed to fetch hourly forecast: ${error.message}`);
  }
};

/**
 * Transform weather data to consistent format
 */
export const transformWeatherData = (data) => {
  return {
    id: data.id,
    name: data.name,
    country: data.sys?.country,
    coordinates: {
      lat: data.coord?.lat,
      lon: data.coord?.lon,
    },
    weather: {
      main: data.weather?.[0]?.main,
      description: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
    },
    temperature: {
      current: data.main?.temp,
      feelsLike: data.main?.feels_like,
      min: data.main?.temp_min,
      max: data.main?.temp_max,
    },
    humidity: data.main?.humidity,
    pressure: data.main?.pressure,
    visibility: data.visibility,
    wind: {
      speed: data.wind?.speed,
      direction: data.wind?.deg,
    },
    clouds: data.clouds?.all,
    sunrise: data.sys?.sunrise,
    sunset: data.sys?.sunset,
    timezone: data.timezone,
    timestamp: data.dt,
  };
};

export default {
  getCurrentWeather,
  getForecast,
  getCurrentWeatherByCoords,
  searchCities,
  getHourlyForecast,
  transformWeatherData,
};

// TEMP LOGS - remove after verifying
logger.info(`OpenWeather base: ${OPENWEATHER_BASE_URL || 'MISSING'}`);
logger.info(`OpenWeather key present: ${OPENWEATHER_API_KEY ? 'YES' : 'NO'}`);
