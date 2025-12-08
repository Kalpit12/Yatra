# Quick Docker Guide - Yatra

## 🚀 Quick Start

### 1. Install Docker
- Download: https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop

### 2. Build All Images

**Windows:**
```bash
build-and-push.bat
```

**Linux/Mac:**
```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

**Or manually:**
```bash
# Backend
cd yatra-backend
docker build -t yatra-backend:latest .

# Frontend
cd ../yatra-frontend
docker build -t yatra-frontend:latest .

# Admin
cd ../yatra-admin-frontend
docker build -t yatra-admin:latest .
```

### 3. Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📤 Push to Docker Hub

### Step 1: Create Docker Hub Account
1. Go to https://hub.docker.com
2. Sign up for free account
3. Note your username

### Step 2: Login
```bash
docker login
```

### Step 3: Tag Images
Replace `yourusername` with your Docker Hub username:

```bash
docker tag yatra-backend:latest yourusername/yatra-backend:latest
docker tag yatra-frontend:latest yourusername/yatra-frontend:latest
docker tag yatra-admin:latest yourusername/yatra-admin:latest
```

### Step 4: Push
```bash
docker push yourusername/yatra-backend:latest
docker push yourusername/yatra-frontend:latest
docker push yourusername/yatra-admin:latest
```

## 🎯 Using the Images

### Pull and Run from Docker Hub

```bash
# Pull images
docker pull yourusername/yatra-backend:latest
docker pull yourusername/yatra-frontend:latest
docker pull yourusername/yatra-admin:latest

# Run with docker-compose (update image names in docker-compose.yml)
docker-compose up -d
```

## 📋 Image URLs

After pushing, your images will be at:
- `https://hub.docker.com/r/yourusername/yatra-backend`
- `https://hub.docker.com/r/yourusername/yatra-frontend`
- `https://hub.docker.com/r/yourusername/yatra-admin`

## 🔧 Environment Variables

Create `.env` file:
```env
DB_PASSWORD=secure_password_here
DB_USER=yatra_user
DB_NAME=yatra_db
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost,http://localhost:8080
```

## ✅ Verify

```bash
# Check running containers
docker ps

# Check images
docker images

# Test backend
curl http://localhost:3000/health

# Test frontend
open http://localhost

# Test admin
open http://localhost:8080
```

