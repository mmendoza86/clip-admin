const express = require('express');
const next = require('next');
const path = require('path');
const errorHandlers = require('./middlewares/errorHandlers');
const reportesRoutes = require('./routes/reportes');

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  // Permitir payloads grandes (JSON y URL-encoded)
  server.use(express.json({ limit: '10mb' }));
  server.use(express.urlencoded({ limit: '10mb', extended: true }));


  console.log("✅ Next.js preparado, iniciando Express...");

  // Errores globales
  errorHandlers(server);

  // Rutas de reportes
  server.use('/', reportesRoutes);

  // Rutas Next.js (solo GET que no sean API ni reportes)
  server.get(/^\/(?!api|reportes).*/, (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  console.log("📡 Iniciando servidor Express...");
  server.listen(port, () => {
    console.log(`🚀 Servidor listo en http://localhost:${port}`);
  });
});
