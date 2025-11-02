import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import useAuth from './hooks/useAuth';

// Pages
import Dashboard from './pages/Dashboard';
import CityDetail from './pages/CityDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Auth wrapper component
const AuthWrapper = ({ children }) => {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return children;
};

function AppContent() {
  return (
    <Router>
      <ThemeProvider>
        <AuthWrapper>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/city/:cityName" element={<CityDetail />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthWrapper>
      </ThemeProvider>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
