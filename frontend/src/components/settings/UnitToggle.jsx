import { useSelector, useDispatch } from 'react-redux';
import { toggleTemperatureUnit, setTemperatureUnit } from '../../store/slices/settingsSlice';
import { TEMPERATURE_UNITS } from '../../utils/constants';

const UnitToggle = ({ compact = false }) => {
  const dispatch = useDispatch();
  const { temperatureUnit } = useSelector((state) => state.settings);

  const handleToggle = () => {
    dispatch(toggleTemperatureUnit());
  };

  const handleUnitClick = (unit) => {
    dispatch(setTemperatureUnit(unit));
  };

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white transition-colors"
        aria-label="Toggle temperature unit"
      >
        °{temperatureUnit}
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Temperature Unit:
      </span>
      <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
        <button
          onClick={() => handleUnitClick(TEMPERATURE_UNITS.CELSIUS)}
          className={`
            px-4 py-2 text-sm font-medium transition-colors
            ${
              temperatureUnit === TEMPERATURE_UNITS.CELSIUS
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          °C
        </button>
        <button
          onClick={() => handleUnitClick(TEMPERATURE_UNITS.FAHRENHEIT)}
          className={`
            px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600
            ${
              temperatureUnit === TEMPERATURE_UNITS.FAHRENHEIT
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          °F
        </button>
      </div>
    </div>
  );
};

export default UnitToggle;
