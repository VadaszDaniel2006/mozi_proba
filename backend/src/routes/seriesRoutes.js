// src/routes/seriesRoutes.js
const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController');

// GET /api/sorozatok
router.get('/', seriesController.getAllSeries);

module.exports = router;