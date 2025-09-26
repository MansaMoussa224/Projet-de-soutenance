const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  expediteur: { type: mongoose.Schema.Types.Mixed, required: true }, // ObjectId (User) ou email (String)
  destinataire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  annonce: { type: mongoose.Schema.Types.ObjectId, ref: 'Annonce' },
  sujet: { type: String },
  contenu: { type: String, required: true },
  lu: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
