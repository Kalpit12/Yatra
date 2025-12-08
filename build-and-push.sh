#!/bin/bash

# Yatra Docker Build and Push Script
# Replace 'yourusername' with your Docker Hub username

DOCKER_USERNAME="yourusername"  # CHANGE THIS!

echo "🐳 Building Yatra Docker Images..."
echo ""

# Build Backend
echo "📦 Building backend..."
cd yatra-backend
docker build -t ${DOCKER_USERNAME}/yatra-backend:latest .
docker tag ${DOCKER_USERNAME}/yatra-backend:latest ${DOCKER_USERNAME}/yatra-backend:v1.0
cd ..

# Build Frontend
echo "📦 Building frontend..."
cd yatra-frontend
docker build -t ${DOCKER_USERNAME}/yatra-frontend:latest .
docker tag ${DOCKER_USERNAME}/yatra-frontend:latest ${DOCKER_USERNAME}/yatra-frontend:v1.0
cd ..

# Build Admin
echo "📦 Building admin panel..."
cd yatra-admin-frontend
docker build -t ${DOCKER_USERNAME}/yatra-admin:latest .
docker tag ${DOCKER_USERNAME}/yatra-admin:latest ${DOCKER_USERNAME}/yatra-admin:v1.0
cd ..

echo ""
echo "✅ Build complete!"
echo ""
read -p "Push to Docker Hub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 Pushing to Docker Hub..."
    docker push ${DOCKER_USERNAME}/yatra-backend:latest
    docker push ${DOCKER_USERNAME}/yatra-backend:v1.0
    docker push ${DOCKER_USERNAME}/yatra-frontend:latest
    docker push ${DOCKER_USERNAME}/yatra-frontend:v1.0
    docker push ${DOCKER_USERNAME}/yatra-admin:latest
    docker push ${DOCKER_USERNAME}/yatra-admin:v1.0
    echo ""
    echo "✅ All images pushed to Docker Hub!"
    echo "   https://hub.docker.com/r/${DOCKER_USERNAME}/"
fi

