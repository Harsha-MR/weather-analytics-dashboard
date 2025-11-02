import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import LoginButton from '../components/auth/LoginButton';
import { CloudRain, Shield, Star, TrendingUp } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Logo & Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CloudRain className="h-12 w-12 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                WeatherHub
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to access your personalized weather dashboard
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <LoginButton fullWidth />

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              Why Sign In?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Save Favorite Cities
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Quick access to your most-watched locations
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Personalized Dashboard
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Customized view of your weather preferences
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Sync Across Devices
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Access your data from anywhere
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Continue Without Login */}
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Continue without signing in →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
