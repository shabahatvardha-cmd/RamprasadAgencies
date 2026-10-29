const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `watch-${uniqueSuffix}${extension}`);
  },
});

// File filter to accept image files only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only JPEG, JPG, PNG, WEBP, GIF, and AVIF images are allowed.`
      ),
      false
    );
  }
};

// Multer upload instance with 10MB limit
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// POST /api/upload - Handle single image upload and auto-convert to WebP
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Please send a file under field name "image".',
      });
    }

    const originalPath = req.file.path;
    const baseName = path.basename(req.file.filename, path.extname(req.file.filename));
    const webpFilename = `${baseName}.webp`;
    const webpPath = path.join(uploadDir, webpFilename);

    let finalFilename = req.file.filename;

    try {
      const sharp = require('sharp');
      await sharp(originalPath)
        .webp({ quality: 90, effort: 4 })
        .toFile(webpPath);

      // If original wasn't already webp, remove original file
      if (req.file.mimetype !== 'image/webp' && fs.existsSync(originalPath)) {
        try { fs.unlinkSync(originalPath); } catch {}
      }
      finalFilename = webpFilename;
    } catch (sharpErr) {
      console.warn('Sharp conversion fallback, using original file:', sharpErr.message);
    }

    // Relative URL served statically by express at /uploads
    const imageUrl = `/uploads/${finalFilename}`;

    return res.status(201).json({
      success: true,
      message: 'Image uploaded and converted to WebP successfully',
      imageUrl: imageUrl,
      filename: finalFilename,
      mimetype: 'image/webp',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
});

module.exports = {
  router,
  upload,
};
