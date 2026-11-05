const mongoose = require('mongoose');

/**
 * Lead Schema - Customer Showroom Inquiry & VIP Consultation Form
 * 
 * Works in two modes:
 * 1. Offline / Local Mode (Current):
 *    Validates form data purely in memory via `new Lead(data).validateSync()`
 *    without requiring an active MongoDB connection.
 * 2. Database Mode (When MongoDB is connected later):
 *    Persists directly to MongoDB with full timestamps and indexes.
 */
const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters long'],
      maxlength: [80, 'Customer name cannot exceed 80 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return false;
          const digits = String(v).replace(/\D/g, '');
          return digits.length >= 10 && digits.length <= 15;
        },
        message: 'Phone number must contain at least 10 valid digits',
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      validate: {
        validator: function (v) {
          if (!v || String(v).trim() === '') return true; // Optional field
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
        },
        message: 'Please provide a valid email address format',
      },
    },
    storeLocation: {
      type: String,
      default: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
      trim: true,
    },
    inquiryType: {
      type: String,
      default: 'Buy / Inquire Specific Watch',
      trim: true,
    },
    category: {
      type: String,
      default: 'inquiry',
      trim: true,
    },
    leadType: {
      type: String,
      default: 'inquiry',
      trim: true,
    },
    watchName: {
      type: String,
      default: '',
      trim: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Inquiry message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: [
          'New',
          'Contacted',
          'Showroom Visit Scheduled',
          'Purchased / Closed',
          'Archived / Inactive',
          'Converted',
          'Archived',
        ],
        message: '{VALUE} is not a valid lead status',
      },
      default: 'New',
    },
    adminNotes: {
      type: String,
      default: '',
      trim: true,
    },
    source: {
      type: String,
      default: 'Storefront Inquiry Form',
    },
    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance searching and filtering
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ phone: 1 });

module.exports = mongoose.model('Lead', LeadSchema);
