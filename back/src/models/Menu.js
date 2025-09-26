const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // expire après 24h
});

module.exports = mongoose.model('Menu', menuSchema);
