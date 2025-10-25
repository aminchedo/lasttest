#!/bin/bash
# scripts/setup-vps.sh - VPS Initial Setup Script

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Configuration
DEPLOY_USER="deploy"
NODE_VERSION="18"

update_system() {
    log_info "Updating system packages..."
    sudo apt-get update
    sudo apt-get upgrade -y
    sudo apt-get install -y curl wget git unzip software-properties-common
    log_success "System updated"
}

install_nodejs() {
    log_info "Installing Node.js $NODE_VERSION..."
    
    # Install NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Verify installation
    node_version=$(node --version)
    npm_version=$(npm --version)
    
    log_success "Node.js $node_version and npm $npm_version installed"
}

install_nginx() {
    log_info "Installing Nginx..."
    sudo apt-get install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    log_success "Nginx installed and started"
}

install_pm2() {
    log_info "Installing PM2..."
    sudo npm install -g pm2
    log_success "PM2 installed"
}

install_certbot() {
    log_info "Installing Certbot for SSL..."
    sudo apt-get install -y certbot python3-certbot-nginx
    log_success "Certbot installed"
}

create_deploy_user() {
    log_info "Creating deploy user..."
    
    if id "$DEPLOY_USER" &>/dev/null; then
        log_warning "User $DEPLOY_USER already exists"
    else
        sudo adduser --disabled-password --gecos "" "$DEPLOY_USER"
        sudo usermod -aG sudo "$DEPLOY_USER"
        
        # Setup SSH directory
        sudo mkdir -p "/home/$DEPLOY_USER/.ssh"
        sudo chown "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
        sudo chmod 700 "/home/$DEPLOY_USER/.ssh"
        
        log_success "Deploy user $DEPLOY_USER created"
    fi
}

setup_firewall() {
    log_info "Setting up firewall..."
    sudo ufw --force enable
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw allow 80
    sudo ufw allow 443
    log_success "Firewall configured"
}

optimize_system() {
    log_info "Optimizing system settings..."
    
    # Increase file limits
    sudo tee -a /etc/security/limits.conf > /dev/null <<EOF
* soft nofile 65536
* hard nofile 65536
root soft nofile 65536
root hard nofile 65536
EOF

    # Optimize network settings
    sudo tee -a /etc/sysctl.conf > /dev/null <<EOF
# Network optimizations
net.core.somaxconn = 65536
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_max_syn_backlog = 65536
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_intvl = 60
net.ipv4.tcp_keepalive_probes = 10
EOF

    sudo sysctl -p
    log_success "System optimized"
}

install_monitoring() {
    log_info "Installing monitoring tools..."
    
    # Install htop, iotop, etc.
    sudo apt-get install -y htop iotop nethogs ncdu
    
    # Install fail2ban for security
    sudo apt-get install -y fail2ban
    sudo systemctl enable fail2ban
    sudo systemctl start fail2ban
    
    log_success "Monitoring tools installed"
}

setup_swap() {
    log_info "Setting up swap file..."
    
    # Check if swap already exists
    if swapon --show | grep -q "/swapfile"; then
        log_warning "Swap file already exists"
        return
    fi
    
    # Create 2GB swap file
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    
    # Make permanent
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    
    # Optimize swap usage
    echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
    
    log_success "Swap file created and configured"
}

main() {
    log_info "Starting VPS setup for Farsi Model Trainer"
    
    update_system
    install_nodejs
    install_nginx
    install_pm2
    install_certbot
    create_deploy_user
    setup_firewall
    optimize_system
    install_monitoring
    setup_swap
    
    log_success "🎉 VPS setup completed!"
    log_info "Next steps:"
    log_info "1. Copy your SSH key to the deploy user: ssh-copy-id $DEPLOY_USER@your-server"
    log_info "2. Clone your repository to /var/www/farsi-model-trainer"
    log_info "3. Run the deployment script: ./scripts/deploy-production.sh"
}

main "$@"