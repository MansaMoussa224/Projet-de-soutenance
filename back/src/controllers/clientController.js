const Commande = require('../models/Commande');
const Message = require('../models/Message');
const Reservation = require('../models/Reservation');
const Contact = require('../models/Contact');
const User = require('../models/User');

// Récupérer tous les clients uniques d'un prestataire (commande, message, réservation, contact)
exports.getClientsByPrestataire = async (req, res) => {
  try {
    const prestataireId = req.params.prestataireId;
    // Clients ayant passé commande
    const clientIdsCmd = await Commande.distinct('client', { prestataire: prestataireId });
    // Clients ayant envoyé un message
    const clientIdsMsg = await Message.distinct('expediteur', { destinataire: prestataireId });
    // Clients ayant fait une réservation
    const clientIdsRes = await Reservation.distinct('client', { prestataire: prestataireId });
    // Clients ayant envoyé un contact
    const clientIdsContact = await Contact.distinct('client', { prestataire: prestataireId });
    // Fusionner et filtrer les null/undefined
    const allClientIds = [...new Set([
      ...clientIdsCmd,
      ...clientIdsMsg,
      ...clientIdsRes,
      ...clientIdsContact
    ].filter(Boolean))];
    // Récupérer les infos des clients
    const clients = await User.find({ _id: { $in: allClientIds } }, 'nom prenom email phone adresse');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
