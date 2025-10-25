# Production Deployment Guide

This guide covers deploying the Farsi Model Trainer to a production VPS environment with PM2, Nginx, and optional Docker support.

## 📋 Prerequisites

### System Requirements
- **OS:** Ubuntu 20.04+ or CentOS 8+
- **RAM:** Minimum 4GB, Recommended 8GB+
- **CPU:** Minimum 2 cores, Recommended 4+ cores
- **Storage:** Minimum 50GB SSD
- **Network:** Public IP address and domain name

### Software Requirements
- Node.js 18+
- Nginx
- PM2
- Git
- SSL Certificate (Let's Encrypt recommended)

## 🚀 Quick Deployment (Recommended)

### 1. VPS Initial Setup

```bash
# Download and run the VPS setup script
curl -fsSL https://raw.githubusercontent.com/your-repo/farsi-model-trainer/main/scripts/setup-vps.sh | bash

# Or manually:
wget https://raw.githubusercontent.com/your-repo/farsi-model-trainer/main/scripts/setup-vps.sh
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

### 2. Deploy Application

```bash
# Clone the repository
git clone https://github.com/your-repo/farsi-model-trainer.git
cd farsi-model-trainer

# Run deployment script
./scripts/deploy-production.sh --domain your-domain.com --user deploy
```

### 3. Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Test API endpoints
node scripts/test-api-endpoints.js

# Check application logs
pm2 logs farsi-ml-backend
```

## 🐳 Docker Deployment (Alternative)

### 1. Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Deploy with Docker

```bash
# Clone repository
git clone https://github.com/your-repo/farsi-model-trainer.git
cd farsi-model-trainer

# Build and start services
docker-compose -f docker-compose.production.yml up -d

# With monitoring (optional)
docker-compose -f docker-compose.production.yml --profile monitoring up -d
```

### 3. Manage Docker Services

```bash
# View logs
docker-compose -f docker-compose.production.yml logs -f

# Scale backend
docker-compose -f docker-compose.production.yml up -d --scale backend=3

# Update services
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d
```

## ⚙️ Manual Deployment

### 1. System Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Create Deploy User

```bash
# Create deploy user
sudo adduser deploy
sudo usermod -aG sudo deploy

# Setup SSH access
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

### 3. Deploy Application

```bash
# Switch to deploy user
sudo su - deploy

# Clone repository
git clone https://github.com/your-repo/farsi-model-trainer.git
cd farsi-model-trainer

# Install dependencies
npm install
cd client && npm install && npm run build && cd ..

# Configure PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. Configure Nginx

```bash
# Copy Nginx configuration
sudo cp nginx.production.conf /etc/nginx/sites-available/farsi-model-trainer

# Update domain name
sudo sed -i 's/your-domain.com/yourdomain.com/g' /etc/nginx/sites-available/farsi-model-trainer

# Enable site
sudo ln -s /etc/nginx/sites-available/farsi-model-trainer /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Setup SSL

```bash
# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in the project root:

```bash
# Production environment
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database
DATABASE_URL=sqlite:///app/data/app.db

# Security
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# File uploads
MAX_FILE_SIZE=10737418240  # 10GB
UPLOAD_PATH=/var/www/farsi-model-trainer/data/uploads

# Monitoring
ENABLE_MONITORING=true
METRICS_PORT=9090
```

### PM2 Configuration

The `ecosystem.config.js` file is pre-configured for production. Key settings:

- **Instances:** Uses all CPU cores
- **Memory limit:** 1GB per instance
- **Auto-restart:** On crashes and memory limit
- **Log rotation:** Automatic
- **Health checks:** Built-in

### Nginx Configuration

The `nginx.production.conf` includes:

- **SSL/TLS:** Modern security settings
- **Gzip compression:** For static assets
- **Rate limiting:** API protection
- **Proxy settings:** Backend communication
- **Static file serving:** Optimized caching
- **Security headers:** XSS, CSRF protection

## 📊 Monitoring

### Built-in Monitoring

The application includes built-in monitoring accessible at:

- **System Metrics:** `/api/monitoring/metrics`
- **Health Check:** `/api/health`
- **Application Logs:** `/api/monitoring/logs`
- **Alerts:** `/api/monitoring/alerts`

### PM2 Monitoring

```bash
# View process status
pm2 status

# View logs
pm2 logs

# View metrics
pm2 monit

# Restart application
pm2 restart farsi-ml-backend

# Reload without downtime
pm2 reload farsi-ml-backend
```

### External Monitoring (Optional)

With Docker deployment, you can enable:

- **Prometheus:** Metrics collection
- **Grafana:** Visualization dashboards
- **Loki:** Log aggregation
- **AlertManager:** Alert notifications

Access at:
- Grafana: `http://your-domain.com:3000`
- Prometheus: `http://your-domain.com:9090`

## 🔒 Security

### Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow SSH, HTTP, HTTPS
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

### SSL/TLS Security

The Nginx configuration includes:

- **TLS 1.2/1.3 only**
- **Strong cipher suites**
- **HSTS headers**
- **Security headers** (XSS, CSRF, etc.)

### Application Security

- **Path sanitization** for file operations
- **Input validation** on all endpoints
- **Rate limiting** on API routes
- **CORS configuration** for frontend
- **JWT authentication** (if enabled)

## 🔄 Updates and Maintenance

### Application Updates

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install
cd client && npm install && npm run build && cd ..

# Restart application
pm2 reload farsi-ml-backend
```

### System Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js (if needed)
sudo npm install -g n
sudo n stable

# Update PM2
sudo npm update -g pm2
```

### Backup Strategy

```bash
# Backup application data
tar -czf backup-$(date +%Y%m%d).tar.gz data/ logs/

# Backup database (if using external DB)
# mysqldump -u user -p database > backup.sql

# Upload to remote storage
# aws s3 cp backup-$(date +%Y%m%d).tar.gz s3://your-backup-bucket/
```

## 🚨 Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   # Check PM2 logs
   pm2 logs farsi-ml-backend
   
   # Check system resources
   htop
   df -h
   ```

2. **Nginx errors**
   ```bash
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   
   # Test configuration
   sudo nginx -t
   ```

3. **SSL certificate issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificate
   sudo certbot renew
   ```

4. **High memory usage**
   ```bash
   # Check memory usage
   free -h
   
   # Restart PM2 processes
   pm2 restart all
   ```

### Performance Optimization

1. **Enable Gzip compression** (already configured)
2. **Use CDN** for static assets
3. **Database optimization** (indexing, query optimization)
4. **Caching** (Redis for sessions/cache)
5. **Load balancing** (multiple backend instances)

### Log Analysis

```bash
# Application logs
pm2 logs farsi-ml-backend --lines 100

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -u nginx -f
```

## 📞 Support

For deployment issues:

1. Check the troubleshooting section above
2. Review application logs: `pm2 logs`
3. Check system resources: `htop`, `df -h`
4. Verify network connectivity: `curl -I http://localhost:3001/api/health`
5. Test API endpoints: `node scripts/test-api-endpoints.js`

## 🎯 Production Checklist

- [ ] VPS meets minimum requirements
- [ ] Domain name configured with DNS
- [ ] SSL certificate installed and working
- [ ] Application starts without errors
- [ ] All API endpoints responding
- [ ] File uploads working
- [ ] Monitoring enabled and accessible
- [ ] Backups configured
- [ ] Firewall properly configured
- [ ] Performance optimizations applied
- [ ] Security headers configured
- [ ] Log rotation enabled

Your Farsi Model Trainer should now be running in production! 🚀