const Annonce = require('../models/Annonce');
const Space = require('../models/Space');
const Service = require('../models/Service');

// Recherche multi-critères sur tous les types
exports.globalSearch = async (req, res) => {
  try {
    const { searchTerm = '', type = '', localite = '', prix = '' } = req.query;
    let results = [];
    // Recherche sur les annonces
    if (type === 'hotel' || type === 'restaurant' || type === 'plage' || type === 'evenement') {
      results = await Annonce.find({
        titre: { $regex: searchTerm, $options: 'i' },
        type: type ? type : { $exists: true },
        ...(localite && { description: { $regex: localite, $options: 'i' } })
      });
    }
    // Recherche sur les espaces (si type vide ou type espace)
    if (!type || type === 'espace') {
      const spaces = await Space.find({
        name: { $regex: searchTerm, $options: 'i' },
        ...(localite && { neighborhood: { $regex: localite, $options: 'i' } })
      });
      results = results.concat(spaces);
    }
    // Recherche sur les services
    if (!type || type === 'service' || type === 'transport') {
      const services = await Service.find({
        name: { $regex: searchTerm, $options: 'i' },
        ...(localite && { description: { $regex: localite, $options: 'i' } })
      });
      results = results.concat(services);
    }
    // Filtre prix si applicable (pour annonces et espaces)
    if (prix) {
      results = results.filter(item => (item.prix && item.prix <= Number(prix)) || !item.prix);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
