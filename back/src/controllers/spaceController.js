
const Space = require('../models/Space');
const { sendMail } = require('../utils/mailer');


// Validation d'un espace par l'admin
async function approveSpace(req, res) {
  try {
    const space = await Space.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!space) return res.status(404).json({ message: "Espace non trouvé" });

    // Promotion du user lié à l'espace au rôle prestataire
    const User = require('../models/User');
    const user = await User.findOne({ space: space._id });
    let accessKey = null;
    if (user) {
      if (!user.roles.includes('prestataire')) {
        user.roles.push('prestataire');
      }
      user.isApproved = true;
      // Génère une clé d'accès unique (simple UUID)
      accessKey = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      user.dashboardAccessKey = accessKey;
      await user.save();
    }

    // Envoi d'email au créateur avec lien et clé d'accès
    if (space.email && user) {
      const dashboardUrl = `http://localhost:3000/prestataire/dashboard?key=${accessKey}`;
      await sendMail({
        to: space.email,
        subject: 'Votre espace a été approuvé !',
        text: `Bonjour, votre espace "${space.name}" est maintenant approuvé. Accédez à votre dashboard prestataire ici : ${dashboardUrl} (clé : ${accessKey})`,
        html: `<p>Bonjour,</p><p>Votre espace <strong>${space.name}</strong> est maintenant <span style='color:green'>approuvé</span> et opérationnel sur MansaHub.</p><p>Accédez à votre <a href='${dashboardUrl}'>dashboard prestataire</a>.<br/>Clé d'accès : <b>${accessKey}</b></p>`,
      });
    }
    res.json({ message: "Espace approuvé", space });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de l'approbation." });
  }
}

// Rejet d'un espace par l'admin
async function rejectSpace(req, res) {
  try {
    const space = await Space.findByIdAndUpdate(req.params.id, { approved: false, rejected: true }, { new: true });
    if (!space) return res.status(404).json({ message: "Espace non trouvé" });

    // Envoi d'email au créateur
    if (space.email) {
      await sendMail({
        to: space.email,
        subject: 'Votre demande de création d\'espace a été rejetée',
        text: `Bonjour, votre demande pour l'espace "${space.name}" a été rejetée.`,
        html: `<p>Bonjour,</p><p>Votre demande pour l'espace <strong>${space.name}</strong> a été <span style='color:red'>rejetée</span> par l'administrateur.</p>`,
      });
    }
    res.json({ message: "Espace rejeté", space });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors du rejet." });
  }
}

const User = require('../models/User');
async function createSpace(req, res) {
  try {
    const { profilePhoto, password, confirmPassword, email, name, ...spaceData } = req.body;
    // Validation simple côté backend
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Email requis.' });
    }
    // Vérifie si l'utilisateur existe déjà
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }
    // Crée le user prestataire
    const user = new User({
      name: name || spaceData.name,
      email,
      password,
      roles: ['prestataire'],
      isApproved: false // l'admin devra approuver
    });
    await user.save();
    // Crée l'espace et lie au user
    const space = new Space({
      ...spaceData,
      name,
      email,
      approved: false,
      rejected: false
    });
    await space.save();
    // Lie l'espace au user
    user.space = space._id;
    await user.save();
    res.status(201).json({ message: 'Espace et utilisateur créés avec succès', space, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'espace.' });
  }
}

// Voir un espace par ID
async function getSpaceById(req, res) {
  try {
    const space = await Space.findById(req.params.id);
    if (!space) return res.status(404).json({ message: "Espace non trouvé" });
    res.json(space);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la récupération." });
  }
}

// Modifier un espace
async function updateSpace(req, res) {
  try {
    const space = await Space.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!space) return res.status(404).json({ message: "Espace non trouvé" });
    res.json({ message: "Espace modifié", space });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la modification." });
  }
}

// Supprimer un espace
async function deleteSpace(req, res) {
  try {
    const space = await Space.findByIdAndDelete(req.params.id);
    if (!space) return res.status(404).json({ message: "Espace non trouvé" });
    res.json({ message: "Espace supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression." });
  }
}

module.exports = {
  approveSpace,
  rejectSpace,
  createSpace,
  getSpaceById,
  updateSpace,
  deleteSpace
};
