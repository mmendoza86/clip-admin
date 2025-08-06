// config/express.js
const express = require('express');

module.exports = (app) => {
  // Permitir JSON y formularios grandes
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  return app;
};
