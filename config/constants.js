// config/constants.js
const path = require('path');

module.exports = {
  REPORTES_DIR: path.join(__dirname, '../public/reportes'),
  MAX_REPORTES: 5,
  SERVER_PORT: process.env.PORT || 5001,
};
