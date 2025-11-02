import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, MapPin, Wind, Droplets, Eye, Gauge } from 'lucide-react';
import { formatTemperature, getWindDirection } from '../../utils/helpers';
import { getWeatherEmoji } from '../../utils/weatherIcons';
import { capitalize } from '../../utils/helpers';
import useFavorites from '../../hooks/useFavorites';

const WeatherCard = ({ weather, showFavorite = true }) => {
  const navigate = useNavigate();
  const { temperatureUnit } = useSelector((state) => state.settings);
  const { isFavorited, toggleFavorite } = useFavorites();

  if (!weather) return null;

  const isFav = isFavorited(weather.id?.toString());

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    try {
      await toggleFavorite({
        cityId: weather.id?.toString(),
        cityName: weather.name,
        country: weather.country,
        coordinates: {
          lat: weather.coordinates?.lat,
          lon: weather.coordinates?.lon,
        },
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleCardClick = () => {
    navigate(`/city/${encodeURIComponent(weather.name)}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {weather.name}
              </h3>
            </div>
            {weather.country && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {weather.country}
              </p>
            )}
          </div>
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`h-5 w-5 ${
                  isFav
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                }`}
              />
            </button>
          )}
        </div>

        {/* Main Weather Info */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {formatTemperature(weather.temperature?.current, temperatureUnit)}
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <span className="text-4xl">
                {getWeatherEmoji(weather.weather?.icon)}
              </span>
              <span className="text-sm">
                {capitalize(weather.weather?.description)}
              </span>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500 dark:text-gray-400">
            <div>H: {formatTemperature(weather.temperature?.max, temperatureUnit)}</div>
            <div>L: {formatTemperature(weather.temperature?.min, temperatureUnit)}</div>
            <div className="mt-2">
              Feels like {formatTemperature(weather.temperature?.feelsLike, temperatureUnit)}
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-gray-400" />
            <div className="text-sm">
              <div className="text-gray-500 dark:text-gray-400">Wind</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {weather.wind?.speed?.toFixed(1)} km/h {getWindDirection(weather.wind?.direction)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-gray-400" />
            <div className="text-sm">
              <div className="text-gray-500 dark:text-gray-400">Humidity</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {weather.humidity}%
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-400" />
            <div className="text-sm">
              <div className="text-gray-500 dark:text-gray-400">Visibility</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A'} km
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Gauge className="h-4 w-4 text-gray-400" />
            <div className="text-sm">
              <div className="text-gray-500 dark:text-gray-400">Pressure</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {weather.pressure} hPa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
