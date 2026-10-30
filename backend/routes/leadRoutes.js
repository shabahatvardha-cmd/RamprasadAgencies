const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const storage = require('../storage');

/**
 * @route   GET /api/leads
 * @desc    Get all leads with optional filtering and search
 */
router.get('/', async (req, res) => {
  try {
    if (storage.isMongoConnected()) {
      const { status, search, storeLocation } = req.query;
      const query = {};

      if (status && status !== 'ALL') {
        query.status = status;
      }
      if (storeLocation && storeLocation !== 'ALL') {
        query.storeLocation = new RegExp(storeLocation.trim(), 'i');
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { name: regex },
          { phone: regex },
          { email: regex },
          { watchName: regex },
          { message: regex },
          { storeLocation: regex },
          { adminNotes: regex },
        ];
      }

      const leads = await Lead.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: leads.length,
        data: leads,
      });
    }

    const leads = storage.getLeads(req.query);
    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (err) {
    const leads = storage.getLeads(req.query);
    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  }
});

/**
 * @route   GET /api/leads/stats
 * @desc    Get aggregated lead statistics
 */
router.get('/stats', async (req, res) => {
  try {
    if (storage.isMongoConnected()) {
      const total = await Lead.countDocuments();
      const newLeads = await Lead.countDocuments({ status: 'New' });
      const contacted = await Lead.countDocuments({ status: 'Contacted' });
      const scheduled = await Lead.countDocuments({ status: 'Showroom Visit Scheduled' });
      const converted = await Lead.countDocuments({ status: 'Converted' });
      const archived = await Lead.countDocuments({ status: 'Archived' });

      return res.status(200).json({
        success: true,
        data: { total, newLeads, contacted, scheduled, converted, archived },
      });
    }

    const stats = storage.getLeadStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    const stats = storage.getLeadStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  }
});

/**
 * @route   POST /api/leads
 * @desc    Create a new customer lead from storefront form
 */
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, storeLocation, inquiryType, watchName, message, source, customFields } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required',
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    const savedLead = storage.createLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      storeLocation: storeLocation || 'Baldev Plaza, Golghar',
      inquiryType: inquiryType || 'Buy / Inquire Specific Watch',
      watchName: watchName ? watchName.trim() : '',
      message: message ? message.trim() : '',
      customFields: customFields && typeof customFields === 'object' ? customFields : {},
      status: 'New',
      source: source || 'Storefront Inquiry Form',
    });

    if (storage.isMongoConnected()) {
      try {
        const lead = new Lead(savedLead);
        await lead.save();
      } catch (mErr) {
        console.warn('Mongo lead save warning:', mErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully registered with Ram Prasad Agencies concierge.',
      data: savedLead,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit customer lead',
      error: err.message,
    });
  }
});

/**
 * @route   PUT /api/leads/:id
 * @desc    Update lead status or admin notes
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedLead = storage.updateLead(req.params.id, req.body);

    if (storage.isMongoConnected()) {
      try {
        await Lead.findByIdAndUpdate(req.params.id, { $set: req.body });
      } catch (mErr) {}
    }

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      error: err.message,
    });
  }
});

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = storage.deleteLead(req.params.id);

    if (storage.isMongoConnected()) {
      try {
        await Lead.findByIdAndDelete(req.params.id);
      } catch (mErr) {}
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id: req.params.id },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: err.message,
    });
  }
});

module.exports = router;
