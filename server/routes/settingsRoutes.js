const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const verifyJWT = require('../middleware/verifyJWT'); // Middleware for JWT verification

// Get settings
router.get('/', verifyJWT, getSettings);

// Update settings
router.put('/', verifyJWT, updateSettings);

module.exports = router;
