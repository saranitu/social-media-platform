# SSH Deployment Guide

## 🔑 SSH Deployment Setup

### Prerequisites
- Linux/Unix server with SSH access
- Node.js 16+ installed
- MongoDB installed or Atlas account
- Git installed
- Domain name (optional)

---

## Step 1: Generate SSH Key Pair

### On Your Local Machine:

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/social_media_deploy -C "your_email@example.com"

# This creates:
# ~/.ssh/social_media_deploy (private key)
# ~/.ssh/social_media_deploy.pub (public key)

# Display the public key
cat ~/.ssh/social_media_deploy.pub
```

---

## Step 2: Server Setup

### Connect to Your Server:

```bash
# Using existing SSH key
ssh -i ~/.ssh/social_media_deploy root@your_server_ip

# Or standard connection
ssh root@your_server_ip
```

### Add Your Public Key to Server:

```bash
# On your local machine, copy the public key and add it to server
# Then on the server:

mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key
echo "your_public_key_content" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Test SSH connection
exit
ssh -i ~/.ssh/social_media_deploy root@your_server_ip
```

---

## Step 3: Install Dependencies on Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install Docker (optional but recommended)
sudo apt install -y docker.io
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install MongoDB (if not using Atlas)
sudo apt install -y mongodb-server
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify installations
node --version
npm --version
git --version
docker --version
docker-compose --version
```

---

## Step 4: Prepare Server for Application

```bash
# Create application directory
sudo mkdir -p /var/www/social-media-platform
sudo chown -R $USER:$USER /var/www/social-media-platform

# Create directory for logs
mkdir -p /var/www/social-media-platform/logs

# Create .env directory
mkdir -p /var/www/social-media-platform/.env.production
```

---

## Step 5: Deploy Application via SSH

### Option A: Git Clone with SSH

```bash
# On your local machine, add your server SSH key to GitHub:
# 1. Go to GitHub Settings → SSH and GPG keys
# 2. Add the server's public SSH key

# On server, clone repository
cd /var/www/social-media-platform
git clone git@github.com:saranitu/social-media-platform.git .

# Or using HTTPS if SSH not setup on GitHub
git clone https://github.com/saranitu/social-media-platform.git .
```

### Option B: Manual Upload via SCP

```bash
# On your local machine, upload files
scp -i ~/.ssh/social_media_deploy -r ./* root@your_server_ip:/var/www/social-media-platform/

# Or compress first for faster transfer
tar -czf social-media.tar.gz --exclude=node_modules --exclude=.git .
scp -i ~/.ssh/social_media_deploy social-media.tar.gz root@your_server_ip:/var/www/

# On server
cd /var/www
tar -xzf social-media.tar.gz -C social-media-platform
```

---

## Step 6: Configure Environment Variables

```bash
# SSH into server
ssh -i ~/.ssh/social_media_deploy root@your_server_ip

# Navigate to app directory
cd /var/www/social-media-platform

# Create production environment file
nano .env.production
```

### Add These Variables:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/social_media?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secure_random_string_min_32_chars
JWT_EXPIRE=7d

# Server
BACKEND_PORT=5000
FRONTEND_PORT=3000
NODE_ENV=production

# URLs
BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com
```

---

## Step 7: Install Dependencies & Build

```bash
# SSH into server
ssh -i ~/.ssh/social_media_deploy root@your_server_ip
cd /var/www/social-media-platform

# Install backend dependencies
cd backend
npm install --production
cd ..

# Install frontend dependencies and build
cd frontend
npm install
npm run build
cd ..
```

---

## Step 8: Setup with Docker Compose (Recommended)

```bash
# SSH into server
ssh -i ~/.ssh/social_media_deploy root@your_server_ip
cd /var/www/social-media-platform

# Copy environment file for Docker
cp .env.example .env
nano .env  # Edit with your values

# Build and start services
docker-compose build
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

---

## Step 9: Setup with PM2 (Alternative to Docker)

```bash
# SSH into server
ssh -i ~/.ssh/social_media_deploy root@your_server_ip

# Install PM2 globally
sudo npm install -g pm2

# Create PM2 ecosystem file
cd /var/www/social-media-platform
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'social-media-backend',
      script: './backend/src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log'
    },
    {
      name: 'social-media-frontend',
      script: 'npm run preview',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log'
    }
  ]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Make PM2 start on reboot
pm2 startup
pm2 save

# Monitor processes
pm2 monit
```

---

## Step 10: Configure Nginx Reverse Proxy

```bash
# SSH into server
ssh -i ~/.ssh/social_media_deploy root@your_server_ip

# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/social-media
```

### Add This Configuration:

```nginx
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Configuration:

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/social-media /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## Step 11: Setup SSL/TLS with Let's Encrypt

```bash
# SSH into server
ssh -i ~/.ssh/social_media_deploy root@your_server_ip

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal (should be automatic)
sudo systemctl status certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

---

## Step 12: Setup Automated Deployment Script

### Create Deploy Script on Server:

