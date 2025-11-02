import { TrendingUp, TrendingDown, Minus, Wind, Droplets, CloudRain } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatTemperature } from '../../utils/helpers';

const QuickStats = ({ weather }) => {
  const { temperatureUnit } = useSelector((state) => state.settings);

  if (!weather) return null;

  const getTempTrend = () => {
    const current = weather.temperature?.current;
    const max = weather.temperature?.max;
    const min = weather.temperature?.min;

    if (!current || !max || !min) return 'neutral';

    const avgTemp = (max + min) / 2;
    const diff = current - avgTemp;

    if (diff > 2) return 'rising';
    if (diff < -2) return 'falling';
    return 'stable';
  };

  const tempTrend = getTempTrend();

  const stats = [
    {
      label: 'Temperature',
      value: formatTemperature(weather.temperature?.current, temperatureUnit),
      icon: tempTrend === 'rising' ? TrendingUp : tempTrend === 'falling' ? TrendingDown : Minus,
      color: tempTrend === 'rising' ? 'text-red-500' : tempTrend === 'falling' ? 'text-blue-500' : 'text-gray-500',
      bgColor: tempTrend === 'rising' ? 'bg-red-50 dark:bg-red-900' : tempTrend === 'falling' ? 'bg-blue-50 dark:bg-blue-900' : 'bg-gray-50 dark:bg-gray-800',
    },
    {
      label: 'Wind Speed',
      value: `${weather.wind?.speed?.toFixed(1) || 0} km/h`,
      icon: Wind,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900',
    },
    {
      label: 'Humidity',
      value: `${weather.humidity || 0}%`,
      icon: Droplets,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900',
    },
    {
      label: 'Conditions',
      value: weather.weather?.main || 'N/A',
      icon: CloudRain,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg p-4 border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </span>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;
