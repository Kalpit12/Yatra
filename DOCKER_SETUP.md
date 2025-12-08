# Docker Setup Guide for Yatra

## Prerequisites

- Docker installed: https://docs.docker.com/get-docker/
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 2. Access Services

- **Frontend:** http://localhost
- **Admin Panel:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **MySQL:** localhost:3306

## Building Individual Images

### Backend

```bash
cd yatra-backend
docker build -t yatra-backend:latest .
```

### Frontend

```bash
cd yatra-frontend
docker build -t yatra-frontend:latest .
```

### Admin Panel

```bash
cd yatra-admin-frontend
docker build -t yatra-admin:latest .
```

## Push to Docker Hub

### 1. Login to Docker Hub

```bash
docker login
```

### 2. Tag Images

```bash
# Replace 'yourusername' with your Docker Hub username
docker tag yatra-backend:latest yourusername/yatra-backend:latest
docker tag yatra-frontend:latest yourusername/yatra-frontend:latest
docker tag yatra-admin:latest yourusername/yatra-admin:latest
```

### 3. Push Images

```bash
docker push yourusername/yatra-backend:latest
docker push yourusername/yatra-frontend:latest
docker push yourusername/yatra-admin:latest
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DB_PASSWORD=your_secure_password
DB_USER=yatra_user
DB_NAME=yatra_db
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost,http://localhost:8080
```

## Database Setup

The database schema will be automatically initialized when the MySQL container starts for the first time (from `database/schema.sql`).

To manually run database setup:

```bash
# Connect to MySQL container
docker exec -it yatra-mysql mysql -u root -p

# Or run setup script
docker exec -it yatra-backend node setup-database.js
```

## Production Deployment

### Using Docker Compose

1. Update `.env` with production values
2. Update `CORS_ORIGIN` in docker-compose.yml
3. Run: `docker-compose up -d`

### Using Individual Containers

```bash
# Start MySQL
docker run -d --name yatra-mysql \
  -e MYSQL_ROOT_PASSWORD=yourpassword \
  -e MYSQL_DATABASE=yatra_db \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0

# Start Backend
docker run -d --name yatra-backend \
  --link yatra-mysql:mysql \
  -e DB_HOST=mysql \
  -e DB_PASSWORD=yourpassword \
  -p 3000:3000 \
  yourusername/yatra-backend:latest

# Start Frontend
docker run -d --name yatra-frontend \
  -p 80:80 \
  yourusername/yatra-frontend:latest

# Start Admin
docker run -d --name yatra-admin \
  -p 8080:80 \
  yourusername/yatra-admin:latest
```

## Troubleshooting

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f mysql
```

### Restart Services

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild After Changes

```bash
docker-compose up -d --build
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes database)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

