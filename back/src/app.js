// Point d'entrée principal du backend
const express = require('express');
const app = express();
const routes = require('./routes');

const cors = require('cors'); // ✨ Correction ici : importez 'cors' directement
const path = require('path');

app.use(express.json()); // Middleware pour le JSON, à mettre avant les routes
app.use(cors()); // ✨ Correction ici : appelez cors() comme une fonction
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Sert les images uploadées
app.use('/api', routes);

module.exports = app;