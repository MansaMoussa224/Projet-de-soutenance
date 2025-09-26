const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prestataire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sujet: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
