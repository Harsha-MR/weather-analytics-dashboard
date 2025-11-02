import express from 'express';
import authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validator.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  validateGoogleLogin,
  validateRefreshToken,
} from '../validators/authValidator.js';

const router = express.Router();

// Public routes
router.post(
  '/google',
  authLimiter,
  validateGoogleLogin,
  validate,
  authController.googleLogin
);

router.post(
  '/refresh',
  validateRefreshToken,
  validate,
  authController.refreshToken
);

// Protected routes
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getCurrentUser);

export default router;
