import { useRef } from 'react';
import ForecastCard from './ForecastCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HourlyForecast = ({ forecastData }) => {
  const scrollRef = useRef(null);

  if (!forecastData || !forecastData.list) return null;

  // Get next 24 hours (8 intervals of 3 hours)
  const hourlyData = forecastData.list.slice(0, 8);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Hourly Forecast
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hourlyData.map((hour, index) => (
          <ForecastCard key={index} forecast={hour} type="hourly" />
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
