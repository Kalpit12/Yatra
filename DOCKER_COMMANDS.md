# Docker Commands for kalpitpatel12

## Prerequisites
Make sure Docker Desktop is installed and running:
- Download: https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop
- Wait for it to fully start (whale icon in system tray)

## Step-by-Step Commands

### Step 1: Build Backend Image
```bash
cd D:\YATRA\yatra-backend
docker build -t kalpitpatel12/yatra-backend:latest .
```

### Step 2: Build Frontend Image
```bash
cd D:\YATRA\yatra-frontend
docker build -t kalpitpatel12/yatra-frontend:latest .
```

### Step 3: Build Admin Image
```bash
cd D:\YATRA\yatra-admin-frontend
docker build -t kalpitpatel12/yatra-admin:latest .
```

### Step 4: Verify Images Built Successfully
```bash
docker images | findstr kalpitpatel12
```

You should see:
- kalpitpatel12/yatra-backend:latest
- kalpitpatel12/yatra-frontend:latest
- kalpitpatel12/yatra-admin:latest

### Step 5: Push to Docker Hub

Make sure you're logged in:
```bash
docker login
```

Then push:
```bash
docker push kalpitpatel12/yatra-backend:latest
docker push kalpitpatel12/yatra-frontend:latest
docker push kalpitpatel12/yatra-admin:latest
```

## All Commands in One Block (Copy-Paste)

```bash
# Build Backend
cd D:\YATRA\yatra-backend
docker build -t kalpitpatel12/yatra-backend:latest .
cd ..

# Build Frontend
cd D:\YATRA\yatra-frontend
docker build -t kalpitpatel12/yatra-frontend:latest .
cd ..

# Build Admin
cd D:\YATRA\yatra-admin-frontend
docker build -t kalpitpatel12/yatra-admin:latest .
cd ..

# Verify
docker images | findstr kalpitpatel12

# Push (after docker login)
docker push kalpitpatel12/yatra-backend:latest
docker push kalpitpatel12/yatra-frontend:latest
docker push kalpitpatel12/yatra-admin:latest
```

## After Pushing

Your images will be available at:
- https://hub.docker.com/r/kalpitpatel12/yatra-backend
- https://hub.docker.com/r/kalpitpatel12/yatra-frontend
- https://hub.docker.com/r/kalpitpatel12/yatra-admin

## Troubleshooting

If `docker` command not found:
1. Make sure Docker Desktop is installed
2. Make sure Docker Desktop is running (check system tray)
3. Restart your terminal/PowerShell
4. Try restarting Docker Desktop

