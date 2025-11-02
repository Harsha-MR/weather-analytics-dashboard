import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../common/Toast';

const UserProfile = ({ mobile = false }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { showSuccess } = useToast();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Successfully logged out');
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  if (mobile) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-3 px-3 py-2">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-medium">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
        <Link
          to="/profile"
          className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
            <span className="text-white text-sm font-medium">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <ChevronDown
          className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>

          <Link
            to="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>

          <Link
            to="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>

          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
