import { Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Cloud, Compass } from 'lucide-react';
import { useSelector } from 'react-redux';
import { 
  formatTemperature, 
  getWindDirection, 
  formatTime,
  formatPressure,
  formatVisibility,
  getHumidityLevel 
} from '../../utils/helpers';

const WeatherStats = ({ weather }) => {
  const { temperatureUnit } = useSelector((state) => state.settings);

  if (!weather) return null;

  const stats = [
    {
      icon: Wind,
      label: 'Wind',
      value: `${weather.wind?.speed?.toFixed(1) || 0} km/h`,
      subtitle: getWindDirection(weather.wind?.direction),
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900',
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.humidity || 0}%`,
      subtitle: getHumidityLevel(weather.humidity),
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: formatVisibility(weather.visibility),
      subtitle: weather.visibility > 10000 ? 'Clear' : 'Moderate',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900',
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: formatPressure(weather.pressure),
      subtitle: weather.pressure > 1013 ? 'High' : 'Low',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900',
    },
    {
      icon: Cloud,
      label: 'Cloudiness',
      value: `${weather.clouds || 0}%`,
      subtitle: weather.clouds > 50 ? 'Cloudy' : 'Clear',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
    },
    {
      icon: Compass,
      label: 'Feels Like',
      value: formatTemperature(weather.temperature?.feelsLike, temperatureUnit),
      subtitle: 'Apparent temp',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900',
    },
  ];

  if (weather.sunrise || weather.sunset) {
    stats.push(
      {
        icon: Sunrise,
        label: 'Sunrise',
        value: formatTime(weather.sunrise),
        subtitle: 'Dawn',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900',
      },
      {
        icon: Sunset,
        label: 'Sunset',
        value: formatTime(weather.sunset),
        subtitle: 'Dusk',
        color: 'text-pink-500',
        bgColor: 'bg-pink-50 dark:bg-pink-900',
      }
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg bg-white dark:bg-gray-800`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stat.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherStats;
