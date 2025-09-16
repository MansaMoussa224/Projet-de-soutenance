// backend/routes/stats.js
const express = require("express");
const { 
  getStats, 
  getActivityStats, 
  getPrestataireStats 
} = require("../controllers/statsController.js");

const router = express.Router();

// Statistiques pour un prestataire donné (par userId)
router.get("/prestataire/:userId", getPrestataireStats);

// Route GET /api/stats
router.get("/", getStats);

// Route GET /api/stats/activity
router.get("/activity", getActivityStats);

module.exports = router;
