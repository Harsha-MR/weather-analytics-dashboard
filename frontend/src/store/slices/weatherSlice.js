import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentWeather: {},
  forecasts: {},
  hourlyForecasts: {},
  searchResults: [],
  loading: false,
  error: null,
  lastUpdated: {},
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCurrentWeather: (state, action) => {
      const { cityId, data } = action.payload;
      state.currentWeather[cityId] = data;
      state.lastUpdated[cityId] = Date.now();
      state.loading = false;
      state.error = null;
    },
    setForecast: (state, action) => {
      const { cityId, data } = action.payload;
      state.forecasts[cityId] = data;
      state.loading = false;
      state.error = null;
    },
    setHourlyForecast: (state, action) => {
      const { cityId, data } = action.payload;
      state.hourlyForecasts[cityId] = data;
      state.loading = false;
      state.error = null;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearWeatherData: (state, action) => {
      const cityId = action.payload;
      delete state.currentWeather[cityId];
      delete state.forecasts[cityId];
      delete state.hourlyForecasts[cityId];
      delete state.lastUpdated[cityId];
    },
    clearAllWeatherData: (state) => {
      state.currentWeather = {};
      state.forecasts = {};
      state.hourlyForecasts = {};
      state.lastUpdated = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCurrentWeather,
  setForecast,
  setHourlyForecast,
  setSearchResults,
  clearSearchResults,
  clearWeatherData,
  clearAllWeatherData,
  clearError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
