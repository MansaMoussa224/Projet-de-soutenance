const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');

// Toutes les commandes d'un prestataire
router.get('/prestataire/:prestataireId', commandeController.getCommandesByPrestataire);
// Créer une commande
router.post('/', commandeController.createCommande);
// Supprimer une commande
router.delete('/:id', commandeController.deleteCommande);
// Marquer comme traitée
router.patch('/:id/traiter', commandeController.traiterCommande);

module.exports = router;
