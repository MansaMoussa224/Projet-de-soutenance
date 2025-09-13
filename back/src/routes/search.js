
const searchController = require('../controllers/searchController');
router.get('/', searchController.globalSearch);

module.exports = router;
