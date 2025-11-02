// ✅ Load environment variables FIRST
import 'dotenv/config';

// ✅ Import all required packages
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import configurations
import connectDB from './config/database.js';
import { initializeFirebase } from './config/firebase.js';
import logger from './utils/logger.js';

// Import routes
import weatherRoutes from './routes/weatherRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';
import rateLimiter from './middleware/rateLimiter.js';

// Environment Check
console.log('\n🔍 Environment Variables Check:');
console.log('================================');
console.log(`NODE_ENV: ${process.env.NODE_ENV || '❌ MISSING'}`);
console.log(`PORT: ${process.env.PORT || '❌ MISSING'}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? '✅ LOADED' : '❌ MISSING'}`);
console.log(`OPENWEATHER_API_KEY: ${process.env.OPENWEATHER_API_KEY ? '✅ LOADED' : '❌ MISSING'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '✅ LOADED' : '❌ MISSING'}`);
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || '❌ MISSING'}`);
console.log('================================\n');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize Firebase (optional, won't crash if fails)
try {
  initializeFirebase();
  console.log('✅ Firebase initialized');
} catch (error) {
  console.warn('⚠️  Firebase initialization skipped:', error.message);
}

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://weather-analytics-dashboard-seven.vercel.app'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { 
    stream: { write: message => logger.info(message.trim()) } 
  }));
} else {
  app.use(morgan('dev'));
}

// Rate Limiting
app.use('/api/', rateLimiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);

// API Documentation Route
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'Weather Dashboard API Documentation',
    version: '1.0.0',
    baseUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    endpoints: {
      health: 'GET /health',
      weather: {
        current: 'GET /api/weather/current/:city',
        forecast: 'GET /api/weather/forecast/:city',
        hourly: 'GET /api/weather/hourly/:city',
        search: 'GET /api/weather/search?q=query',
        coords: 'GET /api/weather/coords?lat=&lon=',
      },
      auth: {
        google: 'POST /api/auth/google',
        refresh: 'POST /api/auth/refresh',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me',
      },
      users: {
        profile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile',
        preferences: 'PUT /api/users/preferences',
      },
      favorites: {
        list: 'GET /api/favorites',
        add: 'POST /api/favorites',
        remove: 'DELETE /api/favorites/:id',
        reorder: 'PUT /api/favorites/order',
      },
    },
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error Handling Middleware (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log('==================================================');
  console.log('🚀 Server running in ' + (process.env.NODE_ENV || 'development') + ' mode');
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('==================================================');
  
  logger.info(`Server started on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  logger.info('Server shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  logger.info('Server shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('Unhandled Rejection:', { reason, promise });
  process.exit(1);
});
