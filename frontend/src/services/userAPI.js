import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

/**
 * User API service
 */

/**
 * Get user profile
 */
export const getProfile = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.USER.PROFILE);
    
    const { user } = response.data.data;
    
    // Update user in localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put(API_ENDPOINTS.USER.PROFILE, profileData);
    
    const { user } = response.data.data;
    
    // Update user in localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user preferences
 */
export const updatePreferences = async (preferences) => {
  try {
    const response = await api.put(API_ENDPOINTS.USER.PREFERENCES, {
      preferences,
    });
    
    // Update stored settings
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.preferences = { ...user.preferences, ...preferences };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user account
 */
export const deleteAccount = async () => {
  try {
    const response = await api.delete(API_ENDPOINTS.USER.PROFILE);
    
    // Clear all localStorage
    localStorage.clear();
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user preferences from localStorage
 */
export const getStoredPreferences = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    return user.preferences || null;
  } catch {
    return null;
  }
};

export default {
  getProfile,
  updateProfile,
  updatePreferences,
  deleteAccount,
  getStoredPreferences,
};
