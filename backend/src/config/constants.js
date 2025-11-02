// API Response Messages
export const MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
};

// HTTP Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  WEATHER_CURRENT: 300, // 5 minutes
  WEATHER_FORECAST: 1800, // 30 minutes
  CITY_SEARCH: 600, // 10 minutes
  USER_PROFILE: 3600, // 1 hour
};

// Rate Limiting
export const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // Max requests per window
  WEATHER_API_MAX: 60, // Max weather API calls per minute
};

// API Endpoints
export const API_ENDPOINTS = {
  OPENWEATHER: {
    CURRENT: '/weather',
    FORECAST: '/forecast',
    ONECALL: '/onecall',
  },
};

// Allowed Origins for CORS
export const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
];

// Temperature Units
export const TEMP_UNITS = {
  CELSIUS: 'metric',
  FAHRENHEIT: 'imperial',
  KELVIN: 'standard',
};

// Default Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// JWT
export const JWT_CONFIG = {
  ALGORITHM: 'HS256',
  ISSUER: 'weather-dashboard',
};

// MongoDB Collections
export const COLLECTIONS = {
  USERS: 'users',
  FAVORITES: 'favorites',
  WEATHER_CACHE: 'weathercache',
};

export default {
  MESSAGES,
  STATUS_CODES,
  CACHE_TTL,
  RATE_LIMITS,
  API_ENDPOINTS,
  ALLOWED_ORIGINS,
  TEMP_UNITS,
  PAGINATION,
  JWT_CONFIG,
  COLLECTIONS,
};
