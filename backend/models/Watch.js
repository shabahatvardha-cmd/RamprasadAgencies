const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Watch name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Watch image URL is required'],
    },
    storeLocation: {
      type: String,
      default: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    movement: {
      type: String,
      trim: true,
      default: 'Automatic / Mechanical',
    },
    caseDiameter: {
      type: String,
      trim: true,
      default: '40mm',
    },
    waterResistance: {
      type: String,
      trim: true,
      default: '100m / 10 Bar',
    },
    strapType: {
      type: String,
      trim: true,
      default: 'Stainless Steel Bracelet',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    collectionName: {
      type: String,
      trim: true,
      default: 'newArrivals',
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Watch', watchSchema);
