// backend/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Vérifie que l’utilisateur est connecté
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "❌ Utilisateur introuvable" });
      }

      next();
    } catch (error) {
      console.error("Erreur JWT:", error.message);
      return res.status(401).json({ message: "❌ Token invalide ou expiré" });
    }
  } else {
    return res.status(401).json({ message: "❌ Non autorisé, pas de token fourni" });
  }
};

// Vérifie que l’utilisateur a au moins un des rôles requis
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: "⚠️ Accès refusé, utilisateur non défini" });
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: "⚠️ Accès refusé, rôle insuffisant" });
    }

    next();
  };
};

module.exports = { protect, authorize };
