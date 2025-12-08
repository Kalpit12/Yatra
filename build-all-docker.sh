#!/bin/bash

# Yatra Complete Docker Build and Push Script
# Builds and optionally pushes all three services (backend, frontend, admin)

set -e  # Exit on error

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-yourusername}"  # Set via environment or change here
VERSION="${VERSION:-latest}"
PUSH_TO_HUB="${PUSH_TO_HUB:-false}"  # Set to "true" to push after building

echo "🐳 Yatra Complete Docker Build Script"
echo "======================================"
echo "Docker Username: ${DOCKER_USERNAME}"
echo "Version: ${VERSION}"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build Backend
echo -e "${BLUE}📦 Building Backend...${NC}"
cd yatra-backend
docker build -t ${DOCKER_USERNAME}/yatra-backend:${VERSION} .
docker tag ${DOCKER_USERNAME}/yatra-backend:${VERSION} ${DOCKER_USERNAME}/yatra-backend:latest
cd ..
echo -e "${GREEN}✅ Backend built successfully${NC}"
echo ""

# Build Frontend
echo -e "${BLUE}📦 Building Frontend...${NC}"
cd yatra-frontend
docker build -t ${DOCKER_USERNAME}/yatra-frontend:${VERSION} .
docker tag ${DOCKER_USERNAME}/yatra-frontend:${VERSION} ${DOCKER_USERNAME}/yatra-frontend:latest
cd ..
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Build Admin
echo -e "${BLUE}📦 Building Admin Panel...${NC}"
cd yatra-admin-frontend
docker build -t ${DOCKER_USERNAME}/yatra-admin:${VERSION} .
docker tag ${DOCKER_USERNAME}/yatra-admin:${VERSION} ${DOCKER_USERNAME}/yatra-admin:latest
cd ..
echo -e "${GREEN}✅ Admin Panel built successfully${NC}"
echo ""

echo -e "${GREEN}✅ All images built successfully!${NC}"
echo ""
echo "Built images:"
echo "  - ${DOCKER_USERNAME}/yatra-backend:${VERSION}"
echo "  - ${DOCKER_USERNAME}/yatra-frontend:${VERSION}"
echo "  - ${DOCKER_USERNAME}/yatra-admin:${VERSION}"
echo ""

# Push to Docker Hub if requested
if [ "$PUSH_TO_HUB" = "true" ] || [ "$1" = "--push" ]; then
    echo -e "${YELLOW}🚀 Pushing to Docker Hub...${NC}"
    echo ""
    
    docker push ${DOCKER_USERNAME}/yatra-backend:${VERSION}
    docker push ${DOCKER_USERNAME}/yatra-backend:latest
    echo -e "${GREEN}✅ Backend pushed${NC}"
    
    docker push ${DOCKER_USERNAME}/yatra-frontend:${VERSION}
    docker push ${DOCKER_USERNAME}/yatra-frontend:latest
    echo -e "${GREEN}✅ Frontend pushed${NC}"
    
    docker push ${DOCKER_USERNAME}/yatra-admin:${VERSION}
    docker push ${DOCKER_USERNAME}/yatra-admin:latest
    echo -e "${GREEN}✅ Admin Panel pushed${NC}"
    
    echo ""
    echo -e "${GREEN}✅ All images pushed to Docker Hub!${NC}"
    echo "   https://hub.docker.com/r/${DOCKER_USERNAME}/"
else
    echo -e "${YELLOW}💡 To push to Docker Hub, run:${NC}"
    echo "   $0 --push"
    echo "   or set PUSH_TO_HUB=true"
fi

echo ""
echo -e "${BLUE}📋 To start all services:${NC}"
echo "   docker-compose -f docker-compose.all.yml up -d"
echo ""

