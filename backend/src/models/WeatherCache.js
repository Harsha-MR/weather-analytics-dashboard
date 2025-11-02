import mongoose from 'mongoose';

const weatherCacheSchema = new mongoose.Schema(
  {
    cityId: {
      type: String,
      required: true,
      unique: true,
    },
    cityName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['current', 'forecast', 'hourly'],
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically delete expired documents
weatherCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for faster queries
weatherCacheSchema.index({ cityId: 1, type: 1 });

// Static method to get or set cache
weatherCacheSchema.statics.getOrSet = async function (cityId, cityName, type, ttl, fetchFunction) {
  // Try to get from cache
  const cached = await this.findOne({
    cityId,
    type,
    expiresAt: { $gt: new Date() },
  });

  if (cached) {
    return cached.data;
  }

  // Fetch fresh data
  const freshData = await fetchFunction();

  // Store in cache
  await this.findOneAndUpdate(
    { cityId, type },
    {
      cityId,
      cityName,
      type,
      data: freshData,
      expiresAt: new Date(Date.now() + ttl * 1000),
    },
    { upsert: true, new: true }
  );

  return freshData;
};

const WeatherCache = mongoose.model('WeatherCache', weatherCacheSchema);

export default WeatherCache;
