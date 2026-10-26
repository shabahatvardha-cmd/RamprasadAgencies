const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

/**
 * @route   GET /api/leads
 * @desc    Get all leads with optional filtering and search
 */
router.get('/', async (req, res) => {
  try {
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
    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (err) {
    console.error('Error fetching leads:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer leads',
      error: err.message,
    });
  }
});

/**
 * @route   GET /api/leads/stats
 * @desc    Get aggregated lead statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contacted = await Lead.countDocuments({ status: 'Contacted' });
    const scheduled = await Lead.countDocuments({ status: 'Showroom Visit Scheduled' });
    const converted = await Lead.countDocuments({ status: 'Converted' });
    const archived = await Lead.countDocuments({ status: 'Archived' });

    res.status(200).json({
      success: true,
      data: {
        total,
        newLeads,
        contacted,
        scheduled,
        converted,
        archived,
      },
    });
  } catch (err) {
    console.error('Error fetching lead stats:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead stats',
      error: err.message,
    });
  }
});

/**
 * @route   GET /api/leads/:id
 * @desc    Get single lead by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }
    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (err) {
    console.error('Error fetching lead:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead',
      error: err.message,
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

    const lead = new Lead({
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

    const savedLead = await lead.save();

    console.log(`[Lead Created] New inquiry from ${savedLead.name} (${savedLead.phone}) for ${savedLead.storeLocation}`);

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully registered with Ram Prasad Agencies concierge.',
      data: savedLead,
    });
  } catch (err) {
    console.error('Error creating lead:', err.message);
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
    const { status, adminNotes, storeLocation, inquiryType } = req.body;
    const updateData = {};

    if (status !== undefined) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (storeLocation !== undefined) updateData.storeLocation = storeLocation;
    if (inquiryType !== undefined) updateData.inquiryType = inquiryType;

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

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
    console.error('Error updating lead:', err.message);
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
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: deletedLead,
    });
  } catch (err) {
    console.error('Error deleting lead:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: err.message,
    });
  }
});

module.exports = router;
