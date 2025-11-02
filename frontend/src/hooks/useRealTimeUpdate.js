import { useEffect, useRef, useCallback } from 'react';

/**
 * Real-time update hook
 * Automatically refreshes data at specified interval
 */
const useRealTimeUpdate = (callback, interval = 60000, enabled = true) => {
  const savedCallback = useRef(callback);
  const intervalRef = useRef(null);

  // Update callback ref when it changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  /**
   * Start interval
   */
  const start = useCallback(() => {
    if (intervalRef.current) return; // Already running

    intervalRef.current = setInterval(() => {
      savedCallback.current();
    }, interval);
  }, [interval]);

  /**
   * Stop interval
   */
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Restart interval
   */
  const restart = useCallback(() => {
    stop();
    start();
  }, [stop, start]);

  /**
   * Setup and cleanup interval
   */
  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [enabled, start, stop]);

  return {
    start,
    stop,
    restart,
  };
};

export default useRealTimeUpdate;
