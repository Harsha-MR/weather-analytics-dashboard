import ForecastCard from './ForecastCard';
import { groupBy } from '../../utils/helpers';
import { Calendar } from 'lucide-react';

const DailyForecast = ({ forecastData }) => {
  if (!forecastData || !forecastData.list) return null;

  // Group forecasts by day and get one per day (around noon)
  const getDailyForecasts = () => {
    const grouped = groupBy(forecastData.list, (item) => {
      const date = new Date(item.dt * 1000);
      return date.toDateString();
    });

    return Object.values(grouped)
      .map((dayForecasts) => {
        // Find the forecast closest to noon (12:00)
        return dayForecasts.reduce((closest, current) => {
          const currentHour = new Date(current.dt * 1000).getHours();
          const closestHour = new Date(closest.dt * 1000).getHours();
          return Math.abs(currentHour - 12) < Math.abs(closestHour - 12)
            ? current
            : closest;
        });
      })
      .slice(0, 7); // Next 7 days
  };

  const dailyForecasts = getDailyForecasts();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          7-Day Forecast
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {dailyForecasts.map((day, index) => (
          <ForecastCard key={index} forecast={day} type="daily" />
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;
