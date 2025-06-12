// server/routes/summarizeRoutes.js
const express = require('express');
const router = express.Router();
const { generateSummary } = require('../controllers/summarizeController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/summarize
// @desc    Generate a summary from text or URL
// @access  Private (requires token)
router.post('/', authMiddleware, generateSummary);

module.exports = router;