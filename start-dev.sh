#!/bin/bash

# Define colors
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting IP-Sim Development Environment...${NC}"

# Check for Maven
if ! command -v mvn &> /dev/null && [ ! -f "./mvnw" ] && [ ! -d "./.maven" ]; then
    echo "Maven (mvn) or Maven Wrapper (mvnw) could not be found."
    echo "Please install Maven to proceed."
    exit 1
fi

MAVEN_CMD="mvn"
if [ -f "./mvnw" ]; then
    MAVEN_CMD="./mvnw"
elif [ -d "./.maven" ]; then
    MAVEN_CMD="./.maven/bin/mvn"
fi

# Frontend Build
echo -e "${GREEN}Building Frontend (TypeScript)...${NC}"
cd src/main/frontend
if [ -f "package.json" ]; then
    npm install
    npm run build
else
    # Fallback if npm setup is not perfect
    npx tsc
fi
cd ../../../

# Backend Run
echo -e "${GREEN}Starting Backend (Spring Boot)...${NC}"
$MAVEN_CMD spring-boot:run
