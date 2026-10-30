const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const storage = require('../storage');

// GET /api/settings - Fetch current site settings
router.get('/', async (req, res) => {
  try {
    if (storage.isMongoConnected()) {
      const settings = await Settings.getSingleton();
      return res.status(200).json({
        success: true,
        data: settings,
      });
    }
    const settings = storage.getSettings();
    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    // Resilient fallback to local storage
    const settings = storage.getSettings();
    return res.status(200).json({
      success: true,
      data: settings,
    });
  }
});

// PUT /api/settings - Update any site settings dynamically
router.put('/', async (req, res) => {
  try {
    const updateFields = { ...req.body };
    delete updateFields._id;
    delete updateFields.__v;

    // Always persist to local file storage for instant zero-latency reactivity
    const updatedSettings = storage.updateSettings(updateFields);

    if (storage.isMongoConnected()) {
      try {
        await Settings.findOneAndUpdate(
          {},
          { $set: updateFields },
          { new: true, upsert: true, runValidators: false, setDefaultsOnInsert: true }
        );
      } catch (mErr) {
        console.warn('Mongo sync warning in PUT /settings:', mErr.message);
      }
    }

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
    const resetData = storage.resetSettings();
    if (storage.isMongoConnected()) {
      try {
        await Settings.resetDefaults();
      } catch (mErr) {
        console.warn('Mongo sync warning in reset:', mErr.message);
      }
    }
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
