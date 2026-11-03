const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Watch = require('../models/Watch');
const storage = require('../storage');

// GET /api/watches - Fetch all watches (with optional filter/search)
router.get('/', async (req, res) => {
  try {
    if (storage.isMongoConnected()) {
      const { category, brand, inStock, gender, search, sort } = req.query;
      const query = {};

      if (category) {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (brand) {
        query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
      }
      if (typeof inStock !== 'undefined' && inStock !== 'ALL') {
        query.inStock = inStock === 'true' || inStock === true;
      }
      if (gender && gender !== 'ALL') {
        query.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price_asc') sortOptions = { price: 1 };
      else if (sort === 'price_desc') sortOptions = { price: -1 };
      else if (sort === 'name_asc') sortOptions = { name: 1 };

      const watches = await Watch.find(query).sort(sortOptions);
      return res.status(200).json({
        success: true,
        count: watches.length,
        data: watches,
      });
    }

    // High-performance file storage fallback
    const watches = storage.getWatches(req.query);
    return res.status(200).json({
      success: true,
      count: watches.length,
      data: watches,
    });
  } catch (error) {
    // Resilient fallback to local storage
    const watches = storage.getWatches(req.query);
    return res.status(200).json({
      success: true,
      count: watches.length,
      data: watches,
    });
  }
});

// POST /api/watches/reset - Reset all watches to default catalog (all in stock)
router.post('/reset', async (req, res) => {
  try {
    const resetData = storage.resetWatches();
    if (storage.isMongoConnected()) {
      try {
        await Watch.updateMany({}, { $set: { inStock: true } });
      } catch (mErr) {
        console.warn('Mongo watch reset sync warning:', mErr.message);
      }
    }
    res.status(200).json({
      success: true,
      message: 'Watch catalog reset to factory defaults (all models in stock)',
      count: resetData.length,
      data: resetData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset watch catalog',
      error: error.message,
    });
  }
});

// POST /api/watches/:id/reset - Reset a single watch to factory specifications
router.post('/:id/reset', async (req, res) => {
  try {
    const restored = storage.resetSingleWatch(req.params.id);
    if (!restored) {
      return res.status(404).json({
        success: false,
        message: `Watch with ID ${req.params.id} not found in factory catalog`,
      });
    }

    if (storage.isMongoConnected()) {
      try {
        await Watch.findOneAndUpdate(
          { _id: req.params.id },
          { $set: restored },
          { new: true }
        );
      } catch (mErr) {
        console.warn('Mongo single watch reset sync warning:', mErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Watch "${restored.name}" reset to factory specifications`,
      data: restored,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset watch to factory specifications',
      error: error.message,
    });
  }
});

// GET /api/watches/:id - Fetch a single watch by ID
router.get('/:id', async (req, res) => {
  try {
    if (storage.isMongoConnected()) {
      const watch = await Watch.findById(req.params.id);
      if (watch) {
        return res.status(200).json({
          success: true,
          data: watch,
        });
      }
    }

    const watch = storage.getWatchById(req.params.id);
    if (!watch) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: watch,
    });
  } catch (error) {
    const watch = storage.getWatchById(req.params.id);
    if (watch) {
      return res.status(200).json({
        success: true,
        data: watch,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve watch',
      error: error.message,
    });
  }
});

// POST /api/watches - Add a new watch
router.post('/', async (req, res) => {
  try {
    const { name, brand, category, image } = req.body;

    if (!name || !brand || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, brand, and category are required.',
      });
    }

    // Always persist to local file storage for instant zero-latency reactivity
    const savedWatch = storage.createWatch(req.body);

    if (storage.isMongoConnected()) {
      try {
        const newWatch = new Watch({
          ...req.body,
          price: req.body.price !== null && req.body.price !== undefined ? Number(req.body.price) : 0,
        });
        await newWatch.save();
      } catch (mErr) {
        console.warn('Mongo save watch warning:', mErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Watch added successfully',
      data: savedWatch,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add watch',
      error: error.message,
    });
  }
});

// PUT /api/watches/:id - Update an existing watch
router.put('/:id', async (req, res) => {
  try {
    // Always persist to local file storage for instant zero-latency reactivity
    const updatedWatch = storage.updateWatch(req.params.id, req.body);

    if (storage.isMongoConnected()) {
      try {
        await Watch.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true, runValidators: false }
        );
      } catch (mErr) {
        console.warn('Mongo update watch warning:', mErr.message);
      }
    }

    if (!updatedWatch) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Watch updated successfully',
      data: updatedWatch,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update watch',
      error: error.message,
    });
  }
});

// DELETE /api/watches/:id - Delete a watch
router.delete('/:id', async (req, res) => {
  try {
    const deleted = storage.deleteWatch(req.params.id);

    if (storage.isMongoConnected()) {
      try {
        const watch = await Watch.findByIdAndDelete(req.params.id);
        if (watch && watch.image && watch.image.startsWith('/uploads/')) {
          const filename = path.basename(watch.image);
          const filePath = path.join(__dirname, '..', 'uploads', filename);
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, () => {});
          }
        }
      } catch (mErr) {
        console.warn('Mongo delete watch warning:', mErr.message);
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Watch deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete watch',
      error: error.message,
    });
  }
});

module.exports = router;
