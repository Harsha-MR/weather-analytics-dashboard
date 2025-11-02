import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { sanitizeBody } from './middleware/validator.js';
import logger from './utils/logger.js';
import { ALLOWED_ORIGINS } from './config/constants.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import userRoutes from './routes/userRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';

// Create Express app
const app = express();

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Sanitize request body
app.use(sanitizeBody);

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Weather Analytics Dashboard API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      weather: '/api/weather',
      users: '/api/users',
      favorites: '/api/favorites',
      health: '/health',
    },
    documentation: '/api/docs',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoritesRoutes);

// API documentation (placeholder)
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Documentation',
    version: '1.0.0',
    baseUrl: '/api',
    endpoints: [
      {
        group: 'Authentication',
        routes: [
          { method: 'POST', path: '/auth/google', description: 'Google OAuth login' },
          { method: 'POST', path: '/auth/refresh', description: 'Refresh access token' },
          { method: 'POST', path: '/auth/logout', description: 'Logout user' },
          { method: 'GET', path: '/auth/me', description: 'Get current user' },
        ],
      },
      {
        group: 'Weather',
        routes: [
          { method: 'GET', path: '/weather/current/:city', description: 'Get current weather' },
          { method: 'GET', path: '/weather/forecast/:city', description: 'Get 5-day forecast' },
          { method: 'GET', path: '/weather/hourly/:city', description: 'Get hourly forecast' },
          { method: 'GET', path: '/weather/search?q=query', description: 'Search cities' },
          { method: 'GET', path: '/weather/coords?lat=xx&lon=xx', description: 'Get weather by coordinates' },
        ],
      },
      {
        group: 'User',
        routes: [
          { method: 'GET', path: '/users/profile', description: 'Get user profile' },
          { method: 'PUT', path: '/users/profile', description: 'Update user profile' },
          { method: 'DELETE', path: '/users/profile', description: 'Delete user account' },
          { method: 'PUT', path: '/users/preferences', description: 'Update user preferences' },
        ],
      },
      {
        group: 'Favorites',
        routes: [
          { method: 'GET', path: '/favorites', description: 'Get all favorites' },
          { method: 'POST', path: '/favorites', description: 'Add city to favorites' },
          { method: 'DELETE', path: '/favorites/:id', description: 'Remove city from favorites' },
          { method: 'PUT', path: '/favorites/order', description: 'Update favorites order' },
        ],
      },
    ],
  });
});

// 404 handler - must be after all routes
app.use(notFound);

// Error handler - must be last
app.use(errorHandler);

export default app;
