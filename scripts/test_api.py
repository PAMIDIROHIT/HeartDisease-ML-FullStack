#!/usr/bin/env python3
"""
API Test Script for Heart Disease Prediction System
"""

import requests
import json

def test_health_endpoint():
    """Test the health check endpoint"""
    print("🏥 Testing Health Endpoint...")
    
    try:
        response = requests.get('http://localhost:5000/health')
        if response.status_code == 200:
            print("✅ Health endpoint is working")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health endpoint failed with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API. Is the backend running?")
    except Exception as e:
        print(f"❌ Health endpoint test failed: {str(e)}")

def test_features_endpoint():
    """Test the features endpoint"""
    print("\n📋 Testing Features Endpoint...")
    
    try:
        response = requests.get('http://localhost:5000/api/features')
        if response.status_code == 200:
            print("✅ Features endpoint is working")
            features = response.json()
            print(f"   Available features: {len(features)}")
            # Show first few features
            for i, (name, info) in enumerate(features.items()):
                if i >= 3:
                    break
                print(f"   - {name}: {info.get('description', 'No description')}")
        else:
            print(f"❌ Features endpoint failed with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API. Is the backend running?")
    except Exception as e:
        print(f"❌ Features endpoint test failed: {str(e)}")

def test_prediction_endpoint():
    """Test the prediction endpoint with sample data"""
    print("\n🔮 Testing Prediction Endpoint...")
    
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
    
    try:
        response = requests.post(
            'http://localhost:5000/api/predict',
            json=sample_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Prediction endpoint is working")
            result = response.json()
            print(f"   Prediction: {'Heart Disease Detected' if result['prediction'] == 1 else 'No Heart Disease'}")
            print(f"   Risk Level: {result['risk_level']}")
            print(f"   Confidence: {result['confidence']}")
        elif response.status_code == 400:
            print("❌ Prediction endpoint returned validation error")
            print(f"   Error: {response.json()}")
        else:
            print(f"❌ Prediction endpoint failed with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API. Is the backend running?")
    except Exception as e:
        print(f"❌ Prediction endpoint test failed: {str(e)}")

def main():
    """Main test function"""
    print("🧪 Heart Disease Prediction System - API Tests")
    print("=" * 50)
    
    test_health_endpoint()
    test_features_endpoint()
    test_prediction_endpoint()
    
    print("\n🏁 API tests completed!")

if __name__ == "__main__":
    main()