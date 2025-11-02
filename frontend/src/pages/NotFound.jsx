import { useNavigate } from 'react-router-dom';
import { Home, Search, CloudOff } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CloudOff className="h-32 w-32 text-gray-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-gray-600 dark:text-gray-300">
                404
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you're looking for seems to have drifted away like a cloud. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Search className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Or try these popular destinations:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['London', 'New York', 'Tokyo', 'Paris'].map((city) => (
              <button
                key={city}
                onClick={() => navigate(`/city/${encodeURIComponent(city)}`)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
