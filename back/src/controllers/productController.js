const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Produit créé', product });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getProductsBySpace = async (req, res) => {
  try {
    const products = await Product.find({ space: req.params.spaceId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit mis à jour', product });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Exporter toutes les fonctions du contrôleur
module.exports = {
  createProduct: exports.createProduct,
  getProductsBySpace: exports.getProductsBySpace,
  updateProduct: exports.updateProduct,
  deleteProduct: exports.deleteProduct
};
