const next = require('next');
const express = require('express');
const { SERVER_PORT } = require('./config/constants');
const configureExpress = require('./config/express');
const logger = require('./config/logger');
const errorHandlers = require('./middlewares/errorHandlers');
const reportesRoutes = require('./routes/reportes');

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Configuración de Express
  configureExpress(server);

  // Manejo de errores globales
  errorHandlers();

  logger.info('✅ Next.js preparado, iniciando Express...');

  // Rutas API
  server.use('/', reportesRoutes);

  // Rutas de Next.js (GET que no sean API ni reportes)
  server.get(/^\/(?!api|reportes).*/, (req, res) => {
    return handle(req, res);
  });

  // Iniciar servidor
  server.listen(SERVER_PORT, () => {
    logger.info(`🚀 Servidor listo en http://localhost:${SERVER_PORT}`);
  });
});
