import { useState } from 'react';
import { User, Star, Settings as SettingsIcon } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import FavoritesList from '../components/dashboard/FavoritesList';
import SettingsPanel from '../components/settings/SettingsPanel';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const ProfileContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites');

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center space-x-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-20 w-20 rounded-full"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">
                  Active
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors
                      ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'favorites' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Favorite Cities
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your saved locations for quick weather access
                  </p>
                </div>
                <FavoritesList />
              </div>
            )}

            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
};

export default Profile;
