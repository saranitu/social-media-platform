# API Testing Guide

## Setup

### 1. Get JWT Token

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "email": "test@example.com",
    "uniqueCode": "12345678901"
  }
}
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### 2. Set Token Variable

```bash
TOKEN="your_token_here"
```

## Testing Endpoints

### Posts

**Create Post:**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, world!",
    "image": null
  }'
```

**Get All Posts:**
```bash
curl http://localhost:5000/api/posts
```

**Get Post by ID:**
```bash
curl http://localhost:5000/api/posts/507f1f77bcf86cd799439011
```

**Update Post:**
```bash
curl -X PUT http://localhost:5000/api/posts/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Updated content"}'
```

**Delete Post:**
```bash
curl -X DELETE http://localhost:5000/api/posts/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN"
```

**Like Post:**
```bash
curl -X POST http://localhost:5000/api/posts/507f1f77bcf86cd799439011/like \
  -H "Authorization: Bearer $TOKEN"
```

**Unlike Post:**
```bash
curl -X POST http://localhost:5000/api/posts/507f1f77bcf86cd799439011/unlike \
  -H "Authorization: Bearer $TOKEN"
```

### Comments

**Add Comment:**
```bash
curl -X POST http://localhost:5000/api/comments/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Great post!"}'
```

**Update Comment:**
```bash
curl -X PUT http://localhost:5000/api/comments/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Updated comment"}'
```

**Delete Comment:**
```bash
curl -X DELETE http://localhost:5000/api/comments/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer $TOKEN"
```

**Like Comment:**
```bash
curl -X POST http://localhost:5000/api/comments/507f1f77bcf86cd799439012/like \
  -H "Authorization: Bearer $TOKEN"
```

**Add Emoji to Comment:**
```bash
curl -X POST http://localhost:5000/api/comments/507f1f77bcf86cd799439012/emoji \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"emoji": "😂"}'
```

### Users

**Get Current User Profile:**
```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Get User by ID:**
```bash
curl http://localhost:5000/api/users/507f1f77bcf86cd799439011
```

**Update Profile:**
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newusername",
    "bio": "This is my bio"
  }'
```

**Upload Profile Photo:**
```bash
curl -X POST http://localhost:5000/api/users/avatar \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,..."}'
```

### Health Check

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{"status": "Backend is running"}
```

## Testing with Postman

1. Import the collection from `postman-collection.json`
2. Set environment variable `token` with JWT token
3. Set `base_url` to `http://localhost:5000`
4. Run requests

## Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/health

# Using wrk
wrk -t4 -c100 -d30s http://localhost:5000/api/posts
```

## Common Issues

### 401 Unauthorized
- Token is missing or invalid
- Token has expired
- Wrong token format

### 403 Forbidden
- User is not authorized
- Attempting to modify someone else's content

### 404 Not Found
- Resource doesn't exist
- Wrong resource ID

### 500 Internal Server Error
- Server error
- Check logs: `docker logs social_media_backend`

---

**Happy Testing!** 🧪
