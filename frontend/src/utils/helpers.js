import { TEMPERATURE_UNITS } from './constants';

/**
 * Convert temperature between Celsius and Fahrenheit
 */
export const convertTemperature = (temp, unit) => {
  if (!temp && temp !== 0) return null;
  
  if (unit === TEMPERATURE_UNITS.FAHRENHEIT) {
    return Math.round((temp * 9/5) + 32);
  }
  return Math.round(temp);
};

/**
 * Format temperature with unit symbol
 */
export const formatTemperature = (temp, unit = TEMPERATURE_UNITS.CELSIUS) => {
  const converted = convertTemperature(temp, unit);
  return converted !== null ? `${converted}°${unit}` : '--°';
};

/**
 * Capitalize first letter of each word
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format date to readable string
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format time to readable string
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  
  return `${formatDate(timestamp)} at ${formatTime(timestamp)}`;
};

/**
 * Get wind direction from degrees
 */
export const getWindDirection = (degrees) => {
  if (!degrees && degrees !== 0) return 'N/A';
  
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

/**
 * Format wind speed
 */
export const formatWindSpeed = (speed, unit = 'metric') => {
  if (!speed && speed !== 0) return 'N/A';
  
  const roundedSpeed = Math.round(speed);
  return unit === 'metric' ? `${roundedSpeed} km/h` : `${roundedSpeed} mph`;
};

/**
 * Get humidity level description
 */
export const getHumidityLevel = (humidity) => {
  if (!humidity && humidity !== 0) return 'N/A';
  
  if (humidity < 30) return 'Low';
  if (humidity < 60) return 'Moderate';
  return 'High';
};

/**
 * Get UV index level
 */
export const getUVIndexLevel = (uv) => {
  if (!uv && uv !== 0) return 'N/A';
  
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very High';
  return 'Extreme';
};

/**
 * Get visibility description
 */
export const formatVisibility = (visibility) => {
  if (!visibility && visibility !== 0) return 'N/A';
  
  const km = (visibility / 1000).toFixed(1);
  return `${km} km`;
};

/**
 * Format pressure
 */
export const formatPressure = (pressure) => {
  if (!pressure) return 'N/A';
  return `${pressure} hPa`;
};

/**
 * Check if data is stale
 */
export const isDataStale = (timestamp, maxAge) => {
  if (!timestamp) return true;
  return Date.now() - timestamp > maxAge;
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const now = Date.now();
  const diff = now - (timestamp * 1000);
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

/**
 * Truncate text
 */
export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Clamp number between min and max
 */
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Check if value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export default {
  convertTemperature,
  formatTemperature,
  capitalize,
  formatDate,
  formatTime,
  formatDateTime,
  getWindDirection,
  formatWindSpeed,
  getHumidityLevel,
  getUVIndexLevel,
  formatVisibility,
  formatPressure,
  isDataStale,
  getRelativeTime,
  truncate,
  generateId,
  groupBy,
  clamp,
  isEmpty,
};
