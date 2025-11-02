import { useSelector, useDispatch } from 'react-redux';
import { setTheme, toggleTheme } from '../../store/slices/settingsSlice';
import { THEMES } from '../../utils/constants';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeToggle = ({ compact = false, showLabel = true }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.settings);

  const themes = [
    { value: THEMES.LIGHT, icon: Sun, label: 'Light' },
    { value: THEMES.DARK, icon: Moon, label: 'Dark' },
    { value: THEMES.AUTO, icon: Monitor, label: 'Auto' },
  ];

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const handleThemeClick = (themeValue) => {
    dispatch(setTheme(themeValue));
  };

  if (compact) {
    const currentTheme = themes.find((t) => t.value === theme);
    const Icon = currentTheme?.icon || Sun;

    return (
      <button
        onClick={handleToggle}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
        aria-label="Toggle theme"
      >
        <Icon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="space-y-2">
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Theme:
        </span>
      )}
      <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.value;

          return (
            <button
              key={themeOption.value}
              onClick={() => handleThemeClick(themeOption.value)}
              className={`
                flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${themeOption.value !== THEMES.LIGHT ? 'border-l border-gray-300 dark:border-gray-600' : ''}
              `}
              aria-label={`Switch to ${themeOption.label} theme`}
            >
              <Icon className="h-4 w-4" />
              <span>{themeOption.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeToggle;
