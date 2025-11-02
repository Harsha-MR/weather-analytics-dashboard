import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/database.js';
import { initializeFirebase } from './config/firebase.js';
import logger from './utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://weather-analytics-dashboard-seven.vercel.app/'
  ],
  credentials: true,
}));

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Get port from environment
const PORT = process.env.PORT || 5000;

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'OPENWEATHER_API_KEY',
  'FRONTEND_URL',
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  logger.error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
  logger.error('Please check your .env file');
  process.exit(1);
}

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Firebase (optional)
    initializeFirebase();

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info('='.repeat(50));
      logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode`);
      logger.info(`📡 Server URL: http://localhost:${PORT}`);
      logger.info(`🌐 API Base URL: http://localhost:${PORT}/api`);
      logger.info(`📚 API Docs: http://localhost:${PORT}/api/docs`);
      logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
      logger.info('='.repeat(50));
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      logger.error('❌ Unhandled Promise Rejection:', err.message);
      logger.error(err.stack);
      
      // Close server & exit process
      server.close(() => {
        logger.info('🔌 Server closed due to unhandled rejection');
        process.exit(1);
      });
    });

    // Handle SIGTERM signal (e.g., from Heroku)
    process.on('SIGTERM', () => {
      logger.info('👋 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('✅ Process terminated');
        process.exit(0);
      });
    });

    // Handle SIGINT signal (Ctrl+C)
    process.on('SIGINT', () => {
      logger.info('\n👋 SIGINT received. Shutting down gracefully...');
      server.close(() => {
        logger.info('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error.message);
    logger.error(error.stack);
    process.exit(1);
  }
};

// Start the server
startServer();
