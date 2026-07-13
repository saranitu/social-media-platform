# Social Media Platform - Deployment Guide

## Local Development

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- npm or yarn

### Setup

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Copy environment variables
cp .env.example .env

# Start MongoDB
mongod

# Run development servers
npm run dev
```

Backend will run on `http://localhost:5000`
Frontend will run on `http://localhost:5173`

## Docker Deployment

### Build and Run

```bash
# Build all services
npm run docker:build

# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# View logs
docker-compose logs -f
```

Access the application at:
- Frontend: `http://localhost` (port 80)
- Backend: `http://localhost:5000`
- MongoDB: `localhost:27017`

## Production Deployment

### Environment Variables
Update `.env` with production values:
```
NODE_ENV=production
JWT_SECRET=your_very_secure_secret_key
MONGODB_URI=your_production_mongodb_uri
```

### Deploy to Cloud

#### Option 1: Render.com (Full Stack)
1. Push code to GitHub
2. Create web services for backend and frontend
3. Connect MongoDB Atlas
4. Configure environment variables

#### Option 2: Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**
```bash
vercel deploy
```

**Backend on Railway:**
1. Connect GitHub repository
2. Add environment variables
3. Deploy

#### Option 3: AWS/GCP/Azure with Docker
```bash
# Push to container registry
docker tag social-media-platform:latest myregistry/social-media-platform:latest
docker push myregistry/social-media-platform:latest

# Deploy using ECS, App Engine, or Container Instances
```

## Database Setup

### MongoDB Atlas (Recommended for Production)
1. Create account at mongodb.com/cloud
2. Create a cluster
3. Add connection string to `.env`

### Local MongoDB
```bash
# Install MongoDB
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install -y mongodb
sudo systemctl start mongod

# Windows
# Download from mongodb.com and install
```

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS/SSL
- [ ] Set secure MongoDB credentials
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Use environment variables for secrets
- [ ] Enable API authentication

## Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Monitor application performance
- Set up auto-scaling if needed

## Support

For issues or questions, please create an issue on GitHub.
