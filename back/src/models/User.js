// backend/models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Liste centralisée des rôles autorisés
const ROLES = ["client", "prestataire", "admin", "moderateur", "gestionnaire"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nom ou username
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      enum: ROLES,
      default: ["client"],
    },
    isApproved: { type: Boolean, default: false },
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      default: null,
    },
    dashboardAccessKey: { type: String, default: null },
  },
  { timestamps: true }
);

// 🔒 Hash du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Méthode pour comparer un mot de passe
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 📌 Vérifie si l'utilisateur a un rôle précis
userSchema.methods.hasRole = function (role) {
  return this.roles.includes(role);
};

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;
