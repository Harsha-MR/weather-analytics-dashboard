// ===============================================
// Weather Analytics Dashboard - Backend Server
// ===============================================

// Load environment variables FIRST (before any other imports)
import 'dotenv/config';

// Core dependencies
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Configuration
import connectDB from './config/database.js';
import { initializeFirebase } from './config/firebase.js';
import logger from './utils/logger.js';

// Routes
import weatherRoutes from './routes/weatherRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';
import rateLimiter from './middleware/rateLimiter.js';

// ===============================================
// Environment Variables Validation
// ===============================================

console.log('\n🔍 Environment Variables Check:');
console.log('================================');
console.log(`NODE_ENV: ${process.env.NODE_ENV || '❌ MISSING'}`);
console.log(`PORT: ${process.env.PORT || '❌ MISSING'}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? '✅ LOADED' : '❌ MISSING'}`);
console.log(`OPENWEATHER_API_KEY: ${process.env.OPENWEATHER_API_KEY ? '✅ LOADED' : '❌ MISSING'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '✅ LOADED' : '❌ MISSING'}`);
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || '❌ MISSING'}`);
console.log(`FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? '✅ LOADED' : '❌ MISSING'}`);
console.log('================================\n');

// ===============================================
// Express App Initialization
// ===============================================

const app = express();
const PORT = process.env.PORT || 5000;
const isDevelopment = process.env.NODE_ENV !== 'production';

// ===============================================
// Database Connection
// ===============================================

connectDB().catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err);
  process.exit(1);
});

// ===============================================
// Firebase Initialization (Optional)
// ===============================================

try {
  initializeFirebase();
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.warn('⚠️  Firebase initialization skipped:', error.message);
  logger.warn('Firebase initialization failed', { error: error.message });
}

// ===============================================
// Security Middleware
// ===============================================

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Allow Vercel domain
}));

// ===============================================
// CORS Configuration
// ===============================================

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://weather-analytics-dashboard-seven.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // Cache preflight request for 10 minutes
}));

// ===============================================
// Body Parser Middleware
// ===============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===============================================
// Logging Middleware
// ===============================================

if (isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// ===============================================
// Rate Limiting
// ===============================================

app.use('/api/', rateLimiter);

// ===============================================
// Health Check Endpoint
// ===============================================

app.get('/health', (req, res) => {
  const healthCheck = {
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'Weather Analytics Dashboard API',
    version: '1.0.0',
  };
  
  res.status(200).json(healthCheck);
});

// ===============================================
// API Routes
// ===============================================

app.use('/api/weather', weatherRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ===============================================
// API Documentation Endpoint
// ===============================================

app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'Weather Analytics Dashboard API',
    version: '1.0.0',
    baseUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    documentation: {
      health: 'GET /health',
      apiDocs: 'GET /api/docs',
    },
    endpoints: {
      weather: {
        description: 'Weather data endpoints',
        routes: {
          getCurrentWeather: {
            method: 'GET',
            path: '/api/weather/current/:city',
            description: 'Get current weather for a city',
            example: '/api/weather/current/London',
          },
          getForecast: {
            method: 'GET',
            path: '/api/weather/forecast/:city',
            description: 'Get 7-day weather forecast',
            example: '/api/weather/forecast/London',
          },
          getHourlyForecast: {
            method: 'GET',
            path: '/api/weather/hourly/:city',
            description: 'Get hourly weather forecast',
            example: '/api/weather/hourly/London',
          },
          searchCities: {
            method: 'GET',
            path: '/api/weather/search',
            description: 'Search cities by name',
            example: '/api/weather/search?q=London',
          },
          getWeatherByCoords: {
            method: 'GET',
            path: '/api/weather/coords',
            description: 'Get weather by coordinates',
            example: '/api/weather/coords?lat=51.5074&lon=-0.1278',
          },
        },
      },
      auth: {
        description: 'Authentication endpoints',
        routes: {
          googleLogin: {
            method: 'POST',
            path: '/api/auth/google',
            description: 'Authenticate with Google',
            body: { idToken: 'string' },
          },
          refreshToken: {
            method: 'POST',
            path: '/api/auth/refresh',
            description: 'Refresh access token',
            body: { refreshToken: 'string' },
          },
          logout: {
            method: 'POST',
            path: '/api/auth/logout',
            description: 'Logout user',
          },
          getCurrentUser: {
            method: 'GET',
            path: '/api/auth/me',
            description: 'Get current authenticated user',
            headers: { Authorization: 'Bearer <token>' },
          },
        },
      },
      users: {
        description: 'User management endpoints',
        routes: {
          getProfile: {
            method: 'GET',
            path: '/api/users/profile',
            description: 'Get user profile',
            auth: 'required',
          },
          updateProfile: {
            method: 'PUT',
            path: '/api/users/profile',
            description: 'Update user profile',
            auth: 'required',
          },
          updatePreferences: {
            method: 'PUT',
            path: '/api/users/preferences',
            description: 'Update user preferences',
            auth: 'required',
          },
        },
      },
    },
  });
});

// ===============================================
// Root Endpoint
// ===============================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Weather Analytics Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      documentation: '/api/docs',
      weather: '/api/weather',
      auth: '/api/auth',
      users: '/api/users',
    },
  });
});

// ===============================================
// 404 Handler
// ===============================================

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      health: '/health',
      documentation: '/api/docs',
      weather: '/api/weather',
      auth: '/api/auth',
      users: '/api/users',
    },
  });
});

// ===============================================
// Error Handling Middleware (Must be last)
// ===============================================

app.use(errorHandler);

// ===============================================
// Server Startup
// ===============================================

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n==================================================');
  console.log('🚀 Weather Analytics Dashboard API');
  console.log('==================================================');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log(`API Docs: http://localhost:${PORT}/api/docs`);
  console.log('==================================================\n');
  
  logger.info(`Server started successfully on port ${PORT}`);
});

// ===============================================
// Graceful Shutdown Handlers
// ===============================================

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} signal received: closing HTTP server gracefully`);
  logger.info(`${signal} received, shutting down gracefully`);
  
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ===============================================
// Unhandled Error Handlers
// ===============================================

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('Unhandled Rejection:', { reason, promise });
  process.exit(1);
});

// ===============================================
// Export for testing
// ===============================================

export default app;
