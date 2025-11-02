import { useState, useEffect, useCallback } from 'react';
import * as weatherAPI from '../services/weatherAPI';
import { CACHE_DURATION } from '../utils/constants';
import { isDataStale } from '../utils/helpers';

/**
 * Weather data hook
 * Handles fetching and caching weather data
 */
const useWeatherData = (city, type = 'current') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  /**
   * Fetch weather data
   */
  const fetchWeatherData = useCallback(async (forceRefresh = false) => {
    if (!city) return;

    // Check cache first
    if (!forceRefresh && lastFetch && !isDataStale(lastFetch, CACHE_DURATION.WEATHER_CURRENT)) {
      return; // Use cached data
    }

    setLoading(true);
    setError(null);

    try {
      let response;

      switch (type) {
        case 'current':
          response = await weatherAPI.getCurrentWeather(city);
          break;
        case 'forecast':
          response = await weatherAPI.getForecast(city);
          break;
        case 'hourly':
          response = await weatherAPI.getHourlyForecast(city);
          break;
        default:
          response = await weatherAPI.getCurrentWeather(city);
      }

      setData(response.data);
      setLastFetch(Date.now());
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [city, type, lastFetch]);

  /**
   * Refresh data
   */
  const refresh = useCallback(() => {
    fetchWeatherData(true);
  }, [fetchWeatherData]);

  /**
   * Fetch on mount and when city/type changes
   */
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return {
    data,
    loading,
    error,
    refresh,
    lastFetch,
  };
};

export default useWeatherData;
