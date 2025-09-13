// backend/routes/userRoutes.js
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { approveUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

// Admin → approuver un compte
router.put("/:id/approve", protect, authorize("admin"), approveUser);

// Admin → voir tous les utilisateurs
router.get("/", protect, authorize("admin"), getUsers);

// Client validé → accès à son espace
router.get("/me/space", protect, authorize("client", "prestataire"), (req, res) => {
  if (!req.user.isApproved) {
    return res.status(403).json({ message: "Compte non approuvé par l’admin" });
  }
  res.json({ message: "Accès espace OK", space: req.user.space });
});

export default router;
