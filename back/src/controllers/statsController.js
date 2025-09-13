// Statistiques détaillées pour un prestataire (commandes, services, clients, annonces)
const Commande = require('../models/Commande');
const getPrestataireStats = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Commandes par mois (12 derniers mois)
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
    // Commandes par mois
    const commandesByMonth = await Commande.aggregate([
      { $match: { prestataire: userId } },
      { $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 }
      }}
    ]);
    const commandesData = months.map(({ year, month }) => ({
      date: `${year}-${month+1}`,
      commandes: commandesByMonth.find(c => c._id.year === year && c._id.month === month+1)?.count || 0
    }));
    // Services les plus populaires
    const services = await Service.find({ prestataire: userId });
    const servicesData = await Promise.all(services.map(async s => {
      const clientsCount = await Commande.countDocuments({ service: s._id });
      return { service: s.name, clients: clientsCount };
    }));
    // Clients distincts
    const clients = await Commande.distinct('client', { prestataire: userId });
    // Annonces par mois
    const annoncesByMonth = await Annonce.aggregate([
      { $match: { user: userId } },
      { $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 }
      }}
    ]);
    const annoncesData = months.map(({ year, month }) => ({
      date: `${year}-${month+1}`,
      annonces: annoncesByMonth.find(a => a._id.year === year && a._id.month === month+1)?.count || 0
    }));
    res.json({
      commandesData,
      servicesData,
      clientsCount: clients.length,
      annoncesData
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
// Statistiques d'activité mensuelle (utilisateurs, espaces, annonces, services)
const getActivityStats = async (req, res) => {
  try {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

    // Helper pour compter par mois
    const countByMonth = async (Model, dateField = 'createdAt', extraQuery = {}) => {
      const pipeline = [
        { $match: extraQuery },
        {
          $group: {
            _id: { year: { $year: `$${dateField}` }, month: { $month: `$${dateField}` } },
            count: { $sum: 1 }
          }
        }
      ];
      const results = await Model.aggregate(pipeline);
      return results.reduce((acc, cur) => {
        acc[`${cur._id.year}-${cur._id.month - 1}`] = cur.count;
        return acc;
      }, {});
    };

    const usersByMonth = await countByMonth(User);
    const spacesByMonth = await countByMonth(Space);
    const annoncesByMonth = await countByMonth(Annonce);
    const servicesByMonth = await countByMonth(Service);

    const data = months.map(({ year, month }) => ({
      month,
      year,
      users: usersByMonth[`${year}-${month}`] || 0,
      spaces: spacesByMonth[`${year}-${month}`] || 0,
      annonces: annoncesByMonth[`${year}-${month}`] || 0,
      services: servicesByMonth[`${year}-${month}`] || 0,
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const User = require('../models/User');
const Space = require('../models/Space');
const Service = require('../models/Service');
const Annonce = require('../models/Annonce');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClients = await User.countDocuments({ roles: 'client' });
    const totalPrestataires = await User.countDocuments({ roles: 'prestataire' });
    const totalAdmins = await User.countDocuments({ roles: 'admin' });
    const totalSpaces = await Space.countDocuments();
    const totalSpacesPending = await Space.countDocuments({ approved: false, rejected: false });
    const totalSpacesApproved = await Space.countDocuments({ approved: true });
    const totalServices = await Service.countDocuments();
    const totalAnnonces = await Annonce.countDocuments();
    const totalAnnoncesValidees = await Annonce.countDocuments({ validee: true });

    res.json({
      totalUsers,
      totalClients,
      totalPrestataires,
      totalAdmins,
      totalSpaces,
      totalSpacesPending,
      totalSpacesApproved,
      totalServices,
      totalAnnonces,
      totalAnnoncesValidees
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = {
  getStats,
  getActivityStats,
  getPrestataireStats
};
