import { useSelector, useDispatch } from 'react-redux';
import { 
  setFavorites, 
  addFavoriteSuccess, 
  removeFavoriteSuccess,
  setLoading,
  setError 
} from '../store/slices/favoritesSlice';
import * as favoritesAPI from '../services/favoritesAPI';

/**
 * Favorites hook
 * Provides favorites state and methods
 */
const useFavorites = () => {
  const dispatch = useDispatch();
  
  const { favorites, loading, error } = useSelector(
    (state) => state.favorites
  );

  /**
   * Fetch all favorites
   */
  const fetchFavorites = async () => {
    dispatch(setLoading(true));
    try {
      const response = await favoritesAPI.getFavorites();
      dispatch(setFavorites(response.data.favorites));
    } catch (err) {
      dispatch(setError(err.message || 'Failed to fetch favorites'));
    }
  };

  /**
   * Add city to favorites
   */
  const addFavorite = async (cityData) => {
    try {
      const response = await favoritesAPI.addFavorite(cityData);
      dispatch(addFavoriteSuccess(response.data.favorite));
      return response;
    } catch (err) {
      dispatch(setError(err.message || 'Failed to add favorite'));
      throw err;
    }
  };

  /**
   * Remove city from favorites
   */
  const removeFavorite = async (favoriteId) => {
    try {
      await favoritesAPI.removeFavorite(favoriteId);
      dispatch(removeFavoriteSuccess(favoriteId));
    } catch (err) {
      dispatch(setError(err.message || 'Failed to remove favorite'));
      throw err;
    }
  };

  /**
   * Update favorites order
   */
  const updateOrder = async (reorderedFavorites) => {
    try {
      const response = await favoritesAPI.updateFavoritesOrder(reorderedFavorites);
      dispatch(setFavorites(response.data.favorites));
    } catch (err) {
      dispatch(setError(err.message || 'Failed to update order'));
      throw err;
    }
  };

  /**
   * Check if city is favorited
   */
  const isFavorited = (cityId) => {
    return favorites.some((fav) => fav.cityId === cityId);
  };

  /**
   * Toggle favorite status
   */
  const toggleFavorite = async (cityData) => {
    const existing = favorites.find((fav) => fav.cityId === cityData.cityId);
    
    if (existing) {
      await removeFavorite(existing._id);
    } else {
      await addFavorite(cityData);
    }
  };

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    updateOrder,
    isFavorited,
    toggleFavorite,
  };
};

export default useFavorites;
