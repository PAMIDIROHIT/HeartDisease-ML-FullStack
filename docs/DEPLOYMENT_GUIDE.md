# Heart Disease Prediction System - Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Local Setup](#local-setup)
4. [Docker Deployment](#docker-deployment)
5. [Cloud Deployment](#cloud-deployment)
6. [Environment Variables](#environment-variables)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Backup Procedures](#backup-procedures)

## Overview

This guide provides instructions for deploying the Heart Disease Prediction System in various environments, from local development to production cloud deployments.

## Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Memory**: 4GB RAM minimum (8GB recommended)
- **Storage**: 10GB free disk space
- **Python**: 3.8+
- **Node.js**: 16+
- **Docker**: 20+ (for Docker deployments)

### Required Tools
- Git
- Python package manager (pip)
- Node package manager (npm)
- Docker and Docker Compose (for containerized deployments)

## Local Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the development server:
   ```bash
   python api/app.py
   ```

6. The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend will be available at `http://localhost:3000`

### Training Models (Optional)

To retrain the machine learning models:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Activate the virtual environment (if not already activated)

3. Run the training script:
   ```bash
   python src/model_training/train.py
   ```

## Docker Deployment

### Building and Running with Docker Compose

1. Navigate to the docker directory:
   ```bash
   cd docker
   ```

2. Build and start all services:
   ```bash
   docker-compose up --build
   ```

3. For detached mode:
   ```bash
   docker-compose up -d
   ```

4. Access the services:
   - Frontend: `http://localhost:80`
   - Backend API: `http://localhost:5000`
   - Nginx proxy: `http://localhost:8080`

### Stopping Services

To stop all services:
```bash
docker-compose down
```

### Viewing Logs

To view logs for all services:
```bash
docker-compose logs -f
```

To view logs for a specific service:
```bash
docker-compose logs -f backend
```

## Cloud Deployment

### AWS Deployment

1. **Create EC2 Instance**:
   - AMI: Amazon Linux 2 or Ubuntu 20.04
   - Instance Type: t3.medium or larger
   - Storage: 20GB SSD

2. **Install Docker**:
   ```bash
   sudo yum update -y
   sudo amazon-linux-extras install docker -y
   sudo systemctl start docker
   sudo usermod -a -G docker ec2-user
   ```

3. **Install Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Deploy Application**:
   ```bash
   git clone <repository-url>
   cd PDS-Project/docker
   docker-compose up -d
   ```

5. **Configure Security Groups**:
   - Allow inbound traffic on ports 80 and 5000
   - Restrict SSH access to your IP

### Heroku Deployment

1. **Prepare for Heroku**:
   ```bash
   cd backend
   echo "web: gunicorn api.app:create_app() --bind 0.0.0.0:$PORT" > Procfile
   ```

2. **Deploy Backend**:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

3. **Set Environment Variables**:
   ```bash
   heroku config:set FLASK_ENV=production
   heroku config:set SECRET_KEY=your-secret-key
   ```

### Azure Deployment

1. **Create Azure App Service**:
   - Runtime Stack: Python 3.9
   - Operating System: Linux

2. **Deploy using Azure CLI**:
   ```bash
   az webapp up --resource-group myResourceGroup --plan myAppServicePlan --name myApp --location "West Europe"
   ```

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
HOST=0.0.0.0
PORT=5000

# Database Configuration (if needed)
DATABASE_URL=sqlite:///heart_disease.db

# API Configuration
API_RATE_LIMIT=100 per hour

# Logging
LOG_LEVEL=INFO
```

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

## Monitoring and Logging

### Backend Monitoring

The backend application logs to stdout/stderr by default. In production, these logs can be collected by:

1. **Docker Logs**:
   ```bash
   docker-compose logs -f backend
   ```

2. **Log Files**:
   Configure logging in `api/app.py` to write to files:
   ```python
   logging.basicConfig(
       filename='app.log',
       level=logging.INFO,
       format='%(asctime)s %(levelname)s %(name)s %(message)s'
   )
   ```

### Frontend Monitoring

Frontend errors are logged to the browser console. For production monitoring:

1. **Error Tracking**: Integrate with services like Sentry
2. **Performance Monitoring**: Use tools like Lighthouse or Web Vitals

### Health Checks

Both backend and frontend expose health check endpoints:

- Backend: `GET /health`
- Frontend: Access the homepage

Docker Compose includes health checks for both services.

## Backup Procedures

### Model and Data Backup

1. **Backup Trained Models**:
   ```bash
   cp -r backend/models /backup/models
   ```

2. **Backup Processed Data**:
   ```bash
   cp -r backend/data/processed /backup/data
   ```

3. **Backup Configuration**:
   ```bash
   cp backend/.env /backup/config/
   cp frontend/.env /backup/config/
   ```

### Database Backup (if using database)

1. **SQLite**:
   ```bash
   cp heart_disease.db /backup/database/
   ```

2. **PostgreSQL**:
   ```bash
   pg_dump -U username -h hostname database_name > /backup/database/backup.sql
   ```

### Automated Backup Script

Create a backup script `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/$DATE"

mkdir -p $BACKUP_DIR/models
mkdir -p $BACKUP_DIR/data
mkdir -p $BACKUP_DIR/config

cp -r backend/models/* $BACKUP_DIR/models/
cp -r backend/data/processed/* $BACKUP_DIR/data/
cp backend/.env $BACKUP_DIR/config/
cp frontend/.env $BACKUP_DIR/config/

echo "Backup completed: $BACKUP_DIR"
```

Make it executable:
```bash
chmod +x backup.sh
```

Schedule with cron:
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

## Scaling Considerations

### Horizontal Scaling

For high-traffic deployments:

1. **Backend**: Increase worker processes in Gunicorn
2. **Frontend**: Use a CDN for static assets
3. **Database**: Use connection pooling

### Load Balancing

Use Nginx or cloud load balancers to distribute traffic across multiple instances.

### Caching

Implement Redis caching for frequently accessed data like model information and feature descriptions.

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Configure CORS properly to restrict origins
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Input Validation**: Validate all inputs on both frontend and backend
5. **Secrets Management**: Use environment variables for secrets, never hardcode them

## Maintenance

### Updating the Application

1. **Pull Latest Changes**:
   ```bash
   git pull origin main
   ```

2. **Rebuild Docker Images**:
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

3. **Migrate Database** (if applicable):
   ```bash
   # Run migration scripts
   ```

### Monitoring Updates

Regularly check for:
1. Security updates for dependencies
2. New versions of base Docker images
3. Model performance degradation

---

For additional support, refer to the project documentation or contact the development team.