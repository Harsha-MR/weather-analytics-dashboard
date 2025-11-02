import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  loginSuccess, 
  logout as logoutAction,
  setUser 
} from '../store/slices/authSlice';
import * as authAPI from '../services/authAPI';

/**
 * Authentication hook
 * Provides auth state and methods
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  /**
   * Handle Google login
   */
  const loginWithGoogle = async (idToken) => {
    try {
      const response = await authAPI.googleLogin(idToken);
      dispatch(loginSuccess(response.data));
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Handle logout
   */
  const logout = async () => {
    try {
      await authAPI.logout();
      dispatch(logoutAction());
      navigate('/');
    } catch (error) {
      // Logout locally even if API call fails
      dispatch(logoutAction());
      navigate('/');
    }
  };

  /**
   * Get current user
   */
  const getCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      dispatch(setUser(response.data.user));
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Check authentication on mount
   */
  const checkAuth = () => {
    const isAuth = authAPI.isAuthenticated();
    const storedUser = authAPI.getStoredUser();
    
    if (isAuth && storedUser) {
      dispatch(setUser(storedUser));
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    loginWithGoogle,
    logout,
    getCurrentUser,
    checkAuth,
  };
};

export default useAuth;
