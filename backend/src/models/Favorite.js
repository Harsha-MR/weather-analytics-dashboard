import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cityName: {
      type: String,
      required: true,
      trim: true,
    },
    cityId: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user and city
favoriteSchema.index({ userId: 1, cityId: 1 }, { unique: true });
favoriteSchema.index({ userId: 1, order: 1 });

// Method to reorder favorites
favoriteSchema.statics.reorderFavorites = async function (userId, cityId, newOrder) {
  const favorite = await this.findOne({ userId, cityId });
  if (!favorite) {
    throw new Error('Favorite not found');
  }

  const oldOrder = favorite.order;
  
  // Update orders of other favorites
  if (newOrder > oldOrder) {
    await this.updateMany(
      { userId, order: { $gt: oldOrder, $lte: newOrder } },
      { $inc: { order: -1 } }
    );
  } else if (newOrder < oldOrder) {
    await this.updateMany(
      { userId, order: { $gte: newOrder, $lt: oldOrder } },
      { $inc: { order: 1 } }
    );
  }

  favorite.order = newOrder;
  return await favorite.save();
};

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
