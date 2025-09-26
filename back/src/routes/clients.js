const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Tous les clients d'un prestataire
router.get('/prestataire/:prestataireId', clientController.getClientsByPrestataire);

module.exports = router;
