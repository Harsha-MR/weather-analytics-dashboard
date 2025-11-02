// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    GOOGLE_LOGIN: '/auth/google',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  // Weather
  WEATHER: {
    CURRENT: (city) => `/weather/current/${city}`,
    FORECAST: (city) => `/weather/forecast/${city}`,
    HOURLY: (city) => `/weather/hourly/${city}`,
    SEARCH: '/weather/search',
    COORDS: '/weather/coords',
  },
  // User
  USER: {
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
  },
  // Favorites
  FAVORITES: {
    BASE: '/favorites',
    DELETE: (id) => `/favorites/${id}`,
    ORDER: '/favorites/order',
  },
};

// Temperature Units
export const TEMPERATURE_UNITS = {
  CELSIUS: 'C',
  FAHRENHEIT: 'F',
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

// Routes
export const ROUTES = {
  HOME: '/',
  CITY_DETAIL: '/city/:cityName',
  LOGIN: '/login',
  PROFILE: '/profile',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'weather_auth_token',
  REFRESH_TOKEN: 'weather_refresh_token',
  USER: 'weather_user',
  FAVORITES: 'weather_favorites',
  SETTINGS: 'weather_settings',
  THEME: 'weather_theme',
};

// Cache Duration (milliseconds)
export const CACHE_DURATION = {
  WEATHER_CURRENT: 5 * 60 * 1000, // 5 minutes
  WEATHER_FORECAST: 30 * 60 * 1000, // 30 minutes
  SEARCH: 10 * 60 * 1000, // 10 minutes
};

// Default Settings
export const DEFAULT_SETTINGS = {
  temperatureUnit: TEMPERATURE_UNITS.CELSIUS,
  theme: THEMES.AUTO,
  notifications: true,
  refreshInterval: 60000, // 1 minute
};

// Weather Conditions
export const WEATHER_CONDITIONS = {
  CLEAR: 'Clear',
  CLOUDS: 'Clouds',
  RAIN: 'Rain',
  DRIZZLE: 'Drizzle',
  THUNDERSTORM: 'Thunderstorm',
  SNOW: 'Snow',
  MIST: 'Mist',
  FOG: 'Fog',
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#8b5cf6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
};

// Debounce Delays
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  SCROLL: 150,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  FORECAST_DAYS: 7,
  HOURLY_HOURS: 24,
};

// Status
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  TEMPERATURE_UNITS,
  THEMES,
  ROUTES,
  STORAGE_KEYS,
  CACHE_DURATION,
  DEFAULT_SETTINGS,
  WEATHER_CONDITIONS,
  CHART_COLORS,
  DEBOUNCE_DELAYS,
  PAGINATION,
  STATUS,
};
