const mongoose = require('mongoose');


const bcrypt = require('bcryptjs');

const spaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  email: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  neighborhood: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  approved: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Space', spaceSchema);
