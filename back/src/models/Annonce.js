const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  type: { type: String, enum: ['evenement', 'hotel', 'restaurant', 'plage'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  validee: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Annonce', annonceSchema);
