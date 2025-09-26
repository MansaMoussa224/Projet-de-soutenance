const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// Publier un menu
router.post('/', async (req, res) => {
  try {
    const { titre, description, image } = req.body;
    const menu = new Menu({ titre, description, image, createdAt: Date.now() });
    await menu.save();
    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la publication du menu.' });
  }
});

// Récupérer le menu du jour (moins de 24h)
router.get('/du-jour', async (req, res) => {
  try {
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
    const menu = await Menu.findOne({ createdAt: { $gte: twentyFourHoursAgo } }).sort({ createdAt: -1 });
    if (!menu) return res.status(404).json({ error: 'Aucun menu du jour.' });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération du menu.' });
  }
});

module.exports = router;
