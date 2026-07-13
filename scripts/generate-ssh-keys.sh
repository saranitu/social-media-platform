#!/bin/bash

# SSH Key Generation Script for Social Media Platform Deployment
# This script generates secure SSH keys for server deployment

echo "🔑 SSH Key Generation Script"
echo "============================="
echo ""

# Set key name
KEY_NAME="social_media_deploy"
KEY_PATH="$HOME/.ssh/$KEY_NAME"
COMMENT="Social Media Platform Deployment Key"

echo "📋 Configuration:"
echo "  Key Name: $KEY_NAME"
echo "  Key Path: $KEY_PATH"
echo ""

# Check if key already exists
if [ -f "$KEY_PATH" ]; then
    echo "⚠️  Key already exists at $KEY_PATH"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "🛑 Cancelled."
        exit 1
    fi
fi

# Create .ssh directory if it doesn't exist
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"

echo "📋 Generating SSH key pair..."

# Generate SSH key
ssh-keygen -t rsa -b 4096 -f "$KEY_PATH" -N "" -C "$COMMENT"

echo ""
echo "✅ SSH Key Generated Successfully!"
echo ""
echo "📋 Key Files Created:"
echo "  Private Key: $KEY_PATH"
echo "  Public Key: $KEY_PATH.pub"
echo ""

# Set proper permissions
chmod 600 "$KEY_PATH"
chmod 644 "$KEY_PATH.pub"

echo "🔐 Private Key Permissions: 600"
echo "🔐 Public Key Permissions: 644"
echo ""

# Display public key
echo "🔑 Your Public Key (share this with your server):"
echo "================================================"
cat "$KEY_PATH.pub"
echo ""
echo "================================================"
echo ""

echo "📋 Next Steps:"
echo "  1. Copy the public key above"
echo "  2. SSH into your server: ssh root@your_server_ip"
echo "  3. Add to authorized_keys:"
echo "     mkdir -p ~/.ssh"
echo "     echo 'PASTE_PUBLIC_KEY_HERE' >> ~/.ssh/authorized_keys"
echo "     chmod 600 ~/.ssh/authorized_keys"
echo ""
echo "  4. Test connection:"
echo "     ssh -i $KEY_PATH root@your_server_ip"
echo ""
echo "🔒 Keep your private key secure! Never share it."
echo "✅ Private key location: $KEY_PATH"
