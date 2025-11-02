import express from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validator.js';
import {
  validateProfileUpdate,
  validatePreferences,
} from '../validators/userValidator.js';

const router = express.Router();

// All user routes are protected
router.use(protect);

router
  .route('/profile')
  .get(userController.getProfile)
  .put(validateProfileUpdate, validate, userController.updateProfile)
  .delete(userController.deleteAccount);

router.put(
  '/preferences',
  validatePreferences,
  validate,
  userController.updatePreferences
);

export default router;
