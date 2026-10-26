const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET /api/settings - Fetch current site settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message,
    });
  }
});

// PUT /api/settings - Update any site settings dynamically
router.put('/', async (req, res) => {
  try {
    const updateFields = { ...req.body };
    delete updateFields._id;
    delete updateFields.__v;

    // Use findOneAndUpdate with upsert
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { $set: updateFields },
      { new: true, upsert: true, runValidators: false, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message,
    });
  }
});

// POST /api/settings/reset - Reset settings to factory defaults
router.post('/reset', async (req, res) => {
  try {
    const resetData = await Settings.resetDefaults();
    res.status(200).json({
      success: true,
      message: 'Settings successfully reset to factory defaults',
      data: resetData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings',
      error: error.message,
    });
  }
});

module.exports = router;
