@echo off
REM Yatra Complete Docker Build and Push Script (Windows)
REM Builds and optionally pushes all three services (backend, frontend, admin)

setlocal enabledelayedexpansion

REM Configuration
if "%DOCKER_USERNAME%"=="" set DOCKER_USERNAME=yourusername
if "%VERSION%"=="" set VERSION=latest
set PUSH_TO_HUB=%1

echo 🐳 Yatra Complete Docker Build Script
echo ======================================
echo Docker Username: %DOCKER_USERNAME%
echo Version: %VERSION%
echo.

REM Build Backend
echo 📦 Building Backend...
cd yatra-backend
docker build -t %DOCKER_USERNAME%/yatra-backend:%VERSION% .
docker tag %DOCKER_USERNAME%/yatra-backend:%VERSION% %DOCKER_USERNAME%/yatra-backend:latest
cd ..
echo ✅ Backend built successfully
echo.

REM Build Frontend
echo 📦 Building Frontend...
cd yatra-frontend
docker build -t %DOCKER_USERNAME%/yatra-frontend:%VERSION% .
docker tag %DOCKER_USERNAME%/yatra-frontend:%VERSION% %DOCKER_USERNAME%/yatra-frontend:latest
cd ..
echo ✅ Frontend built successfully
echo.

REM Build Admin
echo 📦 Building Admin Panel...
cd yatra-admin-frontend
docker build -t %DOCKER_USERNAME%/yatra-admin:%VERSION% .
docker tag %DOCKER_USERNAME%/yatra-admin:%VERSION% %DOCKER_USERNAME%/yatra-admin:latest
cd ..
echo ✅ Admin Panel built successfully
echo.

echo ✅ All images built successfully!
echo.
echo Built images:
echo   - %DOCKER_USERNAME%/yatra-backend:%VERSION%
echo   - %DOCKER_USERNAME%/yatra-frontend:%VERSION%
echo   - %DOCKER_USERNAME%/yatra-admin:%VERSION%
echo.

REM Push to Docker Hub if requested
if "%PUSH_TO_HUB%"=="--push" (
    echo 🚀 Pushing to Docker Hub...
    echo.
    
    docker push %DOCKER_USERNAME%/yatra-backend:%VERSION%
    docker push %DOCKER_USERNAME%/yatra-backend:latest
    echo ✅ Backend pushed
    
    docker push %DOCKER_USERNAME%/yatra-frontend:%VERSION%
    docker push %DOCKER_USERNAME%/yatra-frontend:latest
    echo ✅ Frontend pushed
    
    docker push %DOCKER_USERNAME%/yatra-admin:%VERSION%
    docker push %DOCKER_USERNAME%/yatra-admin:latest
    echo ✅ Admin Panel pushed
    
    echo.
    echo ✅ All images pushed to Docker Hub!
    echo    https://hub.docker.com/r/%DOCKER_USERNAME%/
) else (
    echo 💡 To push to Docker Hub, run:
    echo    %~nx0 --push
)

echo.
echo 📋 To start all services:
echo    docker-compose -f docker-compose.all.yml up -d
echo.

