import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getFormattedHour, getDayName } from '../../utils/dateFormatter';
import { getWindDirection } from '../../utils/helpers';
import ChartContainer from './ChartContainer';
import { Wind } from 'lucide-react';

const WindChart = ({ forecastData, type = 'hourly' }) => {
  if (!forecastData || !forecastData.list) {
    return (
      <ChartContainer title="Wind Speed & Direction" icon={Wind}>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </ChartContainer>
    );
  }

  // Prepare chart data
  const chartData = forecastData.list.slice(0, type === 'hourly' ? 8 : 40).map((item) => ({
    time: type === 'hourly' ? getFormattedHour(item.dt) : getDayName(item.dt),
    speed: item.wind?.speed?.toFixed(1) || 0,
    gust: item.wind?.gust?.toFixed(1) || 0,
    direction: getWindDirection(item.wind?.deg),
    deg: item.wind?.deg || 0,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {data.time}
          </p>
          <p className="text-xs text-blue-500">
            Speed: {data.speed} km/h
          </p>
          {data.gust > 0 && (
            <p className="text-xs text-purple-500">
              Gust: {data.gust} km/h
            </p>
          )}
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Direction: {data.direction} ({data.deg}°)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer title="Wind Speed & Direction" icon={Wind}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorGust" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
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
              value: 'Speed (km/h)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#9CA3AF' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="speed" 
            stroke="#3B82F6" 
            fillOpacity={1} 
            fill="url(#colorSpeed)"
            strokeWidth={2}
          />
          {chartData.some(d => d.gust > 0) && (
            <Area 
              type="monotone" 
              dataKey="gust" 
              stroke="#8B5CF6" 
              fillOpacity={1} 
              fill="url(#colorGust)"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default WindChart;
