# Quick Start Guide

## 🚀 Getting Started with Social Media Platform

### Project Overview

This is a full-stack social media platform with the following features:

✅ **User Authentication** - Secure signup/login with JWT
✅ **Create Posts** - Share text and photos
✅ **Interactions** - Like, comment, emoji reactions
✅ **User Profiles** - Unique 11-digit code, editable info, profile photo
✅ **Real-time Features** - Multi-user support
✅ **Editable Content** - Posts and comments can be edited
✅ **Responsive Design** - Works on all devices

---

## 📋 Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **MongoDB** 4.4+ ([Download](https://www.mongodb.com/try/download/community))
- **Git** ([Download](https://git-scm.com/))
- **Docker** (Optional, for containerized deployment)

---

## 🔧 Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/saranitu/social-media-platform.git
cd social-media-platform
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your settings
# Key variables to update:
# MONGODB_URI=mongodb://localhost:27017/social_media
# JWT_SECRET=your_secret_key_here
```

### Step 4: Start MongoDB

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
# MongoDB should auto-start if installed as a service
# Or manually: "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
```

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

### Step 5: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Step 6: Access the Application

Open your browser and go to: **http://localhost:5173**

---

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost
# Backend: http://localhost:5000
```

### View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

---

## 📝 Using the Application

### 1. Sign Up
- Click "Sign up here" on the login page
- Enter username, email, password
- Your unique 11-digit code is auto-generated

### 2. Create a Post
- On the home page, enter text in "What's on your mind?"
- Optionally add a photo
- Click "Post"

### 3. Interact with Posts
- **Like**: Click the ❤️ button
- **Comment**: Click the 💬 button to add a comment
- **Edit**: If it's your post, click the ✏️ button
- **Delete**: If it's your post, click the 🗑️ button

### 4. Comment Features
- Add text comments
- Like comments
- Add emoji reactions 😊
- Edit your own comments
- Delete your own comments

### 5. Profile Management
- Click "Profile" in the navbar
- View your unique ID code
- Edit your username, bio, and profile photo
- See your posted content

---

## 🚀 Production Deployment

### Option 1: Render.com (Recommended)

1. Push your code to GitHub
2. Go to [render.com](https://render.com)
3. Create new services:
   - **Backend**: Node.js service connected to GitHub
   - **Frontend**: Static site connected to GitHub
   - **MongoDB**: Add MongoDB Atlas database

### Option 2: Vercel (Frontend) + Railway (Backend)

**Frontend:**
```bash
cd frontend
npm install -g vercel
vercel deploy
```

**Backend:**
1. Push to GitHub
2. Deploy on [Railway.app](https://railway.app)
3. Set environment variables

### Option 3: Heroku + AWS S3 (Legacy)

```bash
# Deploy backend
heroku create your-app-name
git push heroku main

# Set environment variables
heroku config:set JWT_SECRET=your_secret
```

---

## 🔒 Security Best Practices

### Before Deploying

1. **Change JWT Secret**
   ```
   JWT_SECRET=generate_a_long_random_string_here
   ```

2. **Use Environment Variables**
   - Never commit sensitive data
   - Use `.env` for local development
   - Set env vars in production dashboard

3. **Enable HTTPS**
   - Use SSL/TLS certificates
   - Most platforms provide free HTTPS

4. **Database Security**
   - Use strong MongoDB credentials
   - Enable MongoDB Atlas IP whitelist
   - Regular backups

5. **API Security**
   - CORS properly configured
   - Rate limiting enabled
   - Input validation on all endpoints

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# Check if running
mongosh

# If not, start it
mongod  # Linux/macOS
# Or use Docker
docker run -d -p 27017:27017 mongo:6.0
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process using the port
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Or change port in .env
BACKEND_PORT=5001
```

### CORS Errors
**Solution:** Make sure backend URL in frontend is correct
```javascript
// In frontend/.env
VITE_API_URL=http://localhost:5000
```

### Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
```

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)
- `POST /api/posts/:id/like` - Like post (auth required)
- `POST /api/posts/:id/unlike` - Unlike post (auth required)

### Comments
- `POST /api/comments/:postId` - Add comment (auth required)
- `PUT /api/comments/:id` - Update comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)
- `POST /api/comments/:id/like` - Like comment (auth required)
- `POST /api/comments/:id/emoji` - Add emoji (auth required)

### Users
- `GET /api/users/profile` - Get current user (auth required)
- `PUT /api/users/profile` - Update profile (auth required)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/avatar` - Upload profile photo (auth required)

---

## 📁 Project Structure

```
social-media-platform/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   └── Comment.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
└── .env.example
```

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## ❓ FAQ

**Q: Can I use this with PostgreSQL instead of MongoDB?**
A: Yes! Replace MongoDB with PostgreSQL and update the models to use Sequelize or TypeORM.

**Q: How do I add real-time features with WebSockets?**
A: Install Socket.io on the backend and frontend for real-time updates.

**Q: Can I deploy on GitHub Pages?**
A: Frontend only. Use platforms like Vercel or Netlify for better support.

---

## 🎯 Next Steps

- [ ] Add WebSocket support for real-time updates
- [ ] Implement user follow/unfollow
- [ ] Add notifications system
- [ ] Implement search functionality
- [ ] Add image compression
- [ ] Implement analytics
- [ ] Add dark mode
- [ ] Mobile app (React Native)

---

**Happy coding! 🎉**

For questions or issues, create an issue on GitHub or contact the maintainers.
