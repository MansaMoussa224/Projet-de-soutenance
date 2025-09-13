import User from '../models/User.js';

// GET /api/users - Liste tous les utilisateurs
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/users/:id/approve - Approuve un utilisateur
export const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur approuvé', user });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
