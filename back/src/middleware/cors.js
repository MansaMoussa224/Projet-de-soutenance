// Middleware CORS
const cors = require('cors');

module.exports = cors({
  origin: 'http://localhost:5000',
  credentials: true
});
