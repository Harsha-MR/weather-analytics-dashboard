import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setNotifications, 
  setRefreshInterval,
  resetSettings 
} from '../../store/slices/settingsSlice';
import UnitToggle from './UnitToggle';
import ThemeToggle from './ThemeToggle';
import { ConfirmModal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { Bell, RefreshCw, RotateCcw, Save } from 'lucide-react';

const SettingsPanel = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const [showResetModal, setShowResetModal] = useState(false);
  const { showSuccess } = useToast();

  const refreshIntervalOptions = [
    { value: 30000, label: '30 seconds' },
    { value: 60000, label: '1 minute' },
    { value: 120000, label: '2 minutes' },
    { value: 300000, label: '5 minutes' },
  ];

  const handleNotificationToggle = () => {
    dispatch(setNotifications(!settings.notifications));
    showSuccess(
      settings.notifications 
        ? 'Notifications disabled' 
        : 'Notifications enabled'
    );
  };

  const handleRefreshIntervalChange = (e) => {
    const value = parseInt(e.target.value);
    dispatch(setRefreshInterval(value));
    showSuccess('Refresh interval updated');
  };

  const handleResetSettings = () => {
    dispatch(resetSettings());
    setShowResetModal(false);
    showSuccess('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h2>
        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset to Defaults</span>
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h3>
          <div className="space-y-4">
            <ThemeToggle showLabel />
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <UnitToggle />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notifications
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Push Notifications
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive alerts for severe weather
                </p>
              </div>
            </div>
            <button
              onClick={handleNotificationToggle}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.notifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
              `}
              aria-label="Toggle notifications"
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.notifications ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Data & Sync */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data & Sync
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div className="flex-1">
                <label
                  htmlFor="refresh-interval"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  Auto-refresh Interval
                </label>
                <select
                  id="refresh-interval"
                  value={settings.refreshInterval}
                  onChange={handleRefreshIntervalChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {refreshIntervalOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-3">
            Current Settings
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700 dark:text-blue-300">Theme:</span>
              <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
                {settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}
              </span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300">Unit:</span>
              <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
                °{settings.temperatureUnit}
              </span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300">Notifications:</span>
              <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
                {settings.notifications ? 'On' : 'Off'}
              </span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300">Refresh:</span>
              <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
                {refreshIntervalOptions.find(o => o.value === settings.refreshInterval)?.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetSettings}
        title="Reset Settings"
        message="Are you sure you want to reset all settings to their default values? This action cannot be undone."
        confirmText="Reset"
        type="warning"
      />
    </div>
  );
};

export default SettingsPanel;
