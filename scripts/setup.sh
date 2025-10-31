#!/bin/bash

# Heart Disease Prediction System Setup Script

echo "🚀 Setting up Heart Disease Prediction System..."

# Check if running on Windows (Git Bash) or Unix-like system
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "🔧 Detected Windows environment"
    IS_WINDOWS=1
else
    echo "🔧 Detected Unix-like environment"
    IS_WINDOWS=0
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists python3 && ! command_exists python; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ Node.js/npm is not installed. Please install Node.js 16 or higher."
    exit 1
fi

if ! command_exists docker; then
    echo "⚠️  Docker is not installed. Docker deployment will not be available."
else
    echo "✅ Docker is installed"
fi

# Set up backend
echo "🔧 Setting up backend..."

cd backend

# Create virtual environment
if [ $IS_WINDOWS -eq 1 ]; then
    python -m venv venv
    source venv/Scripts/activate
else
    python3 -m venv venv
    source venv/bin/activate
fi

# Upgrade pip
pip install --upgrade pip

# Install dependencies
echo "📦 Installing backend dependencies..."
pip install -r requirements.txt

# Install development dependencies if requested
if [[ "$1" == "--dev" ]]; then
    echo "💻 Installing development dependencies..."
    pip install -r requirements-dev.txt
fi

# Set up frontend
echo "🔧 Setting up frontend..."
cd ../frontend

echo "📦 Installing frontend dependencies..."
npm install

# Create .env files if they don't exist
if [ ! -f ../backend/.env ]; then
    echo "📄 Creating backend .env file..."
    cp ../backend/.env.example ../backend/.env
fi

if [ ! -f ../frontend/.env ]; then
    echo "📄 Creating frontend .env file..."
    cp ../frontend/.env.example ../frontend/.env
fi

# Download dataset if needed
echo "📊 Checking for dataset..."
if [ ! -f ../backend/data/raw/heart.csv ]; then
    echo "⬇️  Downloading heart disease dataset..."
    mkdir -p ../backend/data/raw
    # This would be replaced with actual download command
    echo "⚠️  Please manually download the heart.csv dataset from UCI repository to backend/data/raw/"
fi

# Print success message
echo "🎉 Setup completed successfully!"

echo "To start the development servers:"
echo ""
echo "Backend:"
echo "  cd backend"
echo "  source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "  python api/app.py"
echo ""
echo "Frontend:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Docker (if Docker is installed):"
echo "  cd docker"
echo "  docker-compose up --build"
echo ""
echo "Access the application at http://localhost:3000"
echo "Access the API at http://localhost:5000"