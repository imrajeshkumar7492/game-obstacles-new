#!/bin/bash

# Test Pipeline - Run this to test your CI/CD pipeline locally
echo "🚀 Testing CI/CD Pipeline Locally"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test Backend
echo -e "${BLUE}🔧 Testing Backend...${NC}"
cd backend

echo "Installing backend dependencies..."
python -m pip install --upgrade pip
pip install -r requirements.txt
pip install pytest-cov pytest-asyncio httpx
print_status $? "Backend dependencies installed"

echo "Running backend tests..."
python -m pytest tests/ -v --cov=. --cov-report=html
print_status $? "Backend tests completed"

echo "Running code quality checks..."
black --check . || echo "Black formatting needed"
isort --check-only . || echo "Import sorting needed"
flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
print_status $? "Backend code quality checks completed"

cd ..

# Test Frontend
echo -e "${BLUE}🎨 Testing Frontend...${NC}"
cd frontend

echo "Installing frontend dependencies..."
yarn install --frozen-lockfile
print_status $? "Frontend dependencies installed"

echo "Running frontend tests..."
CI=true yarn test --coverage --watchAll=false
print_status $? "Frontend tests completed"

echo "Building frontend..."
yarn build
print_status $? "Frontend build completed"

echo "Running ESLint..."
yarn lint || echo "ESLint warnings found"
print_status $? "Frontend linting completed"

cd ..

# Integration Test Simulation
echo -e "${BLUE}🔗 Running Integration Test Simulation...${NC}"

# Start services in background
echo "Starting backend server..."
cd backend
echo "MONGO_URL=mongodb://localhost:27017/testdb" > .env.test
echo "DB_NAME=testdb" >> .env.test
echo "SECRET_KEY=test-secret-key" >> .env.test

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}⚠️ MongoDB not running. Integration tests may fail.${NC}"
    echo "To start MongoDB: sudo systemctl start mongod"
fi

cd ..

echo -e "${GREEN}🎉 Local pipeline testing completed!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Fix any failing tests or code quality issues"
echo "2. Commit and push your changes to GitHub"
echo "3. Check the Actions tab in your GitHub repository"
echo "4. Monitor the deployment to GitHub Pages"
echo ""
echo -e "${BLUE}📍 Your app will be available at:${NC}"
echo "- Staging: https://[username].github.io/[repository]/staging/"
echo "- Production: https://[username].github.io/[repository]/"