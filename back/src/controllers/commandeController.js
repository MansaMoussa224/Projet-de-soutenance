const Commande = require('../models/Commande');
const User = require('../models/User');
const Service = require('../models/Service');

// Obtenir toutes les commandes d'un prestataire
exports.getCommandesByPrestataire = async (req, res) => {
  try {
    const prestataireId = req.params.prestataireId;
    const commandes = await Commande.find({ prestataire: prestataireId })
      .populate('client', 'nom prenom email')
      .populate('service', 'name');
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Créer une commande (libre ou liée à un service)
exports.createCommande = async (req, res) => {
  try {
    const {
      client, nom, email, date, personnes, message,
      produit, quantite, details, prestataire, service, annonce
    } = req.body;
    const commande = new Commande({
      client, nom, email, date, personnes, message,
      produit, quantite, details, prestataire, service, annonce
    });
    await commande.save();
    res.status(201).json({ commande });
  } catch (err) {
    res.status(400).json({ message: 'Erreur création', error: err.message });
  }
};

// Supprimer une commande
exports.deleteCommande = async (req, res) => {
  try {
    await Commande.findByIdAndDelete(req.params.id);
    res.json({ message: 'Commande supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression', error: err.message });
  }
};

// Marquer une commande comme traitée
exports.traiterCommande = async (req, res) => {
  try {
    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      { statut: 'traitée' },
      { new: true }
    );
    res.json(commande);
  } catch (err) {
    res.status(500).json({ message: 'Erreur traitement', error: err.message });
  }
};
