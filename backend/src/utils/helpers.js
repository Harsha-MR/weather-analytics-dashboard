/**
 * Convert temperature between units
 */
export const convertTemperature = (temp, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return temp;

  // Convert to Celsius first
  let celsius = temp;
  if (fromUnit === 'F') {
    celsius = (temp - 32) * (5 / 9);
  } else if (fromUnit === 'K') {
    celsius = temp - 273.15;
  }

  // Convert from Celsius to target unit
  if (toUnit === 'F') {
    return (celsius * 9) / 5 + 32;
  } else if (toUnit === 'K') {
    return celsius + 273.15;
  }

  return celsius;
};

/**
 * Format date to ISO string
 */
export const formatDate = (date) => {
  return new Date(date).toISOString();
};

/**
 * Generate random string
 */
export const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Sleep/delay function
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Parse query parameters
 */
export const parseQueryParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Check if value is empty
 */
export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

export default {
  convertTemperature,
  formatDate,
  generateRandomString,
  sleep,
  parseQueryParams,
  sanitizeInput,
  isEmpty,
};
