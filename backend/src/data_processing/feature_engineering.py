"""
Feature engineering utilities for heart disease prediction
"""
import pandas as pd
import numpy as np
from typing import List, Dict
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_age_groups(df: pd.DataFrame, age_column: str = 'age') -> pd.DataFrame:
    """
    Create age group categories
    
    Args:
        df (pd.DataFrame): Input dataframe
        age_column (str): Name of the age column
        
    Returns:
        pd.DataFrame: Dataframe with age group column added
    """
    df_copy = df.copy()
    
    if age_column not in df_copy.columns:
        logger.warning(f"Age column '{age_column}' not found")
        return df_copy
    
    # Create age groups
    df_copy['age_group'] = pd.cut(
        df_copy[age_column],
        bins=[0, 30, 40, 50, 60, 100],
        labels=['<30', '30-40', '40-50', '50-60', '60+'],
        right=False
    )
    
    logger.info("Age groups created")
    return df_copy

def create_bp_categories(df: pd.DataFrame, bp_column: str = 'trestbps') -> pd.DataFrame:
    """
    Create blood pressure categories
    
    Args:
        df (pd.DataFrame): Input dataframe
        bp_column (str): Name of the blood pressure column
        
    Returns:
        pd.DataFrame: Dataframe with BP category column added
    """
    df_copy = df.copy()
    
    if bp_column not in df_copy.columns:
        logger.warning(f"Blood pressure column '{bp_column}' not found")
        return df_copy
    
    # Create BP categories based on medical guidelines
    conditions = [
        (df_copy[bp_column] < 90),
        (df_copy[bp_column] >= 90) & (df_copy[bp_column] < 120),
        (df_copy[bp_column] >= 120) & (df_copy[bp_column] < 130),
        (df_copy[bp_column] >= 130) & (df_copy[bp_column] < 140),
        (df_copy[bp_column] >= 140) & (df_copy[bp_column] < 180),
        (df_copy[bp_column] >= 180)
    ]
    
    choices = ['Low', 'Normal', 'Elevated', 'High Stage 1', 'High Stage 2', 'Hypertensive Crisis']
    df_copy['bp_category'] = np.select(conditions, choices, default='Unknown')
    
    logger.info("Blood pressure categories created")
    return df_copy

def create_chol_categories(df: pd.DataFrame, chol_column: str = 'chol') -> pd.DataFrame:
    """
    Create cholesterol categories
    
    Args:
        df (pd.DataFrame): Input dataframe
        chol_column (str): Name of the cholesterol column
        
    Returns:
        pd.DataFrame: Dataframe with cholesterol category column added
    """
    df_copy = df.copy()
    
    if chol_column not in df_copy.columns:
        logger.warning(f"Cholesterol column '{chol_column}' not found")
        return df_copy
    
    # Create cholesterol categories based on medical guidelines
    conditions = [
        (df_copy[chol_column] < 200),
        (df_copy[chol_column] >= 200) & (df_copy[chol_column] < 240),
        (df_copy[chol_column] >= 240)
    ]
    
    choices = ['Desirable', 'Borderline High', 'High']
    df_copy['chol_category'] = np.select(conditions, choices, default='Unknown')
    
    logger.info("Cholesterol categories created")
    return df_copy

def create_risk_score(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create a composite risk score based on multiple factors
    
    Args:
        df (pd.DataFrame): Input dataframe
        
    Returns:
        pd.DataFrame: Dataframe with risk score column added
    """
    df_copy = df.copy()
    
    # Required columns for risk score calculation
    required_columns = ['age', 'sex', 'trestbps', 'chol', 'thalach']
    missing_columns = [col for col in required_columns if col not in df_copy.columns]
    
    if missing_columns:
        logger.warning(f"Missing columns for risk score calculation: {missing_columns}")
        return df_copy
    
    # Simple risk score calculation (in a real implementation, this would be more complex)
    # Higher scores indicate higher risk
    df_copy['risk_score'] = (
        (df_copy['age'] / 100) * 0.2 +
        (df_copy['sex'] * 0.1) +
        ((df_copy['trestbps'] - 90) / 110) * 0.2 +
        ((df_copy['chol'] - 100) / 500) * 0.2 +
        (1 - (df_copy['thalach'] - 60) / 160) * 0.3
    )
    
    logger.info("Risk score created")
    return df_copy

def create_interaction_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create interaction features between selected variables
    
    Args:
        df (pd.DataFrame): Input dataframe
        
    Returns:
        pd.DataFrame: Dataframe with interaction features added
    """
    df_copy = df.copy()
    
    # Define interaction pairs
    interactions = [
        ('age', 'trestbps'),
        ('age', 'chol'),
        ('trestbps', 'chol'),
        ('thalach', 'age')
    ]
    
    for col1, col2 in interactions:
        if col1 in df_copy.columns and col2 in df_copy.columns:
            df_copy[f'{col1}_{col2}_interaction'] = df_copy[col1] * df_copy[col2]
            logger.info(f"Created interaction feature: {col1}_{col2}_interaction")
    
    return df_copy

def get_all_engineered_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Apply all feature engineering steps
    
    Args:
        df (pd.DataFrame): Input dataframe
        
    Returns:
        pd.DataFrame: Dataframe with all engineered features
    """
    logger.info("Starting feature engineering pipeline")
    
    df_engineered = df.copy()
    
    # Apply all feature engineering functions
    df_engineered = create_age_groups(df_engineered)
    df_engineered = create_bp_categories(df_engineered)
    df_engineered = create_chol_categories(df_engineered)
    df_engineered = create_risk_score(df_engineered)
    df_engineered = create_interaction_features(df_engineered)
    
    logger.info(f"Feature engineering completed. New shape: {df_engineered.shape}")
    return df_engineered

def get_feature_names() -> List[str]:
    """
    Get the list of feature names used in the model
    
    Returns:
        List[str]: List of feature names
    """
    # These are the standard features from the heart disease dataset
    standard_features = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
        'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
    ]
    
    return standard_features

def get_engineered_feature_names() -> List[str]:
    """
    Get the list of all engineered feature names
    
    Returns:
        List[str]: List of all engineered feature names
    """
    # Standard features
    standard_features = get_feature_names()
    
    # Engineered features
    engineered_features = [
        'age_group_<30', 'age_group_30-40', 'age_group_40-50', 'age_group_50-60', 'age_group_60+',
        'bp_category_Low', 'bp_category_Normal', 'bp_category_Elevated', 
        'bp_category_High Stage 1', 'bp_category_High Stage 2', 'bp_category_Hypertensive Crisis',
        'chol_category_Desirable', 'chol_category_Borderline High', 'chol_category_High',
        'risk_score',
        'age_trestbps_interaction', 'age_chol_interaction', 
        'trestbps_chol_interaction', 'thalach_age_interaction'
    ]
    
    return standard_features + engineered_features