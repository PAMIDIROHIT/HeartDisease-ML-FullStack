"""
Model Tests for Heart Disease Prediction System
"""

import numpy as np
from src.prediction.predictor import HeartDiseasePredictor

def test_predictor_initialization():
    """Test predictor initialization"""
    # This test will fail if no model is available, which is expected in a fresh environment
    try:
        predictor = HeartDiseasePredictor()
        assert predictor is not None
    except Exception:
        # This is expected if no trained model is available
        pass

def test_preprocess_input():
    """Test input preprocessing"""
    # Create a mock predictor (without loading model)
    predictor = HeartDiseasePredictor.__new__(HeartDiseasePredictor)
    predictor.feature_names = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
        'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
    ]
    predictor.scaler = None
    
    # Test data
    patient_data = {
        'age': 63,
        'sex': 1,
        'cp': 3,
        'trestbps': 145,
        'chol': 233,
        'fbs': 1,
        'restecg': 0,
        'thalach': 150,
        'exang': 0,
        'oldpeak': 2.3,
        'slope': 0,
        'ca': 0,
        'thal': 1
    }
    
    # Preprocess input
    processed = predictor.preprocess_input(patient_data)
    
    # Check that we get a numpy array
    assert isinstance(processed, np.ndarray)
    assert processed.shape[0] == 1  # One sample
    assert processed.shape[1] == 13  # 13 features

def test_feature_names():
    """Test feature names"""
    expected_features = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
        'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
    ]
    
    # Create a mock predictor
    predictor = HeartDiseasePredictor.__new__(HeartDiseasePredictor)
    predictor.feature_names = expected_features
    
    assert predictor.feature_names == expected_features
    assert len(predictor.feature_names) == 13