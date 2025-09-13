const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prestataire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  statut: { type: String, enum: ['En cours', 'Terminé', 'Annulé'], default: 'En cours' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commande', commandeSchema);
