const express = require('express');
const router = express.Router();
const Favori = require('../models/Favori');

// Ajouter un favori
router.post('/', async (req, res) => {
  try {
    const { userId, itemId, itemType, listName } = req.body;
    const favori = new Favori({ user: userId, item: itemId, type: itemType, listName });
    await favori.save();
    res.status(201).json({ message: 'Ajouté aux favoris', favori });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Récupérer les favoris d'un utilisateur
router.get('/:userId', async (req, res) => {
  try {
    const favoris = await Favori.find({ user: req.params.userId });
    res.json(favoris);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;
