#!/bin/bash

# Generate secure JWT secret
echo "🔐 Generating Secure JWT Secret..."

# Generate 64-character random string
JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')

echo ""
echo "✅ Generated JWT Secret:"
echo "$JWT_SECRET"
echo ""
echo "📝 Add this to your .env file:"
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo "🔒 Keep this secret safe and never commit it to version control!"
