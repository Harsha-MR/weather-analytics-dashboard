// Load environment variables FIRST
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

// Environment Variables Check
console.log('\n🔍 Environment Variables Check:');
console.log('================================');
console.log(`NODE_ENV: ${process.env.NODE_ENV || '❌ MISSING'}`);
console.log(`PORT: ${process.env.PORT || '❌ MISSING'}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? '✅ LOADED' : '❌ MISSING'}`);
console.log(`OPENWEATHER_API_KEY: ${process.env.OPENWEATHER_API_KEY ? '✅ LOADED' : '❌ MISSING'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '✅ LOADED' : '❌ MISSING'}`);
console.log('================================\n');

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Firebase Initialization
try {
  initializeFirebase();
  console.log('✅ Firebase initialized');
} catch (error) {
  console.warn('⚠️  Firebase skipped:', error.message);
}

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://weather-analytics-dashboard-seven.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Health Check
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

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'Weather Analytics Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      weather: {
        current: 'GET /api/weather/current/:city',
        forecast: 'GET /api/weather/forecast/:city',
      },
      auth: {
        google: 'POST /api/auth/google',
        me: 'GET /api/auth/me',
      },
      users: {
        profile: 'GET /api/users/profile',
      },
    },
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Weather Analytics Dashboard API',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/health',
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

// Custom Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('\n==================================================');
  console.log('🚀 Server Started Successfully');
  console.log('==================================================');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Port: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`API Docs: http://localhost:${PORT}/api/docs`);
  console.log('==================================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down');
  process.exit(0);
});

export default app;