```bash
# SSH into server
ssh -i ~/.ssh/social_media_deploy root@your_server_ip

# Create deploy script
cat > /var/www/social-media-platform/deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying Social Media Platform..."

# Pull latest code
cd /var/www/social-media-platform
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm install --production && cd ..
cd frontend && npm install && npm run build && cd ..

# Restart services
echo "🔄 Restarting services..."
if [ "$USE_DOCKER" = "true" ]; then
    docker-compose down
    docker-compose up -d
else
    pm2 restart ecosystem.config.js
fi

echo "✅ Deployment complete!"
EOF

# Make executable
chmod +x /var/www/social-media-platform/deploy.sh
```

### Create Local Deploy Command:

```bash
# On your local machine, create a deployment script
cat > ~/deploy-social-media.sh << 'EOF'
#!/bin/bash

echo "📤 Pushing to GitHub..."
git push origin main

echo "🔗 Connecting to server..."
ssh -i ~/.ssh/social_media_deploy root@your_server_ip \
    'bash /var/www/social-media-platform/deploy.sh'

echo "✅ Deployment pushed!"
EOF

# Make executable
chmod +x ~/deploy-social-media.sh
```

### Run Deployment:

```bash
# From your local machine
~/deploy-social-media.sh
```

---

## Step 13: Firewall Configuration

```bash
# SSH into server
ssh -i ~/.ssh/social_media_deploy root@your_server_ip

# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# View status
sudo ufw status
```

---

## Step 14: Monitoring & Maintenance

### Check Application Status:

```bash
# SSH into server
ssh -i ~/.ssh/social_media_deploy root@your_server_ip

# With Docker
docker-compose ps
docker-compose logs -f

# With PM2
pm2 status
pm2 logs
```

### Monitor Server Health:

```bash
# CPU and Memory
top

# Disk usage
df -h

# Network
netstat -an | grep ESTABLISHED | wc -l

# Check logs
tail -f /var/log/nginx/error.log
```

### Backup Database:

```bash
# SSH into server
ssh -i ~/.ssh/social_media_deploy root@your_server_ip

# MongoDB backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/social_media" --out /var/backups/mongodb

# Compress
tar -czf /var/backups/mongodb-backup-$(date +%Y%m%d).tar.gz /var/backups/mongodb

# Download to local
scp -i ~/.ssh/social_media_deploy -r root@your_server_ip:/var/backups/mongodb-backup-*.tar.gz ./
```

---

## SSH Commands Reference

```bash
# Basic SSH connection
ssh -i ~/.ssh/social_media_deploy root@your_server_ip

# Execute command without entering shell
ssh -i ~/.ssh/social_media_deploy root@your_server_ip 'command'

# Copy file from local to server
scp -i ~/.ssh/social_media_deploy file.txt root@your_server_ip:/path/

# Copy file from server to local
scp -i ~/.ssh/social_media_deploy root@your_server_ip:/path/file.txt ./

# Copy directory recursively
scp -i ~/.ssh/social_media_deploy -r directory/ root@your_server_ip:/path/

# SSH with port forwarding
ssh -i ~/.ssh/social_media_deploy -L 3000:localhost:3000 root@your_server_ip

# SSH with tunnel for database
ssh -i ~/.ssh/social_media_deploy -L 27017:localhost:27017 root@your_server_ip
```

---

## Troubleshooting SSH Deployment

### SSH Connection Refused
```bash
# Check SSH service
ssh -i ~/.ssh/social_media_deploy -v root@your_server_ip

# On server, check SSH daemon
sudo systemctl status ssh
sudo systemctl restart ssh
```

### Permission Denied
```bash
# Fix private key permissions
chmod 600 ~/.ssh/social_media_deploy
chmod 700 ~/.ssh

# On server, fix authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Application Not Starting
```bash
# SSH into server and check logs
ssh -i ~/.ssh/social_media_deploy root@your_server_ip

# With Docker
docker-compose logs backend
docker-compose logs frontend

# With PM2
pm2 logs
```

---

## Security Best Practices

- ✅ Use SSH keys instead of passwords
- ✅ Disable SSH password authentication
- ✅ Change SSH port (optional)
- ✅ Use UFW firewall
- ✅ Keep server updated
- ✅ Enable HTTPS/SSL
- ✅ Use strong JWT secrets
- ✅ Regular backups
- ✅ Monitor logs
- ✅ Use environment variables for secrets

---

## Complete Deployment Checklist

- [ ] Generate SSH keys
- [ ] Add public key to server
- [ ] Install Node.js, Git, Docker
- [ ] Clone/upload application
- [ ] Configure .env file
- [ ] Install dependencies
- [ ] Build frontend
- [ ] Setup Docker or PM2
- [ ] Configure Nginx
- [ ] Setup SSL/TLS
- [ ] Configure firewall
- [ ] Test application
- [ ] Setup monitoring
- [ ] Setup backups
- [ ] Document setup

---

**Your application is now deployed via SSH! 🎉**

For help, check logs or contact support.
