"""
Integration Tests for Heart Disease Prediction System
"""

import sys
import os
import json

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

def test_data_loading():
    """Test data loading functionality"""
    try:
        from src.data_processing.load_data import load_csv, get_feature_descriptions
        
        # Test feature descriptions
        features = get_feature_descriptions()
        assert isinstance(features, dict)
        assert len(features) > 0
        assert 'age' in features
        assert 'sex' in features
        
        print("✅ Data loading test passed")
        return True
    except Exception as e:
        print(f"❌ Data loading test failed: {str(e)}")
        return False

def test_preprocessing():
    """Test preprocessing functionality"""
    try:
        from src.data_processing.preprocess import handle_missing_values, encode_categorical
        import pandas as pd
        import numpy as np
        
        # Create test data
        df = pd.DataFrame({
            'age': [25, 30, np.nan, 40],
            'sex': [0, 1, 0, 1],
            'cp': [0, 1, 2, 3]
        })
        
        # Test missing value handling
        df_clean = handle_missing_values(df)
        assert df_clean.isnull().sum().sum() == 0
        
        # Test categorical encoding
        df_encoded = encode_categorical(df_clean, columns=['cp'])
        assert 'cp_1' in df_encoded.columns
        
        print("✅ Preprocessing test passed")
        return True
    except Exception as e:
        print(f"❌ Preprocessing test failed: {str(e)}")
        return False

def test_feature_engineering():
    """Test feature engineering functionality"""
    try:
        from src.data_processing.feature_engineering import get_feature_names, get_engineered_feature_names
        
        # Test feature names
        features = get_feature_names()
        assert isinstance(features, list)
        assert len(features) == 13  # Standard features
        assert 'age' in features
        assert 'sex' in features
        
        # Test engineered features
        engineered_features = get_engineered_feature_names()
        assert isinstance(engineered_features, list)
        assert len(engineered_features) > 13  # Should include engineered features
        
        print("✅ Feature engineering test passed")
        return True
    except Exception as e:
        print(f"❌ Feature engineering test failed: {str(e)}")
        return False

def test_model_training_imports():
    """Test that model training modules can be imported"""
    try:
        from src.model_training.train import train_all_models, evaluate_models
        print("✅ Model training imports test passed")
        return True
    except Exception as e:
        print(f"❌ Model training imports test failed: {str(e)}")
        return False

def test_prediction_service():
    """Test prediction service functionality"""
    try:
        from src.prediction.predictor import HeartDiseasePredictor
        
        # Create a mock predictor (without loading model)
        predictor = HeartDiseasePredictor.__new__(HeartDiseasePredictor)
        predictor.feature_names = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ]
        predictor.scaler = None
        predictor.model = None  # We won't actually make predictions
        
        # Test preprocess_input method
        sample_data = {
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
        
        # This should not raise an exception
        processed = predictor.preprocess_input(sample_data)
        
        print("✅ Prediction service test passed")
        return True
    except Exception as e:
        print(f"❌ Prediction service test failed: {str(e)}")
        return False

def test_api_imports():
    """Test that API modules can be imported"""
    try:
        from api.app import create_app
        from api.routes import bp
        from api.validators import validate_patient_data, sanitize_input
        
        # Test validation functions
        valid_data = {
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
        
        is_valid, errors = validate_patient_data(valid_data)
        assert isinstance(is_valid, bool)
        
        clean_data = sanitize_input(valid_data)
        assert isinstance(clean_data, dict)
        
        print("✅ API imports test passed")
        return True
    except Exception as e:
        print(f"❌ API imports test failed: {str(e)}")
        return False

def main():
    """Run all integration tests"""
    print("🧪 Running Heart Disease Prediction System Integration Tests")
    print("=" * 60)
    
    tests = [
        test_data_loading,
        test_preprocessing,
        test_feature_engineering,
        test_model_training_imports,
        test_prediction_service,
        test_api_imports
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            if test():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {str(e)}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All integration tests passed!")
        return 0
    else:
        print("❌ Some tests failed. Please check the output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())