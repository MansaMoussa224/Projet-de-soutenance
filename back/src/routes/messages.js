
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
// Supprimer un message
router.delete('/:id', messageController.deleteMessage);

// Envoyer un message
router.post('/', messageController.createMessage);
// Tous les messages reçus par un prestataire
router.get('/prestataire/:prestataireId', messageController.getMessagesByPrestataire);
// Répondre à un message
router.post('/reply', messageController.replyMessage);

module.exports = router;
