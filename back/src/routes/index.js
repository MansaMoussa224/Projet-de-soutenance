const express = require('express');
const router = express.Router();





const authRoutes = require('./auth');
const spacesRoutes = require('./spaces');
const productsRoutes = require('./products');
const servicesRoutes = require('./services');
const annoncesRoutes = require('./annonces');

const statsRoutes = require('./stats');



router.use('/auth', authRoutes);
router.use('/spaces', spacesRoutes);
router.use('/products', productsRoutes);
router.use('/services', servicesRoutes);
router.use('/annonces', annoncesRoutes);
router.use('/stats', statsRoutes);

module.exports = router;