import { useSelector } from 'react-redux';
import { formatTemperature } from '../../utils/helpers';
import { getWeatherEmoji } from '../../utils/weatherIcons';
import { getDayName, getFormattedHour } from '../../utils/dateFormatter';
import { capitalize } from '../../utils/helpers';

const ForecastCard = ({ forecast, type = 'daily' }) => {
  const { temperatureUnit } = useSelector((state) => state.settings);

  if (!forecast) return null;

  const renderDailyForecast = () => (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {getDayName(forecast.dt)}
      </div>
      <div className="text-4xl mb-2">
        {getWeatherEmoji(forecast.weather?.[0]?.icon)}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
        {capitalize(forecast.weather?.[0]?.description)}
      </div>
      <div className="flex items-center space-x-2 text-sm">
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatTemperature(forecast.temp?.max || forecast.main?.temp_max, temperatureUnit)}
        </span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600 dark:text-gray-400">
          {formatTemperature(forecast.temp?.min || forecast.main?.temp_min, temperatureUnit)}
        </span>
      </div>
      {forecast.pop > 0 && (
        <div className="mt-2 text-xs text-blue-500">
          💧 {Math.round(forecast.pop * 100)}%
        </div>
      )}
    </div>
  );

  const renderHourlyForecast = () => (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors min-w-[100px]">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {getFormattedHour(forecast.dt)}
      </div>
      <div className="text-3xl mb-2">
        {getWeatherEmoji(forecast.weather?.[0]?.icon)}
      </div>
      <div className="text-lg font-bold text-gray-900 dark:text-white">
        {formatTemperature(forecast.temp || forecast.main?.temp, temperatureUnit)}
      </div>
      {forecast.pop > 0 && (
        <div className="mt-1 text-xs text-blue-500">
          💧 {Math.round(forecast.pop * 100)}%
        </div>
      )}
    </div>
  );

  return type === 'daily' ? renderDailyForecast() : renderHourlyForecast();
};

export default ForecastCard;
