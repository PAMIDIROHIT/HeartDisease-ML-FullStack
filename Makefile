# Makefile for Heart Disease Prediction System

# Variables
PYTHON := python3
PIP := pip3
NPM := npm
DOCKER := docker
DOCKER_COMPOSE := docker-compose

# Default target
.PHONY: help
help:
	@echo "Heart Disease Prediction System - Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make setup              Install all dependencies"
	@echo "  make backend            Start backend server"
	@echo "  make frontend           Start frontend server"
	@echo "  make train              Train the machine learning model"
	@echo "  make test               Run all tests"
	@echo "  make docker             Run with Docker"
	@echo "  make clean              Clean temporary files"
	@echo "  make help               Show this help message"

# Setup project
.PHONY: setup
setup:
	@echo "🔧 Setting up project..."
	# Setup backend
	cd backend && $(PYTHON) -m venv venv
	cd backend && source venv/bin/activate && $(PIP) install -r requirements.txt
	# Setup frontend
	cd frontend && $(NPM) install
	@echo "✅ Setup completed!"

# Run backend
.PHONY: backend
backend:
	@echo "🚀 Starting backend server..."
	cd backend && source venv/bin/activate && $(PYTHON) run.py

# Run frontend
.PHONY: frontend
frontend:
	@echo "🚀 Starting frontend server..."
	cd frontend && $(NPM) start

# Train model
.PHONY: train
train:
	@echo "🤖 Training machine learning model..."
	cd backend && source venv/bin/activate && $(PYTHON) ../scripts/train_model.py

# Run tests
.PHONY: test
test:
	@echo "🧪 Running tests..."
	# Run backend tests
	cd backend && source venv/bin/activate && pytest tests/ -v
	# Run frontend tests
	cd frontend && $(NPM) test

# Run with Docker
.PHONY: docker
docker:
	@echo "🐳 Running with Docker..."
	cd docker && $(DOCKER_COMPOSE) up --build

# Clean temporary files
.PHONY: clean
clean:
	@echo "🧹 Cleaning temporary files..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf backend/logs/*
	rm -rf backend/data/processed/*
	@echo "✅ Cleaning completed!"

# Install development dependencies
.PHONY: dev-install
dev-install:
	@echo "💻 Installing development dependencies..."
	cd backend && source venv/bin/activate && $(PIP) install -r requirements-dev.txt
	@echo "✅ Development dependencies installed!"