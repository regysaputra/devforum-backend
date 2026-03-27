module.exports = {
  apps: [
    {
      name: "dev-forum-api",
      script: "./devforum-backend/src/app.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env_file: ".env",      // PM2 will load variables from this file
      env: {
        NODE_ENV: "development" // You can still keep PM2-specific overrides here
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "dev-forum-worker",
      script: "./devforum-backend/src/worker.js",
      instances: 2,
      exec_mode: "cluster",
      watch: false,
      env_file: ".env",      // Worker gets the Redis credentials securely from here
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};