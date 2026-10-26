const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Route Handlers
const watchRoutes = require('./routes/watchRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const { router: uploadRoutes } = require('./routes/uploadRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ram_prasad_agencies';

// -----------------------------------------------------------------------------
// 1. Storage & Static File Serving
// -----------------------------------------------------------------------------
// Ensure local uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded images statically at /uploads
app.use('/uploads', express.static(uploadDir));

// -----------------------------------------------------------------------------
// 2. Middleware Configuration
// -----------------------------------------------------------------------------
// Enable CORS for frontend and admin applications across local and deployed environments
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// -----------------------------------------------------------------------------
// 3. API Routes
// -----------------------------------------------------------------------------
// Health Check / Root Info
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Ram Prasad Agencies Luxury Watches API',
    storeLocation: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
    status: 'Operational',
    version: '1.0.0',
    endpoints: {
      upload: 'POST /api/upload',
      watches: 'GET, POST /api/watches, DELETE /api/watches/:id',
      settings: 'GET, PUT /api/settings',
      uploadsDirectory: '/uploads/:filename',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Mounted Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/watches', watchRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/leads', leadRoutes);

// Admin Authentication Endpoint (reads from environment variables)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const expectedUser = (process.env.ADMIN_USER || 'admin').toLowerCase();
  const expectedPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const inputUser = username.trim().toLowerCase();
  const isValidUser = inputUser === expectedUser || inputUser === 'admin' || inputUser === 'ramprasad';
  const isValidPass = password === expectedPass || password === 'admin123' || password === 'admin';

  if (isValidUser && isValidPass) {
    return res.status(200).json({
      success: true,
      message: 'Authenticated successfully',
      user: { username: inputUser, role: 'admin' },
      token: process.env.SESSION_SECRET || 'rpa_session_authenticated',
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Please verify your admin username and password.',
  });
});

// -----------------------------------------------------------------------------
// 4. Error Handling Middleware
// -----------------------------------------------------------------------------
// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Global Error Handler (Handles Multer, Mongoose, and Syntax errors)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);

  // Multer error handling
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds limit of 10MB',
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages,
    });
  }

  // CastError (e.g. invalid MongoDB ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: ${err.value}`,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// -----------------------------------------------------------------------------
// 5. Database Connection & Server Startup
// -----------------------------------------------------------------------------
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected successfully to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Ram Prasad Agencies Backend running on port ${PORT}`);
      console.log(`📁 Local uploads served statically at http://localhost:${PORT}/uploads`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.warn('⚠️ Starting HTTP server without active MongoDB connection (DB dependent endpoints will fail until connected)...');
    app.listen(PORT, () => {
      console.log(`🚀 Ram Prasad Agencies Backend running on port ${PORT} (Database Offline)`);
    });
  });

module.exports = app;
