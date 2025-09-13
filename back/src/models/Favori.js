const mongoose = require('mongoose');

const favoriSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: String, required: true }, // id de l'élément (annonce, espace, service...)
  type: { type: String, required: true }, // annonce, espace, service, etc.
  listName: { type: String, default: 'Favoris' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favori', favoriSchema);
