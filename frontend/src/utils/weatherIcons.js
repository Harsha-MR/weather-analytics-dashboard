/**
 * Map weather condition codes to icons and descriptions
 */

export const weatherIconMap = {
  // Clear
  '01d': { emoji: '☀️', name: 'sunny', description: 'Clear sky', color: '#FDB813' },
  '01n': { emoji: '🌙', name: 'clear-night', description: 'Clear night', color: '#4A5568' },
  
  // Few clouds
  '02d': { emoji: '⛅', name: 'partly-cloudy', description: 'Few clouds', color: '#94A3B8' },
  '02n': { emoji: '☁️', name: 'partly-cloudy-night', description: 'Few clouds', color: '#64748B' },
  
  // Scattered clouds
  '03d': { emoji: '☁️', name: 'cloudy', description: 'Scattered clouds', color: '#94A3B8' },
  '03n': { emoji: '☁️', name: 'cloudy', description: 'Scattered clouds', color: '#64748B' },
  
  // Broken clouds
  '04d': { emoji: '☁️', name: 'overcast', description: 'Broken clouds', color: '#94A3B8' },
  '04n': { emoji: '☁️', name: 'overcast', description: 'Broken clouds', color: '#64748B' },
  
  // Shower rain
  '09d': { emoji: '🌧️', name: 'showers', description: 'Shower rain', color: '#3B82F6' },
  '09n': { emoji: '🌧️', name: 'showers', description: 'Shower rain', color: '#2563EB' },
  
  // Rain
  '10d': { emoji: '🌦️', name: 'rain', description: 'Rain', color: '#3B82F6' },
  '10n': { emoji: '🌧️', name: 'rain-night', description: 'Rain', color: '#2563EB' },
  
  // Thunderstorm
  '11d': { emoji: '⛈️', name: 'thunderstorm', description: 'Thunderstorm', color: '#8B5CF6' },
  '11n': { emoji: '⛈️', name: 'thunderstorm', description: 'Thunderstorm', color: '#7C3AED' },
  
  // Snow
  '13d': { emoji: '🌨️', name: 'snow', description: 'Snow', color: '#60A5FA' },
  '13n': { emoji: '🌨️', name: 'snow', description: 'Snow', color: '#3B82F6' },
  
  // Mist
  '50d': { emoji: '🌫️', name: 'mist', description: 'Mist', color: '#9CA3AF' },
  '50n': { emoji: '🌫️', name: 'mist', description: 'Mist', color: '#6B7280' },
};

/**
 * Get weather icon data by code
 */
export const getWeatherIcon = (code) => {
  return weatherIconMap[code] || weatherIconMap['01d'];
};

/**
 * Get weather emoji
 */
export const getWeatherEmoji = (code) => {
  return weatherIconMap[code]?.emoji || '🌤️';
};

/**
 * Get weather icon name
 */
export const getWeatherIconName = (code) => {
  return weatherIconMap[code]?.name || 'sunny';
};

/**
 * Get weather description
 */
export const getWeatherDescription = (code) => {
  return weatherIconMap[code]?.description || 'Clear sky';
};

/**
 * Get weather color
 */
export const getWeatherColor = (code) => {
  return weatherIconMap[code]?.color || '#3B82F6';
};

/**
 * Get icon by weather condition name
 */
export const getIconByCondition = (condition) => {
  const conditionLower = condition?.toLowerCase() || '';
  
  if (conditionLower.includes('clear')) return '☀️';
  if (conditionLower.includes('cloud')) return '☁️';
  if (conditionLower.includes('rain')) return '🌧️';
  if (conditionLower.includes('drizzle')) return '🌦️';
  if (conditionLower.includes('thunder')) return '⛈️';
  if (conditionLower.includes('snow')) return '🌨️';
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
  
  return '🌤️';
};

export default {
  weatherIconMap,
  getWeatherIcon,
  getWeatherEmoji,
  getWeatherIconName,
  getWeatherDescription,
  getWeatherColor,
  getIconByCondition,
};
