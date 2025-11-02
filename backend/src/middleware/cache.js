import cacheService from '../services/cacheService.js';
import logger from '../utils/logger.js';

/**
 * Cache middleware for GET requests
 */
export const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from URL and query params
    const cacheKey = `${req.originalUrl || req.url}`;

    try {
      // Try to get cached response
      const cachedResponse = cacheService.get(cacheKey);

      if (cachedResponse) {
        logger.info(`Serving cached response for: ${cacheKey}`);
        return res.status(200).json({
          ...cachedResponse,
          fromCache: true,
          timestamp: new Date().toISOString(),
        });
      }

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode === 200 && body.success) {
          cacheService.set(cacheKey, body, ttl);
          logger.info(`Cached response for: ${cacheKey} (TTL: ${ttl}s)`);
        }

        // Call original json function
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error(`Cache middleware error: ${error.message}`);
      next();
    }
  };
};

/**
 * Clear cache for specific patterns
 */
export const clearCacheMiddleware = (pattern) => {
  return (req, res, next) => {
    try {
      // Clear cache based on pattern or user
      if (pattern === 'user' && req.user) {
        // Clear user-specific cache
        const userCachePattern = `/api/favorites`;
        // In production, implement pattern-based cache deletion
        logger.info(`Clearing cache for user: ${req.user._id}`);
      }

      next();
    } catch (error) {
      logger.error(`Clear cache middleware error: ${error.message}`);
      next();
    }
  };
};

export default {
  cacheMiddleware,
  clearCacheMiddleware,
};
