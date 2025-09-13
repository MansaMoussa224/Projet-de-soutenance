const express = require('express');
const router = express.Router();



const annonceController = require('../controllers/annonceController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

// CRUD annonces
router.post('/', protect, upload.array('images', 10), annonceController.createAnnonce);
router.get('/', annonceController.getAnnonces);
router.get('/:id', annonceController.getAnnonceById);
router.delete('/:id', annonceController.deleteAnnonce);
router.patch('/:id', annonceController.updateAnnonce);

module.exports = router;
