const express = require("express");
const { loginUser, registerUser } = require("../controllers/authController");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔑 Auth routes
router.post("/login", loginUser);
router.post("/register", registerUser);

// 🔒 Route admin pour récupérer tous les utilisateurs
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Erreur récupération utilisateurs:", err.message);
    res.status(500).json({ message: "⚠️ Erreur serveur" });
  }
});

module.exports = router;
