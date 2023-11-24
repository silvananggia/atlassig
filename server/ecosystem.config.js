module.exports = {
    apps: [
      {
        name: 'atlas-server',
        script: 'server.js',
        watch: true,
        ignore_watch: ['node_modules', 'client'],
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  