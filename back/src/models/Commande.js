const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  nom: { type: String },
  email: { type: String },
  date: { type: String },
  personnes: { type: String },
  message: { type: String },
  produit: { type: String },
  quantite: { type: String },
  details: { type: String },
  prestataire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: false },
  annonce: { type: mongoose.Schema.Types.ObjectId, ref: 'Annonce', required: false },
  statut: { type: String, enum: ['En cours', 'Terminé', 'Annulé','traitée'], default: 'En cours' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commande', commandeSchema);
