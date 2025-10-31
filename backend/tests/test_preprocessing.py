"""
Preprocessing Tests for Heart Disease Prediction System
"""

import pandas as pd
import numpy as np
from src.data_processing.preprocess import (
    handle_missing_values,
    remove_outliers,
    encode_categorical,
    scale_features,
    split_data
)

def test_handle_missing_values():
    """Test handling of missing values"""
    # Create a DataFrame with missing values
    df = pd.DataFrame({
        'age': [25, 30, np.nan, 40],
        'sex': [0, 1, 0, 1],
        'chol': [200, np.nan, 250, 300]
    })
    
    # Check that we have missing values
    assert df.isnull().sum().sum() > 0
    
    # Handle missing values
    df_clean = handle_missing_values(df)
    
    # Check that missing values are handled
    assert df_clean.isnull().sum().sum() == 0

def test_encode_categorical():
    """Test categorical encoding"""
    # Create a DataFrame with categorical data
    df = pd.DataFrame({
        'age': [25, 30, 35, 40],
        'sex': [0, 1, 0, 1],
        'cp': [0, 1, 2, 3]
    })
    
    # Encode categorical variables
    df_encoded = encode_categorical(df, columns=['cp'])
    
    # Check that encoding worked
    assert 'cp_1' in df_encoded.columns
    assert 'cp_2' in df_encoded.columns
    assert 'cp_3' in df_encoded.columns
    # Note: cp_0 is dropped due to drop_first=True

def test_scale_features():
    """Test feature scaling"""
    # Create a DataFrame with numerical data
    df = pd.DataFrame({
        'age': [25, 30, 35, 40],
        'chol': [200, 250, 300, 350],
        'trestbps': [120, 130, 140, 150]
    })
    
    # Scale features
    df_scaled, scaler = scale_features(df, fit=True)
    
    # Check that scaling worked
    assert df_scaled.shape == df.shape
    # Mean should be close to 0 and std close to 1 after scaling
    np.testing.assert_almost_equal(df_scaled.mean().mean(), 0.0, decimal=1)
    np.testing.assert_almost_equal(df_scaled.std().mean(), 1.0, decimal=1)

def test_split_data():
    """Test data splitting"""
    # Create a sample DataFrame
    df = pd.DataFrame({
        'age': [25, 30, 35, 40, 45, 50, 55, 60],
        'sex': [0, 1, 0, 1, 0, 1, 0, 1],
        'target': [0, 1, 0, 1, 0, 1, 0, 1]
    })
    
    # Split data
    X_train, X_test, y_train, y_test = split_data(df, target_column='target', test_size=0.5)
    
    # Check shapes
    assert len(X_train) == 4
    assert len(X_test) == 4
    assert len(y_train) == 4
    assert len(y_test) == 4
    
    # Check that target column is not in features
    assert 'target' not in X_train.columns
    assert 'target' not in X_test.columns