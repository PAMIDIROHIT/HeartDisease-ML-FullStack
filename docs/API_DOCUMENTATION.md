# Heart Disease Prediction API Documentation

## Overview
This document describes the RESTful API endpoints for the Heart Disease Prediction System. The API provides machine learning-based predictions for heart disease risk based on patient medical data.

## Base URL
```
http://localhost:5000/api
```

## Authentication
No authentication is required for these endpoints.

## Rate Limiting
- `/api/predict`: 100 requests per hour
- `/api/predict/batch`: 50 requests per hour
- `/api/model/info`: 200 requests per hour
- `/api/features`: 500 requests per hour

## Endpoints

### 1. Health Check
**GET** `/health`

Check if the API is running and healthy.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### 2. Single Prediction
**POST** `/predict`

Make a heart disease prediction for a single patient.

**Request Body:**
```json
{
  "age": 63,
  "sex": 1,
  "cp": 3,
  "trestbps": 145,
  "chol": 233,
  "fbs": 1,
  "restecg": 0,
  "thalach": 150,
  "exang": 0,
  "oldpeak": 2.3,
  "slope": 0,
  "ca": 0,
  "thal": 1
}
```

**Response:**
```json
{
  "prediction": 1,
  "probability": 0.87,
  "risk_level": "High",
  "confidence": "87.0%",
  "feature_importance": {
    "age": 0.12,
    "sex": 0.08,
    "cp": 0.15,
    // ... other features
  },
  "recommendations": [
    "Consult a cardiologist immediately",
    "Consider stress tests and echocardiograms",
    "Review lifestyle factors (diet, exercise, smoking)",
    "Monitor blood pressure and cholesterol regularly"
  ]
}
```

### 3. Batch Prediction
**POST** `/predict/batch`

Make predictions for multiple patients using a CSV file.

**Request:**
- Content-Type: multipart/form-data
- File: CSV file with patient data

**Response:**
```json
{
  "predictions": [
    {
      "prediction": 1,
      "probability": 0.87,
      "risk_level": "High",
      "confidence": "87.0%",
      // ... other fields
    }
    // ... more predictions
  ],
  "statistics": {
    "total": 100,
    "successful": 95,
    "failed": 5,
    "average_probability": 0.65,
    "risk_distribution": {
      "Low": 20,
      "Medium": 30,
      "High": 45
    }
  }
}
```

### 4. Model Information
**GET** `/model/info`

Get information about the machine learning model.

**Response:**
```json
{
  "name": "Random Forest Classifier",
  "version": "1.0.0",
  "accuracy": 0.87,
  "precision": 0.85,
  "recall": 0.89,
  "f1_score": 0.87,
  "roc_auc": 0.91,
  "training_date": "2023-10-01",
  "features_used": 13,
  "dataset_size": 1025
}
```

### 5. Feature Descriptions
**GET** `/features`

Get descriptions and valid ranges for all features.

**Response:**
```json
{
  "age": {
    "description": "Age in years",
    "type": "integer",
    "range": "20-100",
    "unit": "years"
  },
  "sex": {
    "description": "Sex",
    "type": "integer",
    "values": {
      "0": "Female",
      "1": "Male"
    }
  }
  // ... other features
}
```

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Common HTTP Status Codes
- `200`: Success
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## Feature Descriptions

| Feature | Description | Type | Values/Range |
|---------|-------------|------|--------------|
| age | Age in years | Integer | 20-100 |
| sex | Sex | Integer | 0: Female, 1: Male |
| cp | Chest pain type | Integer | 0-3 |
| trestbps | Resting blood pressure | Integer | 90-200 mm Hg |
| chol | Serum cholesterol | Integer | 100-600 mg/dl |
| fbs | Fasting blood sugar > 120 mg/dl | Integer | 0: False, 1: True |
| restecg | Resting electrocardiographic results | Integer | 0-2 |
| thalach | Maximum heart rate achieved | Integer | 60-220 bpm |
| exang | Exercise induced angina | Integer | 0: No, 1: Yes |
| oldpeak | ST depression induced by exercise | Float | 0-10 |
| slope | Slope of peak exercise ST segment | Integer | 0-2 |
| ca | Number of major vessels | Integer | 0-3 |
| thal | Thalassemia | Integer | 0-2 |

## Example Usage

### Python with requests
```python
import requests

url = "http://localhost:5000/api/predict"
data = {
    "age": 63,
    "sex": 1,
    "cp": 3,
    "trestbps": 145,
    "chol": 233,
    "fbs": 1,
    "restecg": 0,
    "thalach": 150,
    "exang": 0,
    "oldpeak": 2.3,
    "slope": 0,
    "ca": 0,
    "thal": 1
}

response = requests.post(url, json=data)
print(response.json())
```

### JavaScript with fetch
```javascript
const url = "http://localhost:5000/api/predict";
const data = {
    age: 63,
    sex: 1,
    cp: 3,
    trestbps: 145,
    chol: 233,
    fbs: 1,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 2.3,
    slope: 0,
    ca: 0,
    thal: 1
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => console.log(data));
```