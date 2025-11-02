import express from 'express';
import favoritesController from '../controllers/favoritesController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, validateObjectId } from '../middleware/validator.js';
import {
  validateFavoriteCity,
  validateFavoriteOrder,
} from '../validators/userValidator.js';

const router = express.Router();

// All favorites routes are protected
router.use(protect);

router
  .route('/')
  .get(favoritesController.getFavorites)
  .post(validateFavoriteCity, validate, favoritesController.addFavorite);

router.delete(
  '/:id',
  validateObjectId('id'),
  favoritesController.removeFavorite
);

router.put(
  '/order',
  validateFavoriteOrder,
  validate,
  favoritesController.updateFavoritesOrder
);

export default router;
