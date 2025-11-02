import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { convertTemperature } from '../../utils/helpers';
import { getFormattedHour, getDayName } from '../../utils/dateFormatter';
import ChartContainer from './ChartContainer';
import { TrendingUp } from 'lucide-react';

const TemperatureChart = ({ forecastData, type = 'hourly' }) => {
  const { temperatureUnit } = useSelector((state) => state.settings);

  if (!forecastData || !forecastData.list) {
    return (
      <ChartContainer title="Temperature Trends" icon={TrendingUp}>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </ChartContainer>
    );
  }

  // Prepare chart data
  const chartData = forecastData.list.slice(0, type === 'hourly' ? 8 : 40).map((item) => ({
    time: type === 'hourly' ? getFormattedHour(item.dt) : getDayName(item.dt),
    temperature: convertTemperature(item.main.temp, temperatureUnit),
    feelsLike: convertTemperature(item.main.feels_like, temperatureUnit),
    max: convertTemperature(item.main.temp_max, temperatureUnit),
    min: convertTemperature(item.main.temp_min, temperatureUnit),
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {payload[0].payload.time}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}°{temperatureUnit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer title="Temperature Trends" icon={TrendingUp}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            label={{ 
              value: `Temperature (°${temperatureUnit})`, 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#9CA3AF' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Actual"
            dot={{ fill: '#3B82F6', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="feelsLike" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Feels Like"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TemperatureChart;
