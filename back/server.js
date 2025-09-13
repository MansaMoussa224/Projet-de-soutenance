// Démarrage du serveur Express
require('dotenv').config();
const express = require('express');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const cors = require('cors'); // Le package est correctement importé


const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

// Correction : Utilisation du middleware CORS pour autoriser les requêtes cross-origin
app.use(cors());

app.use(express.json({ limit: '50mb' })); // Augmente la limite pour les requêtes JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Bonne pratique pour les formulaires HTML

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});