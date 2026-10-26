const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    storeLocation: {
      type: String,
      default: 'Baldev Plaza, Golghar',
      trim: true,
    },
    inquiryType: {
      type: String,
      default: 'Buy / Inquire Specific Watch',
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
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Showroom Visit Scheduled', 'Converted', 'Archived'],
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

// Indexes for fast searching and sorting
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ phone: 1 });

module.exports = mongoose.model('Lead', LeadSchema);
