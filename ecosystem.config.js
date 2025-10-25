// ecosystem.config.js - PM2 Configuration for Production Deployment

module.exports = {
  apps: [
    {
      name: 'farsi-ml-backend',
      script: 'server/index.js',
      cwd: './',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOST: '0.0.0.0'
      },
      
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
        HOST: '0.0.0.0'
      },
      
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001,
        HOST: '0.0.0.0'
      },

      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Memory management
      max_memory_restart: '1G',
      
      // Monitoring
      monitoring: false,
      
      // Advanced settings
      node_args: '--max-old-space-size=2048',
      
      // Auto restart on file changes (development only)
      watch: false,
      ignore_watch: [
        'node_modules',
        'logs',
        'data',
        'client/dist',
        'client/node_modules'
      ],
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Health check
      health_check_grace_period: 3000
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/farsi-model-trainer.git',
      path: '/var/www/farsi-model-trainer',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    },
    
    staging: {
      user: 'deploy',
      host: ['staging-server-ip'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-username/farsi-model-trainer.git',
      path: '/var/www/farsi-model-trainer-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging'
    }
  }
};