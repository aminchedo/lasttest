#!/bin/bash
# scripts/deploy-production.sh - Production Deployment Script

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="farsi-model-trainer"
DEPLOY_USER="deploy"
DEPLOY_PATH="/var/www/$PROJECT_NAME"
NGINX_CONF="/etc/nginx/sites-available/$PROJECT_NAME"
DOMAIN="your-domain.com"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking system requirements..."
    
    # Check if running as root or with sudo
    if [[ $EUID -eq 0 ]]; then
        log_warning "Running as root. Consider using a dedicated deploy user."
    fi
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_VERSION="16.0.0"
    
    if ! printf '%s\n%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V -C; then
        log_error "Node.js version $NODE_VERSION is too old. Required: $REQUIRED_VERSION+"
        exit 1
    fi
    
    log_success "Node.js version $NODE_VERSION is compatible"
    
    # Check PM2
    if ! command -v pm2 &> /dev/null; then
        log_info "Installing PM2..."
        npm install -g pm2
    fi
    
    # Check Nginx
    if ! command -v nginx &> /dev/null; then
        log_error "Nginx is not installed"
        exit 1
    fi
    
    log_success "All requirements satisfied"
}

setup_directories() {
    log_info "Setting up directories..."
    
    # Create deployment directory
    sudo mkdir -p "$DEPLOY_PATH"
    sudo mkdir -p "$DEPLOY_PATH/logs"
    sudo mkdir -p "$DEPLOY_PATH/data"
    sudo mkdir -p "$DEPLOY_PATH/data/assets"
    sudo mkdir -p "$DEPLOY_PATH/data/models"
    sudo mkdir -p "$DEPLOY_PATH/data/datasets"
    sudo mkdir -p "$DEPLOY_PATH/data/profiles"
    
    # Set permissions
    if id "$DEPLOY_USER" &>/dev/null; then
        sudo chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_PATH"
    else
        log_warning "Deploy user '$DEPLOY_USER' does not exist. Using current user."
        sudo chown -R "$(whoami):$(whoami)" "$DEPLOY_PATH"
    fi
    
    log_success "Directories created and configured"
}

install_dependencies() {
    log_info "Installing dependencies..."
    
    cd "$DEPLOY_PATH"
    
    # Install backend dependencies
    if [ -f "package.json" ]; then
        npm ci --production
        log_success "Backend dependencies installed"
    fi
    
    # Install and build frontend
    if [ -d "client" ]; then
        cd client
        if [ -f "package.json" ]; then
            npm ci
            npm run build
            log_success "Frontend built successfully"
        fi
        cd ..
    fi
}

configure_nginx() {
    log_info "Configuring Nginx..."
    
    # Copy Nginx configuration
    if [ -f "nginx.production.conf" ]; then
        sudo cp nginx.production.conf "$NGINX_CONF"
        
        # Replace domain placeholder
        sudo sed -i "s/your-domain.com/$DOMAIN/g" "$NGINX_CONF"
        
        # Enable site
        sudo ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/$PROJECT_NAME"
        
        # Remove default site if it exists
        sudo rm -f /etc/nginx/sites-enabled/default
        
        # Test Nginx configuration
        if sudo nginx -t; then
            log_success "Nginx configuration is valid"
        else
            log_error "Nginx configuration test failed"
            exit 1
        fi
    else
        log_warning "nginx.production.conf not found. Skipping Nginx configuration."
    fi
}

setup_ssl() {
    log_info "Setting up SSL certificate..."
    
    # Check if certbot is installed
    if command -v certbot &> /dev/null; then
        # Obtain SSL certificate
        sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN"
        
        if [ $? -eq 0 ]; then
            log_success "SSL certificate obtained successfully"
        else
            log_warning "Failed to obtain SSL certificate. Continuing without SSL."
        fi
    else
        log_warning "Certbot not installed. Skipping SSL setup."
        log_info "To install certbot: sudo apt-get install certbot python3-certbot-nginx"
    fi
}

configure_pm2() {
    log_info "Configuring PM2..."
    
    cd "$DEPLOY_PATH"
    
    # Stop existing processes
    pm2 delete "$PROJECT_NAME" 2>/dev/null || true
    
    # Start application with PM2
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --env production
        
        # Save PM2 configuration
        pm2 save
        
        # Setup PM2 startup script
        pm2 startup systemd -u "$DEPLOY_USER" --hp "/home/$DEPLOY_USER"
        
        log_success "PM2 configured and application started"
    else
        log_error "ecosystem.config.js not found"
        exit 1
    fi
}

setup_monitoring() {
    log_info "Setting up monitoring..."
    
    # Install PM2 monitoring (optional)
    # pm2 install pm2-logrotate
    
    # Setup log rotation
    sudo tee /etc/logrotate.d/$PROJECT_NAME > /dev/null <<EOF
$DEPLOY_PATH/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $DEPLOY_USER $DEPLOY_USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
    
    log_success "Monitoring and log rotation configured"
}

setup_firewall() {
    log_info "Configuring firewall..."
    
    # Enable UFW if available
    if command -v ufw &> /dev/null; then
        sudo ufw --force enable
        sudo ufw allow ssh
        sudo ufw allow 'Nginx Full'
        sudo ufw allow 80
        sudo ufw allow 443
        
        log_success "Firewall configured"
    else
        log_warning "UFW not available. Please configure firewall manually."
    fi
}

run_tests() {
    log_info "Running deployment tests..."
    
    cd "$DEPLOY_PATH"
    
    # Wait for application to start
    sleep 10
    
    # Test API health
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        log_success "Backend health check passed"
    else
        log_error "Backend health check failed"
        exit 1
    fi
    
    # Test Nginx
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_success "Nginx health check passed"
    else
        log_error "Nginx health check failed"
        exit 1
    fi
    
    # Run API tests if available
    if [ -f "scripts/test-api-endpoints.js" ]; then
        node scripts/test-api-endpoints.js
    fi
}

cleanup() {
    log_info "Cleaning up..."
    
    # Remove temporary files
    sudo rm -rf /tmp/$PROJECT_NAME-*
    
    # Restart services
    sudo systemctl reload nginx
    
    log_success "Cleanup completed"
}

main() {
    log_info "Starting production deployment for $PROJECT_NAME"
    log_info "Domain: $DOMAIN"
    log_info "Deploy path: $DEPLOY_PATH"
    
    check_requirements
    setup_directories
    install_dependencies
    configure_nginx
    setup_ssl
    configure_pm2
    setup_monitoring
    setup_firewall
    run_tests
    cleanup
    
    log_success "🚀 Deployment completed successfully!"
    log_info "Your application should be available at: https://$DOMAIN"
    log_info "PM2 status: pm2 status"
    log_info "Nginx status: sudo systemctl status nginx"
    log_info "Logs: pm2 logs $PROJECT_NAME"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --user)
            DEPLOY_USER="$2"
            shift 2
            ;;
        --path)
            DEPLOY_PATH="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [--domain DOMAIN] [--user USER] [--path PATH]"
            echo "  --domain: Domain name for the application (default: your-domain.com)"
            echo "  --user: Deploy user (default: deploy)"
            echo "  --path: Deploy path (default: /var/www/$PROJECT_NAME)"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main function
main