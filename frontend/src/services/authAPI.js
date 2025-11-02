import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

/**
 * Authentication API service
 */

/**
 * Google OAuth login
 */
export const googleLogin = async (idToken) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
      idToken,
    });
    
    const { accessToken, refreshToken, user } = response.data.data;
    
    // Store tokens and user in localStorage
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    
    const { accessToken } = response.data.data;
    
    // Update token in localStorage
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    
    return { success: true };
  } catch (error) {
    // Clear localStorage even if API call fails
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    
    const { user } = response.data.data;
    
    // Update user in localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
};

/**
 * Get stored user
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export default {
  googleLogin,
  refreshToken,
  logout,
  getCurrentUser,
  isAuthenticated,
  getStoredUser,
};
