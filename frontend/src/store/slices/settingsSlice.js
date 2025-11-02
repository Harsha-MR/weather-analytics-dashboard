import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, TEMPERATURE_UNITS, THEMES, DEFAULT_SETTINGS } from '../../utils/constants';

// Load settings from localStorage
const loadSettings = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
};

const initialState = {
  ...loadSettings(),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTemperatureUnit: (state, action) => {
      state.temperatureUnit = action.payload;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state));
    },
    toggleTemperatureUnit: (state) => {
      state.temperatureUnit = 
        state.temperatureUnit === TEMPERATURE_UNITS.CELSIUS 
          ? TEMPERATURE_UNITS.FAHRENHEIT 
          : TEMPERATURE_UNITS.CELSIUS;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state));
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state));
      
      // Apply theme to document
      if (action.payload === THEMES.DARK) {
        document.documentElement.classList.add('dark');
      } else if (action.payload === THEMES.LIGHT) {
        document.documentElement.classList.remove('dark');
      } else {
        // Auto - use system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    toggleTheme: (state) => {
      const themes = [THEMES.LIGHT, THEMES.DARK, THEMES.AUTO];
      const currentIndex = themes.indexOf(state.theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      state.theme = themes[nextIndex];
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state));
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state));
    },
    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state));
    },
    updateSettings: (state, action) => {
      Object.assign(state, action.payload);
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state));
    },
    resetSettings: (state) => {
      Object.assign(state, DEFAULT_SETTINGS);
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state));
    },
  },
});

export const {
  setTemperatureUnit,
  toggleTemperatureUnit,
  setTheme,
  toggleTheme,
  setNotifications,
  setRefreshInterval,
  updateSettings,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
