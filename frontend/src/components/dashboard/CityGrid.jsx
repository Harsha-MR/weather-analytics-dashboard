import { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';
import { SkeletonCard } from '../common/Loader';
import * as weatherAPI from '../../services/weatherAPI';
import { AlertCircle } from 'lucide-react';

const CityGrid = ({ cities = [] }) => {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch weather for each city
    cities.forEach((city) => {
      fetchCityWeather(city);
    });
  }, [cities]);

  const fetchCityWeather = async (city) => {
    const cityId = city.cityId || city.name;
    
    setLoading((prev) => ({ ...prev, [cityId]: true }));
    setErrors((prev) => ({ ...prev, [cityId]: null }));

    try {
      const response = await weatherAPI.getCurrentWeather(city.cityName || city.name);
      setWeatherData((prev) => ({
        ...prev,
        [cityId]: response.data,
      }));
    } catch (error) {
      console.error(`Failed to fetch weather for ${city.name}:`, error);
      setErrors((prev) => ({
        ...prev,
        [cityId]: error.message || 'Failed to load weather',
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [cityId]: false }));
    }
  };

  if (cities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No cities to display. Add some favorites to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cities.map((city) => {
        const cityId = city.cityId || city.name;
        const isLoading = loading[cityId];
        const error = errors[cityId];
        const weather = weatherData[cityId];

        if (isLoading) {
          return <SkeletonCard key={cityId} />;
        }

        if (error) {
          return (
            <div
              key={cityId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3 text-red-500 dark:text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{city.cityName || city.name}</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          );
        }

        if (weather) {
          return <WeatherCard key={cityId} weather={weather} />;
        }

        return null;
      })}
    </div>
  );
};

export default CityGrid;
