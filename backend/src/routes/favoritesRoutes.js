import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all favorites for authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        favorites: user.favorites || [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get favorites',
    });
  }
});

// Add city to favorites
router.post('/', authenticate, async (req, res) => {
  try {
    const { city } = req.body;
    const User = (await import('../models/User.js')).default;
    
    const user = await User.findById(req.user.id);
    
    if (!user.favorites) {
      user.favorites = [];
    }
    
    if (!user.favorites.includes(city)) {
      user.favorites.push(city);
      await user.save();
    }
    
    res.json({
      success: true,
      message: 'City added to favorites',
      data: {
        favorites: user.favorites,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add favorite',
    });
  }
});

// Remove city from favorites
router.delete('/:city', authenticate, async (req, res) => {
  try {
    const { city } = req.params;
    const User = (await import('../models/User.js')).default;
    
    const user = await User.findById(req.user.id);
    
    if (user.favorites) {
      user.favorites = user.favorites.filter(fav => fav !== city);
      await user.save();
    }
    
    res.json({
      success: true,
      message: 'City removed from favorites',
      data: {
        favorites: user.favorites,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove favorite',
    });
  }
});

export default router;
