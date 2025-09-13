const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// CRUD produits pour un espace
router.post('/', productController.createProduct);
router.get('/space/:spaceId', productController.getProductsBySpace);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
