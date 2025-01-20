module.exports = {
  apps: [
    {
      name: 'bpr-revamp-be-ipusnas',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
