#!/bin/bash

# Social Media Platform - Deployment Script
# This script handles deployment to various platforms

set -e

echo "🚀 Social Media Platform Deployment Script"
echo "========================================"

# Check if environment is set
if [ -z "$DEPLOYMENT_ENV" ]; then
  echo "⚠️  DEPLOYMENT_ENV not set. Using 'production' as default."
  DEPLOYMENT_ENV="production"
fi

echo "📦 Building application..."

# Build frontend
echo "🎨 Building frontend..."
cd frontend
npm run build
cd ..

# Build backend (if using TypeScript)
echo "⚙️  Preparing backend..."
cd backend
npm install --production
cd ..

echo "✅ Build complete!"

echo ""
echo "📋 Deployment Configuration:"
echo "  Environment: $DEPLOYMENT_ENV"
echo "  Git Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "  Commit: $(git rev-parse --short HEAD)"

echo ""
echo "🎯 Next steps:"
echo "  1. Set environment variables in your deployment platform"
echo "  2. Push to your Git repository"
echo "  3. Deploy using Docker Compose or your cloud platform"
echo ""
echo "📚 Documentation: See DEPLOYMENT.md"
