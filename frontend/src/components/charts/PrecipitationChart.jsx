import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFormattedHour, getDayName } from '../../utils/dateFormatter';
import ChartContainer from './ChartContainer';
import { CloudRain } from 'lucide-react';

const PrecipitationChart = ({ forecastData, type = 'hourly' }) => {
  if (!forecastData || !forecastData.list) {
    return (
      <ChartContainer title="Precipitation Probability" icon={CloudRain}>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </ChartContainer>
    );
  }

  // Prepare chart data
  const chartData = forecastData.list.slice(0, type === 'hourly' ? 8 : 40).map((item) => ({
    time: type === 'hourly' ? getFormattedHour(item.dt) : getDayName(item.dt),
    precipitation: Math.round((item.pop || 0) * 100),
    humidity: item.main.humidity,
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
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer title="Precipitation Probability" icon={CloudRain}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
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
              value: 'Percentage (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#9CA3AF' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Bar 
            dataKey="precipitation" 
            fill="#3B82F6" 
            name="Precipitation"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="humidity" 
            fill="#06B6D4" 
            name="Humidity"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PrecipitationChart;
