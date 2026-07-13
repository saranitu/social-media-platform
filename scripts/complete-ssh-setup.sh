#!/bin/bash

# Complete SSH Setup Script
# Generates keys and provides setup instructions

set -e

echo "🚀 Social Media Platform - Complete SSH Setup"
echo "============================================"
echo ""

KEY_NAME="social_media_deploy"
KEY_PATH="$HOME/.ssh/$KEY_NAME"
SERVER_IP="${1:-}"

# Step 1: Generate keys
echo "🔑 Step 1: Generating SSH Keys..."
echo ""

if [ ! -f "$KEY_PATH" ]; then
    mkdir -p "$HOME/.ssh"
    chmod 700 "$HOME/.ssh"
    
    ssh-keygen -t rsa -b 4096 -f "$KEY_PATH" -N "" -C "Social Media Platform Deployment"
    chmod 600 "$KEY_PATH"
    chmod 644 "$KEY_PATH.pub"
    
    echo "✅ SSH keys generated!"
    echo ""
else
    echo "✅ SSH keys already exist at $KEY_PATH"
    echo ""
fi

# Step 2: Display keys
echo "🔑 Step 2: Your SSH Keys"
echo ""
echo "Private Key Location: $KEY_PATH"
echo "Public Key Location: $KEY_PATH.pub"
echo ""

echo "📋 Your Public Key:"
echo "="*50
cat "$KEY_PATH.pub"
echo "="*50
echo ""

# Step 3: Server setup instructions
echo "🔑 Step 3: Add Key to Your Server"
echo ""
echo "SSH into your server and run:"
echo ""
echo "mkdir -p ~/.ssh"
echo "chmod 700 ~/.ssh"
echo ""
echo "Then paste your public key:"
echo "echo 'PASTE_PUBLIC_KEY_CONTENT_HERE' >> ~/.ssh/authorized_keys"
echo "chmod 600 ~/.ssh/authorized_keys"
echo ""

# Step 4: Test connection
echo "🔑 Step 4: Test SSH Connection"
echo ""
echo "Test your connection with:"
echo "ssh -i $KEY_PATH root@your_server_ip"
echo ""

if [ -n "$SERVER_IP" ]; then
    echo "🔗 Testing connection to $SERVER_IP..."
    if ssh -i "$KEY_PATH" -o ConnectTimeout=5 root@"$SERVER_IP" "echo 'Connection successful!'" 2>/dev/null; then
        echo "✅ Connection test passed!"
    else
        echo "❌ Connection test failed. Make sure public key is added to server."
    fi
    echo ""
fi

echo "📋 Quick Commands:"
echo ""
echo "Connect to server:"
echo "  ssh -i $KEY_PATH root@your_server_ip"
echo ""
echo "Copy files to server:"
echo "  scp -i $KEY_PATH -r ./* root@your_server_ip:/var/www/social-media/"
echo ""
echo "View public key:"
echo "  cat $KEY_PATH.pub"
echo ""

echo "✅ SSH setup complete!"
echo ""
echo "🔒 Security Reminder:"
echo "   - Keep your private key ($KEY_PATH) secure"
echo "   - Never share your private key"
echo "   - Don't commit private keys to Git"
echo "   - Use strong server passwords"
echo ""
