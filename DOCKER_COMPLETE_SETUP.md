# Yatra Complete Docker Setup Guide

This guide explains how to build and deploy all three Yatra services (Backend, Frontend, Admin) together using Docker.

## 📦 Services Included

1. **Backend API** - Node.js Express server (Port 3000)
2. **Frontend Website** - Main Yatra website (Port 80)
3. **Admin Panel** - Admin dashboard (Port 8080)
4. **MySQL Database** - Database server (Port 3306)

## 🚀 Quick Start

### 1. Build All Images

**Linux/Mac:**
```bash
chmod +x build-all-docker.sh
./build-all-docker.sh
```

**Windows:**
```cmd
build-all-docker.bat
```

**With Docker Hub Push:**
```bash
./build-all-docker.sh --push
# or
build-all-docker.bat --push
```

### 2. Start All Services

```bash
docker-compose -f docker-compose.all.yml up -d
```

### 3. View Logs

```bash
# All services
docker-compose -f docker-compose.all.yml logs -f

# Specific service
docker-compose -f docker-compose.all.yml logs -f backend
docker-compose -f docker-compose.all.yml logs -f frontend
docker-compose -f docker-compose.all.yml logs -f admin
```

### 4. Stop All Services

```bash
docker-compose -f docker-compose.all.yml down
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_USER=yatra_user
DB_PASSWORD=your_secure_password
DB_NAME=yatra_db

# Backend
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:80,http://localhost:8080
NODE_ENV=production

# Docker Hub (for pushing images)
DOCKER_USERNAME=your_dockerhub_username
```

### Ports

- **Frontend**: http://localhost:80
- **Admin Panel**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3306

## 📤 Push to Docker Hub

### Set Docker Username

**Linux/Mac:**
```bash
export DOCKER_USERNAME=your_username
./build-all-docker.sh --push
```

**Windows:**
```cmd
set DOCKER_USERNAME=your_username
build-all-docker.bat --push
```

### Login to Docker Hub

```bash
docker login
```

Then run the build script with `--push` flag.

## 🏗️ Build Individual Services

If you need to rebuild just one service:

```bash
# Backend only
cd yatra-backend
docker build -t your_username/yatra-backend:latest .
cd ..

# Frontend only
cd yatra-frontend
docker build -t your_username/yatra-frontend:latest .
cd ..

# Admin only
cd yatra-admin-frontend
docker build -t your_username/yatra-admin:latest .
cd ..
```

## 🔍 Verify Services

Check if all services are running:

```bash
docker-compose -f docker-compose.all.yml ps
```

Health checks:
- Backend: http://localhost:3000/health
- Frontend: http://localhost/
- Admin: http://localhost:8080/

## 🐛 Troubleshooting

### Services won't start

1. Check logs:
   ```bash
   docker-compose -f docker-compose.all.yml logs
   ```

2. Verify ports aren't in use:
   ```bash
   # Linux/Mac
   lsof -i :80 -i :3000 -i :8080 -i :3306
   
   # Windows
   netstat -ano | findstr :80
   netstat -ano | findstr :3000
   ```

### Database connection issues

1. Wait for MySQL to be healthy:
   ```bash
   docker-compose -f docker-compose.all.yml ps mysql
   ```

2. Check database logs:
   ```bash
   docker-compose -f docker-compose.all.yml logs mysql
   ```

### Rebuild after code changes

```bash
# Rebuild specific service
docker-compose -f docker-compose.all.yml build backend

# Rebuild all
docker-compose -f docker-compose.all.yml build

# Rebuild and restart
docker-compose -f docker-compose.all.yml up -d --build
```

## 📊 Production Deployment

For production, use `docker-compose.prod.yml`:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Make sure to:
1. Set strong passwords in `.env`
2. Use proper CORS_ORIGIN with your domain
3. Set NODE_ENV=production
4. Use Docker secrets for sensitive data

## 🗑️ Clean Up

Remove all containers and volumes:

```bash
docker-compose -f docker-compose.all.yml down -v
```

Remove all images:

```bash
docker rmi your_username/yatra-backend:latest
docker rmi your_username/yatra-frontend:latest
docker rmi your_username/yatra-admin:latest
```

## 📝 Notes

- All services share the same Docker network (`yatra-network`)
- Backend connects to MySQL using service name `mysql`
- Frontend and Admin connect to Backend using service name `backend`
- Database data persists in Docker volume `mysql_data`

