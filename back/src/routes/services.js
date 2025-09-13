const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// CRUD pour les services (admin)
router.get('/', serviceController.getAllServices);
router.post('/', serviceController.createService);
router.delete('/:id', serviceController.deleteService);
router.put('/:id', serviceController.updateService);

// Route pour la demande de service (utilisateur)
router.post('/request', serviceController.requestService);

module.exports = router;
