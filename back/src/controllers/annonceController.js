const Annonce = require('../models/Annonce');

exports.createAnnonce = async (req, res) => {
  try {
    const { titre, description, type } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename);
    } else if (req.body.images) {
      images = req.body.images;
    }
    const annonce = new Annonce({ titre, description, type, user: req.user._id, images });
    await annonce.save();
    res.status(201).json({ message: 'Annonce créée', annonce });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find();
    res.json(annonces);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getAnnonceById = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    res.json(annonce);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteAnnonce = async (req, res) => {
  try {
    await Annonce.findByIdAndDelete(req.params.id);
    res.json({ message: 'Annonce supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    res.json({ message: 'Annonce mise à jour', annonce });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
