// Statistiques pour un prestataire donné (par userId)
const { getPrestataireStats } = require('../controllers/statsController.js');
router.get('/prestataire/:userId', getPrestataireStats);
// backend/routes/stats.js

const express = require('express');
const { getStats, getActivityStats } = require('../controllers/statsController.js');

const router = express.Router();

// Route GET /api/stats
router.get('/', getStats);

// Route GET /api/stats/activity
router.get('/activity', getActivityStats);

module.exports = router;
