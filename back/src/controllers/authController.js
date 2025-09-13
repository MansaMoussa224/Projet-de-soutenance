// backend/controllers/authController.js
import User, { ROLES } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 🔑 Génération du token
const generateToken = (userId, roles) => {
  return jwt.sign({ id: userId, roles }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "❌ Utilisateur introuvable" });
    }

    // Vérifie le mot de passe
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Mot de passe incorrect" });
    }

    // Vérifie si compte approuvé (seulement pour prestataire)
    if (user.roles.includes("prestataire") && !user.isApproved) {
      return res.status(403).json({ message: "⚠️ Compte en attente d’approbation" });
    }

    // Retourne le token et les infos utilisateur
    res.json({
      token: generateToken(user._id, user.roles),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isApproved: user.isApproved,
        space: user.space,
        dashboardAccessKey: user.dashboardAccessKey,
      },
    });
  } catch (err) {
    console.error("❌ Erreur login:", err.message);
    res.status(500).json({ message: "⚠️ Erreur serveur" });
  }
};

// @desc    Inscription utilisateur
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, roles } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "❌ Cet email est déjà utilisé" });
    }

    // Validation des rôles (on garde seulement ceux autorisés)
    let userRoles = ["client"]; // Par défaut = client
    if (roles && Array.isArray(roles) && roles.length > 0) {
      userRoles = roles.filter((r) => ROLES.includes(r));
      if (userRoles.length === 0) userRoles = ["client"];
    } else if (typeof roles === "string" && ROLES.includes(roles)) {
      userRoles = [roles];
    }

    // Création du nouvel utilisateur
    const user = await User.create({
      name,
      email,
      password,
      roles: userRoles,
    });

    res.status(201).json({
      token: generateToken(user._id, user.roles),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (err) {
    console.error("❌ Erreur register:", err.message);
    res.status(500).json({ message: "⚠️ Erreur serveur" });
  }
};
