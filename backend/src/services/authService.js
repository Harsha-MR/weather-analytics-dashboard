import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../config/firebase.js';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

/**
 * Generate JWT access token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Handle Google OAuth login
 */
export const googleLogin = async (idToken) => {
  try {
    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(idToken);

    const { uid, email, name, picture } = decodedToken;

    // Find or create user
    let user = await User.findOne({ googleId: uid });

    if (!user) {
      // Create new user
      user = await User.create({
        googleId: uid,
        email,
        name,
        avatar: picture,
      });
      logger.info(`New user created via Google: ${email}`);
    } else {
      // Update last login
      await user.updateLastLogin();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    logger.error('Google login error:', error.message);
    throw new Error(`Google authentication failed: ${error.message}`);
  }
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    return {
      accessToken: newAccessToken,
      user,
    };
  } catch (error) {
    logger.error('Token refresh error:', error.message);
    throw new Error(`Token refresh failed: ${error.message}`);
  }
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  googleLogin,
  refreshAccessToken,
};
