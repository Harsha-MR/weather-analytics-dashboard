import { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../store/slices/settingsSlice';
import { THEMES } from '../utils/constants';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.settings);

  useEffect(() => {
    // Apply theme on mount and when it changes
    applyTheme(theme);

    // Listen for system theme changes if theme is auto
    if (theme === THEMES.AUTO) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme(THEMES.AUTO);
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === THEMES.DARK) {
      document.documentElement.classList.add('dark');
    } else if (selectedTheme === THEMES.LIGHT) {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto - use system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const toggleTheme = () => {
    const themes = [THEMES.LIGHT, THEMES.DARK, THEMES.AUTO];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    dispatch(setTheme(themes[nextIndex]));
  };

  const value = {
    theme,
    setTheme: (newTheme) => dispatch(setTheme(newTheme)),
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
