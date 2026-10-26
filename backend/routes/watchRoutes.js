const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Watch = require('../models/Watch');

// GET /api/watches - Fetch all watches (with optional filter/search)
router.get('/', async (req, res) => {
  try {
    const { category, brand, inStock, search, sort } = req.query;
    const query = {};

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    if (typeof inStock !== 'undefined') {
      query.inStock = inStock === 'true' || inStock === true;
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

    res.status(200).json({
      success: true,
      count: watches.length,
      data: watches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve watches',
      error: error.message,
    });
  }
});

// GET /api/watches/:id - Fetch a single watch by ID
router.get('/:id', async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found',
      });
    }

    res.status(200).json({
      success: true,
      data: watch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve watch',
      error: error.message,
    });
  }
});

// POST /api/watches - Add a new watch
router.post('/', async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      category,
      description,
      image,
      storeLocation,
      inStock,
    } = req.body;

    // Validate required fields
    if (!name || !brand || price === undefined || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, brand, price, category, and image are required.',
      });
    }

    const newWatch = new Watch({
      name,
      brand,
      price: Number(price),
      category,
      description: description || '',
      image,
      storeLocation: storeLocation || 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
      inStock: inStock !== undefined ? inStock : true,
      movement: req.body.movement || 'Automatic / Mechanical',
      caseDiameter: req.body.caseDiameter || '40mm',
      waterResistance: req.body.waterResistance || '100m / 10 Bar',
      strapType: req.body.strapType || 'Stainless Steel Bracelet',
      featured: req.body.featured || false,
      collectionName: req.body.collectionName || 'newArrivals',
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : 0,
      badge: req.body.badge || '',
    });

    const savedWatch = await newWatch.save();

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
    const updatedWatch = await Watch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

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
    const watch = await Watch.findByIdAndDelete(req.params.id);

    if (!watch) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found',
      });
    }

    // Optional: Clean up uploaded image if it was stored locally
    if (watch.image && watch.image.startsWith('/uploads/')) {
      const filename = path.basename(watch.image);
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Error deleting image file: ${filePath}`, err);
        });
      }
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
