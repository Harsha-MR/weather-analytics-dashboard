import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import weatherReducer from './slices/weatherSlice';
import favoritesReducer from './slices/favoritesSlice';
import settingsReducer from './slices/settingsSlice';
import apiMiddleware from './middleware/apiMiddleware';

/**
 * Configure Redux store
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['weather/setCurrentWeather', 'weather/setForecast'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.api', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['weather.lastUpdated'],
      },
    }).concat(apiMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
