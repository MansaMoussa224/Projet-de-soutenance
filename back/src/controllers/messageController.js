const mongoose = require('mongoose');
// Supprimer un message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression', error: err.message });
  }
};
const Message = require('../models/Message');
const User = require('../models/User');

// Envoyer un message (client -> prestataire)
exports.createMessage = async (req, res) => {
  try {
    const { expediteur, destinataire, annonce, sujet, contenu } = req.body;
    // Vérification explicite de l'ObjectId du destinataire
    if (!destinataire || !mongoose.Types.ObjectId.isValid(destinataire)) {
      return res.status(400).json({ message: 'Le destinataire doit être un ObjectId MongoDB valide.' });
    }
    const message = new Message({ expediteur, destinataire, annonce, sujet, contenu });
    await message.save();
    res.status(201).json({ message });
  } catch (err) {
    res.status(400).json({ message: 'Erreur création', error: err.message });
  }
};

// Récupérer tous les messages reçus par un prestataire
exports.getMessagesByPrestataire = async (req, res) => {
  try {
    const destinataire = req.params.prestataireId;
    let messages = await Message.find({ destinataire })
      .populate({
        path: 'expediteur',
        select: 'nom prenom email',
        strictPopulate: false
      })
      .populate('annonce', 'titre');
    // Si expediteur n'est pas un ObjectId (donc un email), on le laisse brut
    messages = messages.map(m => {
      if (typeof m.expediteur === 'object' && m.expediteur && m.expediteur.email) return m;
      if (typeof m.expediteur === 'string') return { ...m.toObject(), expediteur: { email: m.expediteur } };
      return m;
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Répondre à un message (prestataire -> client)
exports.replyMessage = async (req, res) => {
  try {
    const { expediteur, destinataire, sujet, contenu } = req.body;
    const message = new Message({ expediteur, destinataire, sujet, contenu });
    await message.save();
    res.status(201).json({ message });
  } catch (err) {
    res.status(400).json({ message: 'Erreur envoi réponse', error: err.message });
  }
};
