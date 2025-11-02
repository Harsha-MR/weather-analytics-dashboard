/**
 * Date formatting utilities
 */

/**
 * Format date for display
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time for display
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
 * Get day name from timestamp
 */
export const getDayName = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Get full day name from timestamp
 */
export const getFullDayName = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

/**
 * Get month name from timestamp
 */
export const getMonthName = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'long' });
};

/**
 * Get hour from timestamp
 */
export const getHour = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.getHours();
};

/**
 * Get formatted hour (12-hour format)
 */
export const getFormattedHour = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });
};

/**
 * Check if timestamp is today
 */
export const isToday = (timestamp) => {
  if (!timestamp) return false;
  
  const date = new Date(timestamp * 1000);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if timestamp is tomorrow
 */
export const isTomorrow = (timestamp) => {
  if (!timestamp) return false;
  
  const date = new Date(timestamp * 1000);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

/**
 * Get relative day (Today, Tomorrow, or day name)
 */
export const getRelativeDay = (timestamp) => {
  if (!timestamp) return '';
  
  if (isToday(timestamp)) return 'Today';
  if (isTomorrow(timestamp)) return 'Tomorrow';
  return getDayName(timestamp);
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
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

/**
 * Format date for API (ISO string)
 */
export const formatDateForAPI = (date) => {
  return new Date(date).toISOString();
};

/**
 * Parse API date to timestamp
 */
export const parseAPIDate = (dateString) => {
  return Math.floor(new Date(dateString).getTime() / 1000);
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  getDayName,
  getFullDayName,
  getMonthName,
  getHour,
  getFormattedHour,
  isToday,
  isTomorrow,
  getRelativeDay,
  getRelativeTime,
  formatDateForAPI,
  parseAPIDate,
};
