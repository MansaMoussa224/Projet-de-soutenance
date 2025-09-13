const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/spaceController');
const Space = require('../models/Space');

// Créer un espace
router.post('/', spaceController.createSpace);
// Approbation/rejet
router.patch('/:id/approve', spaceController.approveSpace);
router.patch('/:id/reject', spaceController.rejectSpace);
// Voir un espace
router.get('/:id', spaceController.getSpaceById);


// Modifier un espace
router.put('/:id', spaceController.updateSpace);
// Supprimer un espace
router.delete('/:id', spaceController.deleteSpace);
// Récupérer tous les espaces
router.get('/', async (req, res) => {
  try {
    const spaces = await Space.find();
    res.json(spaces);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
