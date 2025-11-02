import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';

const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
      state.loading = false;
      state.error = null;
      
      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(action.payload));
    },
    addFavoriteSuccess: (state, action) => {
      state.favorites.push(action.payload);
      state.loading = false;
      state.error = null;
      
      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
    },
    removeFavoriteSuccess: (state, action) => {
      state.favorites = state.favorites.filter(
        (fav) => fav._id !== action.payload
      );
      state.loading = false;
      state.error = null;
      
      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
    },
    updateFavoriteOrder: (state, action) => {
      state.favorites = action.payload;
      
      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(action.payload));
    },
    clearFavorites: (state) => {
      state.favorites = [];
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setFavorites,
  addFavoriteSuccess,
  removeFavoriteSuccess,
  updateFavoriteOrder,
  clearFavorites,
  clearError,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
