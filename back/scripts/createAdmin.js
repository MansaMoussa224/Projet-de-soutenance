// backend/scripts/createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nom_de_ta_db";

async function createAdmin() {
  await mongoose.connect(MONGO_URI);

  const email = "admin@admin.com";
  const password = "admin123";
  const name = "SuperAdmin";

  // Vérifie si l'admin existe déjà
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Un admin avec cet email existe déjà.");
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  const admin = new User({
    name,
    email,
    password: hash,
    roles: ["admin"],
    isApproved: true
  });
  await admin.save();
  console.log("✅ Admin créé :", email, "/ mot de passe :", password);
  process.exit(0);
}

createAdmin();
