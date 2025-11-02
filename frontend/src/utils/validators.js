/**
 * Input validation utilities
 */

/**
 * Validate city name
 */
export const isValidCityName = (city) => {
  if (!city || typeof city !== 'string') return false;
  if (city.trim().length < 2) return false;
  if (city.length > 50) return false;
  // Allow letters, spaces, hyphens, and apostrophes
  const regex = /^[a-zA-Z\s\-']+$/;
  return regex.test(city);
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate temperature unit
 */
export const isValidTemperatureUnit = (unit) => {
  return unit === 'C' || unit === 'F';
};

/**
 * Validate coordinates
 */
export const isValidCoordinates = (lat, lon) => {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
};

/**
 * Validate URL
 */
export const isValidURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

/**
 * Validate search query
 */
export const isValidSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return false;
  const trimmed = query.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate min length
 */
export const minLength = (value, min) => {
  if (typeof value !== 'string') return false;
  return value.trim().length >= min;
};

/**
 * Validate max length
 */
export const maxLength = (value, max) => {
  if (typeof value !== 'string') return false;
  return value.trim().length <= max;
};

/**
 * Validate number range
 */
export const inRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

export default {
  isValidCityName,
  isValidEmail,
  isValidTemperatureUnit,
  isValidCoordinates,
  isValidURL,
  sanitizeInput,
  isValidSearchQuery,
  isRequired,
  minLength,
  maxLength,
  inRange,
};
