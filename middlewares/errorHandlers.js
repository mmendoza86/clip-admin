module.exports = (server) => {
  process.on('uncaughtException', err => {
    console.error('❌ Excepción no atrapada:', err);
  });

  process.on('unhandledRejection', err => {
    console.error('❌ Promesa rechazada sin manejar:', err);
  });
};
