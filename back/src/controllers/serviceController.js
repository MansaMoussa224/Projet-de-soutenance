const Service = require('../models/Service');
// Récupérer tous les services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un service
exports.createService = async (req, res) => {
  try {
    const { name, description } = req.body;
    const service = new Service({ name, description });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création' });
  }
};

// Supprimer un service
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

// Modifier un service
exports.updateService = async (req, res) => {
  try {
    const { name, description } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification' });
  }
};
const { sendMail } = require('../utils/mailer');

exports.requestService = async (req, res) => {
  try {
    const { service, date, lieu, description, userEmail } = req.body;
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `Demande de service : ${service}`,
      text: `Nouvelle demande de service :\nService : ${service}\nDate : ${date}\nLieu : ${lieu}\nDescription : ${description}\nDemandeur : ${userEmail}`,
      html: `<h2>Nouvelle demande de service</h2><ul><li><strong>Service :</strong> ${service}</li><li><strong>Date :</strong> ${date}</li><li><strong>Lieu :</strong> ${lieu}</li><li><strong>Description :</strong> ${description}</li><li><strong>Demandeur :</strong> ${userEmail}</li></ul>`
    });
    res.json({ message: 'Demande envoyée à l\'admin.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi de la demande.' });
  }
};
