// config/pm2.config.js
module.exports = {
  apps: [
    {
      name: 'clip-admin-front',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
