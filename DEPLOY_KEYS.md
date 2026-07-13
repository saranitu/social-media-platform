# Deployment Keys & Configuration

## Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

### Required Variables

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/social_media
MONGODB_USER=admin
MONGODB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_very_long_random_secret_key_min_32_chars
JWT_EXPIRE=7d

# Server Configuration
BACKEND_PORT=5000
FRONTEND_PORT=5173
NODE_ENV=development

# URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif
```

## Deployment Platforms

### 1. Render.com

**Backend Service:**
```
Name: social-media-backend
Environment: Node
Build Command: npm install
Start Command: npm start
Env Variables:
  - MONGODB_URI: (from MongoDB Atlas)
  - JWT_SECRET: (generate new)
  - NODE_ENV: production
```

**Frontend Service:**
```
Name: social-media-frontend
Environment: Static Site
Build Command: cd frontend && npm install && npm run build
Publish Directory: frontend/dist
Env Variables:
  - VITE_API_URL: https://social-media-backend.onrender.com
```

### 2. Vercel (Frontend)

```bash
cd frontend
npm install -g vercel
vercel deploy --prod
```

**Environment Variables:**
```
VITE_API_URL=https://your-backend-url.com
```

### 3. Railway

**Backend Deployment:**
1. Connect GitHub repository
2. Select `backend` directory
3. Set Environment Variables
4. Deploy

### 4. Docker Hub

```bash
# Build images
docker build -t your-username/social-media-backend:latest ./backend
docker build -t your-username/social-media-frontend:latest ./frontend

# Push to Docker Hub
docker push your-username/social-media-backend:latest
docker push your-username/social-media-frontend:latest
```

### 5. AWS

**ECR (Elastic Container Registry):**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag images
docker tag social-media-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/social-media-backend:latest

# Push
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/social-media-backend:latest
```

**ECS (Elastic Container Service):**
1. Create cluster
2. Create task definition
3. Create service
4. Attach load balancer

### 6. MongoDB Atlas Setup

1. Go to [mongodb.com/cloud](https://www.mongodb.com/cloud/atlas)
2. Create account
3. Create cluster (M0 free tier)
4. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/social_media?retryWrites=true&w=majority
   ```
5. Add to `.env` as `MONGODB_URI`

## SSL/TLS Certificates

**Render.com & Vercel:** Automatic HTTPS

**Self-hosted (Let's Encrypt):**
```bash
sudo apt-get install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

## DNS Configuration

Update your domain DNS records:

```
Type: CNAME
Name: your-domain.com
Value: your-platform.onrender.com (or equivalent)
```

## Health Check Endpoints

```bash
# Backend health
curl http://localhost:5000/api/health

# Expected response:
{"status":"Backend is running"}
```

## Backup & Recovery

### MongoDB Backup

```bash
# Local backup
mongodump --uri "mongodb://admin:password@localhost:27017/social_media" --out ./backup

# Restore
mongorestore ./backup
```

### Atlas Backup
1. Go to MongoDB Atlas
2. Cluster → Backup → Create Backup
3. Download or restore as needed

## Monitoring

### Logs

**Docker:**
```bash
docker logs -f container_name
```

**Render:**
- Dashboard → Logs tab

**AWS CloudWatch:**
```bash
aws logs tail /ecs/social-media --follow
```

### Performance Monitoring

- Use MongoDB Atlas charts
- Enable slow query logging
- Monitor API response times
- Set up alerts

## Troubleshooting Deployment

### 502 Bad Gateway
- Check backend service is running
- Verify MongoDB connection
- Check environment variables
- Review logs

### CORS Errors
- Update `BACKEND_URL` in frontend env
- Check backend CORS configuration
- Verify API URL in requests

### Database Connection Failed
- Verify MongoDB URI
- Check IP whitelist (Atlas)
- Ensure credentials are correct
- Test connection locally first

## Security Checklist Before Deploy

- [ ] Generate strong JWT secret
- [ ] Update database credentials
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure MongoDB credentials
- [ ] Enable rate limiting
- [ ] Set up backups
- [ ] Review environment variables
- [ ] Enable authentication
- [ ] Add rate limiting middleware

## Post-Deployment Testing

```bash
# Test signup
curl -X POST http://your-domain/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Pass123","confirmPassword":"Pass123"}'

# Test login
curl -X POST http://your-domain/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123"}'

# Test posts (with token)
curl http://your-domain/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Support & Help

- 📚 [Render Docs](https://render.com/docs)
- 📚 [Vercel Docs](https://vercel.com/docs)
- 📚 [Railway Docs](https://railway.app/docs)
- 📚 [AWS Docs](https://docs.aws.amazon.com)
- 📚 [MongoDB Docs](https://docs.mongodb.com)

---

**Happy Deploying!** 🚀
