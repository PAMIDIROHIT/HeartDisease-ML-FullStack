"""
Data loading utilities for heart disease prediction
"""
import pandas as pd
import numpy as np
import os
from typing import Dict, Tuple
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def download_dataset(url: str = None, save_path: str = None) -> str:
    """
    Download the heart disease dataset from UCI repository or load local copy
    
    Args:
        url (str): URL to download dataset from
        save_path (str): Path to save the downloaded dataset
        
    Returns:
        str: Path to the dataset file
    """
    # For this implementation, we'll use the local heart.csv file
    local_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'heart.csv')
    
    # Check if local file exists
    if os.path.exists(local_path):
        logger.info(f"Using local dataset: {local_path}")
        return local_path
    
    # If we have the original heart.csv in the project root
    root_heart_csv = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'heart.csv')
    if os.path.exists(root_heart_csv):
        logger.info(f"Using root dataset: {root_heart_csv}")
        return root_heart_csv
    
    raise FileNotFoundError("Heart disease dataset not found. Please ensure heart.csv is available.")

def load_csv(file_path: str) -> pd.DataFrame:
    """
    Load and validate CSV file
    
    Args:
        file_path (str): Path to CSV file
        
    Returns:
        pd.DataFrame: Loaded dataframe
        
    Raises:
        FileNotFoundError: If file doesn't exist
        ValueError: If file is invalid
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset file not found: {file_path}")
    
    try:
        # Load the dataset
        df = pd.read_csv(file_path)
        logger.info(f"Loaded dataset with shape: {df.shape}")
        
        # Basic validation
        required_columns = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target'
        ]
        
        missing_columns = set(required_columns) - set(df.columns)
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        return df
        
    except Exception as e:
        logger.error(f"Error loading dataset: {str(e)}")
        raise ValueError(f"Failed to load dataset: {str(e)}")

def get_feature_descriptions() -> Dict[str, Dict]:
    """
    Get feature descriptions and metadata
    
    Returns:
        Dict: Dictionary with feature descriptions
    """
    return {
        'age': {
            'description': 'Age in years',
            'type': 'integer',
            'range': '20-100',
            'unit': 'years'
        },
        'sex': {
            'description': 'Sex',
            'type': 'integer',
            'values': {0: 'Female', 1: 'Male'}
        },
        'cp': {
            'description': 'Chest pain type',
            'type': 'integer',
            'values': {
                0: 'Typical angina',
                1: 'Atypical angina',
                2: 'Non-anginal pain',
                3: 'Asymptomatic'
            }
        },
        'trestbps': {
            'description': 'Resting blood pressure',
            'type': 'integer',
            'range': '90-200',
            'unit': 'mm Hg'
        },
        'chol': {
            'description': 'Serum cholesterol',
            'type': 'integer',
            'range': '100-600',
            'unit': 'mg/dl'
        },
        'fbs': {
            'description': 'Fasting blood sugar > 120 mg/dl',
            'type': 'integer',
            'values': {0: 'False', 1: 'True'}
        },
        'restecg': {
            'description': 'Resting electrocardiographic results',
            'type': 'integer',
            'values': {
                0: 'Normal',
                1: 'Having ST-T wave abnormality',
                2: 'Showing probable or definite left ventricular hypertrophy'
            }
        },
        'thalach': {
            'description': 'Maximum heart rate achieved',
            'type': 'integer',
            'range': '60-220',
            'unit': 'bpm'
        },
        'exang': {
            'description': 'Exercise induced angina',
            'type': 'integer',
            'values': {0: 'No', 1: 'Yes'}
        },
        'oldpeak': {
            'description': 'ST depression induced by exercise relative to rest',
            'type': 'float',
            'range': '0-10'
        },
        'slope': {
            'description': 'Slope of the peak exercise ST segment',
            'type': 'integer',
            'values': {
                0: 'Upsloping',
                1: 'Flat',
                2: 'Downsloping'
            }
        },
        'ca': {
            'description': 'Number of major vessels colored by fluoroscopy',
            'type': 'integer',
            'range': '0-3'
        },
        'thal': {
            'description': 'Thalassemia',
            'type': 'integer',
            'values': {
                0: 'Normal',
                1: 'Fixed defect',
                2: 'Reversible defect'
            }
        },
        'target': {
            'description': 'Diagnosis of heart disease',
            'type': 'integer',
            'values': {0: 'No disease', 1: 'Disease'}
        }
    }

def load_processed_data() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Load processed train and test datasets
    
    Returns:
        Tuple[pd.DataFrame, pd.DataFrame]: Train and test dataframes
    """
    train_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'processed', 'train.csv')
    test_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'processed', 'test.csv')
    
    if os.path.exists(train_path) and os.path.exists(test_path):
        train_df = pd.read_csv(train_path)
        test_df = pd.read_csv(test_path)
        logger.info(f"Loaded processed data - Train: {train_df.shape}, Test: {test_df.shape}")
        return train_df, test_df
    
    # If processed data doesn't exist, load raw data
    logger.warning("Processed data not found, loading raw data")
    raw_data_path = download_dataset()
    df = load_csv(raw_data_path)
    
    # For now, return the same data for both train and test
    # In a real implementation, you would split the data
    return df, df