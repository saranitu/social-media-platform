#!/bin/bash

# SSH Key Setup Helper
# This script helps you add your public key to a remote server

echo "🔑 SSH Key Setup Helper"
echo "======================"
echo ""

# Variables
KEY_NAME="social_media_deploy"
KEY_PATH="$HOME/.ssh/$KEY_NAME"

# Check if private key exists
if [ ! -f "$KEY_PATH" ]; then
    echo "❌ Error: Private key not found at $KEY_PATH"
    echo "Please generate keys first using: bash scripts/generate-ssh-keys.sh"
    exit 1
fi

echo "📋 Please enter your server details:"
read -p "Server IP/Hostname: " SERVER_IP
read -p "Server Username (default: root): " SERVER_USER
SERVER_USER=${SERVER_USER:-root}
read -p "SSH Port (default: 22): " SSH_PORT
SSH_PORT=${SSH_PORT:-22}

echo ""
echo "🔑 Connecting to server..."
echo ""

# Create SSH command
SSH_CMD="ssh -i $KEY_PATH -p $SSH_PORT $SERVER_USER@$SERVER_IP"

# Try to connect and setup key
echo "📋 Setting up SSH key on server..."
echo ""

$SSH_CMD << 'EOF'
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "SSH key added successfully"
EOF

echo ""
echo "✅ SSH key setup complete!"
echo ""
echo "📋 You can now connect using:"
echo "  ssh -i $KEY_PATH -p $SSH_PORT $SERVER_USER@$SERVER_IP"
echo ""
echo "Or add to ~/.ssh/config:"
echo "  Host social-media-server"
echo "      HostName $SERVER_IP"
echo "      User $SERVER_USER"
echo "      Port $SSH_PORT"
echo "      IdentityFile $KEY_PATH"
echo ""
echo "Then connect with: ssh social-media-server"
