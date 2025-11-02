import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFavorites from '../hooks/useFavorites';
import useAuth from '../hooks/useAuth';
import CityGrid from '../components/dashboard/CityGrid';
import FavoritesList from '../components/dashboard/FavoritesList';
import UnitToggle from '../components/settings/UnitToggle';
import { CloudRain, Star, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { favorites, fetchFavorites } = useFavorites();
  const [defaultCities] = useState([
    { name: 'London', cityId: 'london' },
    { name: 'New York', cityId: 'newyork' },
    { name: 'Tokyo', cityId: 'tokyo' },
    { name: 'Paris', cityId: 'paris' },
    { name: 'Mumbai', cityId: 'mumbai' },
    { name: 'Dubai', cityId: 'dubai' },
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const citiesToDisplay = isAuthenticated && favorites.length > 0 
    ? favorites 
    : defaultCities;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <CloudRain className="h-10 w-10" />
                <h1 className="text-4xl font-bold">Weather Dashboard</h1>
              </div>
              <p className="text-lg text-white text-opacity-90">
                Real-time weather updates and forecasts for your favorite cities
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <UnitToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Weather Grid */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isAuthenticated && favorites.length > 0 
                      ? 'Your Favorites' 
                      : 'Popular Cities'}
                  </h2>
                </div>
                {!isAuthenticated && (
                  <button
                    onClick={() => navigate('/login')}
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Sign in to save favorites
                  </button>
                )}
              </div>
              <CityGrid cities={citiesToDisplay} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {/* Favorites List */}
              {isAuthenticated && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Quick Access
                    </h3>
                  </div>
                  <FavoritesList limit={5} />
                </div>
              )}

              {/* Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  About Weather Hub
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Get accurate weather data and forecasts powered by OpenWeatherMap API. 
                  Track multiple cities, view detailed analytics, and stay informed about weather conditions worldwide.
                </p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">✓</span>
                    <span>Real-time weather updates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">✓</span>
                    <span>7-day forecasts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">✓</span>
                    <span>Detailed weather statistics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">✓</span>
                    <span>Interactive charts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
