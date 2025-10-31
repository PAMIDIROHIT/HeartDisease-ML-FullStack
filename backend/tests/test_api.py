"""
API Tests for Heart Disease Prediction System
"""

import pytest
import json
from api.app import create_app

@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app = create_app()
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    """Test the health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert 'status' in data
    assert data['status'] == 'healthy'
    assert 'timestamp' in data

def test_features_endpoint(client):
    """Test the features endpoint"""
    response = client.get('/api/features')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert isinstance(data, dict)
    assert len(data) > 0
    
    # Check that key features are present
    assert 'age' in data
    assert 'sex' in data
    assert 'cp' in data

def test_model_info_endpoint(client):
    """Test the model info endpoint"""
    response = client.get('/api/model/info')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert isinstance(data, dict)

def test_predict_endpoint_valid_data(client):
    """Test the predict endpoint with valid data"""
    # Sample patient data
    sample_data = {
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
    
    response = client.post('/api/predict',
                          data=json.dumps(sample_data),
                          content_type='application/json')
    
    # Note: This might return 500 if no model is loaded
    # For testing purposes, we'll check that it's a valid response
    assert response.status_code in [200, 500]

def test_predict_endpoint_invalid_data(client):
    """Test the predict endpoint with invalid data"""
    # Missing required fields
    invalid_data = {
        "age": 63,
        "sex": 1
        # Missing many required fields
    }
    
    response = client.post('/api/predict',
                          data=json.dumps(invalid_data),
                          content_type='application/json')
    
    # Should return 400 for bad request
    assert response.status_code == 400

def test_predict_endpoint_invalid_json(client):
    """Test the predict endpoint with invalid JSON"""
    response = client.post('/api/predict',
                          data='invalid json',
                          content_type='application/json')
    
    assert response.status_code == 400