import NodeCache from 'node-cache';
import logger from '../utils/logger.js';

// Create cache instance with default TTL of 5 minutes
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Don't clone data for better performance
});

/**
 * Get data from cache
 */
export const get = (key) => {
  try {
    const value = cache.get(key);
    if (value) {
      logger.info(`Cache HIT: ${key}`);
    } else {
      logger.info(`Cache MISS: ${key}`);
    }
    return value;
  } catch (error) {
    logger.error(`Cache GET error for key ${key}:`, error.message);
    return null;
  }
};

/**
 * Set data in cache
 */
export const set = (key, value, ttl = null) => {
  try {
    const success = ttl ? cache.set(key, value, ttl) : cache.set(key, value);
    if (success) {
      logger.info(`Cache SET: ${key} (TTL: ${ttl || 'default'})`);
    }
    return success;
  } catch (error) {
    logger.error(`Cache SET error for key ${key}:`, error.message);
    return false;
  }
};

/**
 * Delete data from cache
 */
export const del = (key) => {
  try {
    const count = cache.del(key);
    if (count > 0) {
      logger.info(`Cache DELETE: ${key}`);
    }
    return count;
  } catch (error) {
    logger.error(`Cache DELETE error for key ${key}:`, error.message);
    return 0;
  }
};

/**
 * Clear all cache
 */
export const flush = () => {
  try {
    cache.flushAll();
    logger.info('Cache FLUSHED');
    return true;
  } catch (error) {
    logger.error('Cache FLUSH error:', error.message);
    return false;
  }
};

/**
 * Check if key exists in cache
 */
export const has = (key) => {
  return cache.has(key);
};

/**
 * Get cache statistics
 */
export const getStats = () => {
  return cache.getStats();
};

/**
 * Get or set pattern - fetch from cache or compute and store
 */
export const getOrSet = async (key, fetchFunction, ttl = null) => {
  try {
    // Try to get from cache
    let value = get(key);

    if (value === undefined) {
      // Cache miss - fetch data
      logger.info(`Fetching fresh data for: ${key}`);
      value = await fetchFunction();

      // Store in cache
      set(key, value, ttl);
    }

    return value;
  } catch (error) {
    logger.error(`Cache getOrSet error for key ${key}:`, error.message);
    throw error;
  }
};

export default {
  get,
  set,
  del,
  flush,
  has,
  getStats,
  getOrSet,
};
