import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

/**
 * Favorites API service
 */

/**
 * Get all user favorites
 */
export const getFavorites = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.FAVORITES.BASE);
    
    const { favorites } = response.data.data;
    
    // Store favorites in localStorage for offline access
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add city to favorites
 */
export const addFavorite = async (cityData) => {
  try {
    const response = await api.post(API_ENDPOINTS.FAVORITES.BASE, cityData);
    
    // Update localStorage
    const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites);
      favorites.push(response.data.data.favorite);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove city from favorites
 */
export const removeFavorite = async (favoriteId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.FAVORITES.DELETE(favoriteId));
    
    // Update localStorage
    const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites);
      const updated = favorites.filter((fav) => fav._id !== favoriteId);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update favorites order
 */
export const updateFavoritesOrder = async (favorites) => {
  try {
    const response = await api.put(API_ENDPOINTS.FAVORITES.ORDER, {
      favorites,
    });
    
    const { favorites: updatedFavorites } = response.data.data;
    
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if city is in favorites
 */
export const isCityFavorited = (cityId) => {
  const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  if (!storedFavorites) return false;
  
  try {
    const favorites = JSON.parse(storedFavorites);
    return favorites.some((fav) => fav.cityId === cityId);
  } catch {
    return false;
  }
};

/**
 * Get stored favorites from localStorage
 */
export const getStoredFavorites = () => {
  const favoritesStr = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  if (!favoritesStr) return [];
  
  try {
    return JSON.parse(favoritesStr);
  } catch {
    return [];
  }
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavoritesOrder,
  isCityFavorited,
  getStoredFavorites,
};
