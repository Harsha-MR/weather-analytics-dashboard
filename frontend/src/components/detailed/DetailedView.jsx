import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, RefreshCw, Star, MapPin } from 'lucide-react';
import * as weatherAPI from '../../services/weatherAPI';
import useFavorites from '../../hooks/useFavorites';
import Loader from '../common/Loader';
import WeatherStats from './WeatherStats';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import { formatTemperature, capitalize } from '../../utils/helpers';
import { getWeatherEmoji, getWeatherColor } from '../../utils/weatherIcons';
import { getRelativeTime } from '../../utils/dateFormatter';
import { useToast } from '../common/Toast';

const DetailedView = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const { temperatureUnit } = useSelector((state) => state.settings);
  const { isFavorited, toggleFavorite } = useFavorites();
  const { showSuccess, showError } = useToast();

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, [cityName]);

  const fetchWeatherData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        weatherAPI.getCurrentWeather(cityName),
        weatherAPI.getForecast(cityName),
      ]);

      setCurrentWeather(currentResponse.data);
      setForecast(forecastResponse.data);
      setLastUpdated(Date.now());
      
      if (isRefresh) {
        showSuccess('Weather data refreshed');
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      showError(error.message || 'Failed to load weather data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchWeatherData(true);
  };

  const handleFavoriteToggle = async () => {
    if (!currentWeather) return;

    try {
      await toggleFavorite({
        cityId: currentWeather.id?.toString(),
        cityName: currentWeather.name,
        country: currentWeather.country,
        coordinates: {
          lat: currentWeather.coordinates?.lat,
          lon: currentWeather.coordinates?.lon,
        },
      });
    } catch (error) {
      showError('Failed to update favorites');
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading weather data..." />;
  }

  if (!currentWeather) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            City not found
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 hover:text-blue-600"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const isFav = isFavorited(currentWeather.id?.toString());
  const weatherColor = getWeatherColor(currentWeather.weather?.icon);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
      {/* Header */}
      <div
        className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 shadow-lg"
        style={{ 
          background: `linear-gradient(135deg, ${weatherColor} 0%, ${weatherColor}dd 100%)` 
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors disabled:opacity-50"
                aria-label="Refresh"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleFavoriteToggle}
                className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star
                  className={`h-5 w-5 ${
                    isFav ? 'fill-yellow-400 text-yellow-400' : 'text-white'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* City Header */}
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-6 w-6" />
            <h1 className="text-4xl font-bold">{currentWeather.name}</h1>
            {currentWeather.country && (
              <span className="text-xl text-white text-opacity-80">
                {currentWeather.country}
              </span>
            )}
          </div>

          {/* Main Weather Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-7xl">
                {getWeatherEmoji(currentWeather.weather?.icon)}
              </div>
              <div>
                <div className="text-6xl font-bold mb-2">
                  {formatTemperature(currentWeather.temperature?.current, temperatureUnit)}
                </div>
                <div className="text-xl">
                  {capitalize(currentWeather.weather?.description)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-80 mb-2">
                H: {formatTemperature(currentWeather.temperature?.max, temperatureUnit)} • 
                L: {formatTemperature(currentWeather.temperature?.min, temperatureUnit)}
              </div>
              <div className="text-sm opacity-80">
                Feels like {formatTemperature(currentWeather.temperature?.feelsLike, temperatureUnit)}
              </div>
              {lastUpdated && (
                <div className="text-xs opacity-60 mt-2">
                  Updated {getRelativeTime(Math.floor(lastUpdated / 1000))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Weather Stats */}
        <WeatherStats weather={currentWeather} />

        {/* Hourly Forecast */}
        {forecast && <HourlyForecast forecastData={forecast} />}

        {/* Daily Forecast */}
        {forecast && <DailyForecast forecastData={forecast} />}
      </div>
    </div>
  );
};

export default DetailedView;
