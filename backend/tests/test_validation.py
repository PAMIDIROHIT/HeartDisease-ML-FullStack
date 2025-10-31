"""
Validation Tests for Heart Disease Prediction System
"""

def test_patient_data_validation():
    """Test patient data validation"""
    from api.validators import validate_patient_data
    
    # Test valid data
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
    assert is_valid == True
    assert len(errors) == 0
    
    # Test invalid data - missing fields
    invalid_data = {
        'age': 63,
        'sex': 1
        # Missing many required fields
    }
    
    is_valid, errors = validate_patient_data(invalid_data)
    assert is_valid == False
    assert len(errors) > 0
    
    # Test invalid data - wrong types
    wrong_type_data = {
        'age': 'sixty-three',  # Should be integer
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
    
    is_valid, errors = validate_patient_data(wrong_type_data)
    assert is_valid == False
    assert len(errors) > 0

def test_data_sanitization():
    """Test data sanitization"""
    from api.validators import sanitize_input
    
    # Test data with extra whitespace
    dirty_data = {
        'age': ' 63 ',
        'sex': '1',
        'cp': ' 3',
        'trestbps': '145 '
    }
    
    clean_data = sanitize_input(dirty_data)
    
    # Check that whitespace is removed
    assert clean_data['age'] == 63  # Should be converted to int
    assert clean_data['sex'] == 1   # Should be converted to int
    assert clean_data['cp'] == 3    # Should be converted to int
    assert clean_data['trestbps'] == 145  # Should be converted to int