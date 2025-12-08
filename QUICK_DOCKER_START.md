# 🐳 Quick Docker Start Guide

## One Command to Build & Run Everything

### Build All Images
```bash
# Linux/Mac
./build-all-docker.sh

# Windows
build-all-docker.bat
```

### Start All Services
```bash
docker-compose -f docker-compose.all.yml up -d
```

### Access Services
- 🌐 **Frontend**: http://localhost:80
- 🔧 **Admin Panel**: http://localhost:8080
- 🔌 **Backend API**: http://localhost:3000/health
- 🗄️ **MySQL**: localhost:3306

### Stop All Services
```bash
docker-compose -f docker-compose.all.yml down
```

### View Logs
```bash
docker-compose -f docker-compose.all.yml logs -f
```

## Push to Docker Hub

1. Set your Docker Hub username:
   ```bash
   export DOCKER_USERNAME=your_username  # Linux/Mac
   set DOCKER_USERNAME=your_username     # Windows
   ```

2. Login:
   ```bash
   docker login
   ```

3. Build and push:
   ```bash
   ./build-all-docker.sh --push    # Linux/Mac
   build-all-docker.bat --push    # Windows
   ```

That's it! 🎉

