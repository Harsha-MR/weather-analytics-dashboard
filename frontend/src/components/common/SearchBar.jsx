import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';
import * as weatherAPI from '../../services/weatherAPI';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Search cities
  useEffect(() => {
    const searchCities = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await weatherAPI.searchCities(debouncedQuery);
        setResults(response.data || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchCities();
  }, [debouncedQuery]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (city) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    navigate(`/city/${encodeURIComponent(city.name)}`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder="Search cities..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && query && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((city, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                  >
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium">
                        {city.displayName || city.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {city.country}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              No cities found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
