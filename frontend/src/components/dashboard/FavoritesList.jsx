import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFavorites from '../../hooks/useFavorites';
import { Star, Trash2, MapPin, GripVertical } from 'lucide-react';
import { SkeletonListItem } from '../common/Loader';

const FavoritesList = ({ limit = null }) => {
  const navigate = useNavigate();
  const { favorites, loading, fetchFavorites, removeFavorite } = useFavorites();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleCityClick = (cityName) => {
    navigate(`/city/${encodeURIComponent(cityName)}`);
  };

  const handleRemove = async (e, favoriteId) => {
    e.stopPropagation();
    try {
      await removeFavorite(favoriteId);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Favorites Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Search for cities and add them to your favorites to see them here.
        </p>
      </div>
    );
  }

  const displayedFavorites = limit ? favorites.slice(0, limit) : favorites;

  return (
    <div className="space-y-2">
      {displayedFavorites.map((favorite) => (
        <div
          key={favorite._id}
          onClick={() => handleCityClick(favorite.cityName)}
          className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
        >
          {/* Drag Handle (future feature) */}
          <GripVertical className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Star Icon */}
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
          
          {/* City Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {favorite.cityName}
              </h4>
            </div>
            {favorite.country && (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {favorite.country}
              </p>
            )}
          </div>
          
          {/* Remove Button */}
          <button
            onClick={(e) => handleRemove(e, favorite._id)}
            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Remove from favorites"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {limit && favorites.length > limit && (
        <button
          onClick={() => navigate('/profile')}
          className="w-full py-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          View all {favorites.length} favorites →
        </button>
      )}
    </div>
  );
};

export default FavoritesList;
