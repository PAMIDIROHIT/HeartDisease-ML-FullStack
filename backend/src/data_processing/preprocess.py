"""
Data preprocessing utilities for heart disease prediction
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from typing import Tuple, List
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """
    Handle missing values in the dataset
    
    Args:
        df (pd.DataFrame): Input dataframe
        
    Returns:
        pd.DataFrame: Dataframe with missing values handled
    """
    df_copy = df.copy()
    
    # Check for missing values
    missing_counts = df_copy.isnull().sum()
    if missing_counts.sum() == 0:
        logger.info("No missing values found in the dataset")
        return df_copy
    
    logger.info(f"Found missing values: {missing_counts[missing_counts > 0].to_dict()}")
    
    # For numerical columns, use median imputation
    numerical_columns = df_copy.select_dtypes(include=[np.number]).columns.tolist()
    if numerical_columns:
        imputer = SimpleImputer(strategy='median')
        df_copy[numerical_columns] = imputer.fit_transform(df_copy[numerical_columns])
    
    # For categorical columns, use mode imputation
    categorical_columns = df_copy.select_dtypes(exclude=[np.number]).columns.tolist()
    if categorical_columns:
        imputer = SimpleImputer(strategy='most_frequent')
        df_copy[categorical_columns] = imputer.fit_transform(df_copy[categorical_columns])
    
    logger.info("Missing values handled successfully")
    return df_copy

def remove_outliers(df: pd.DataFrame, columns: List[str] = None) -> pd.DataFrame:
    """
    Remove outliers using IQR method
    
    Args:
        df (pd.DataFrame): Input dataframe
        columns (List[str]): Columns to check for outliers. If None, uses all numerical columns
        
    Returns:
        pd.DataFrame: Dataframe with outliers removed
    """
    df_copy = df.copy()
    
    if columns is None:
        columns = df_copy.select_dtypes(include=[np.number]).columns.tolist()
    
    initial_shape = df_copy.shape
    outlier_indices = set()
    
    for column in columns:
        if column not in df_copy.columns:
            continue
            
        # Calculate Q1, Q3, and IQR
        Q1 = df_copy[column].quantile(0.25)
        Q3 = df_copy[column].quantile(0.75)
        IQR = Q3 - Q1
        
        # Define outlier bounds
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        # Find outlier indices
        column_outliers = df_copy[(df_copy[column] < lower_bound) | 
                                 (df_copy[column] > upper_bound)].index
        outlier_indices.update(column_outliers)
    
    # Remove outliers
    df_copy = df_copy.drop(list(outlier_indices))
    
    logger.info(f"Removed {len(outlier_indices)} outliers. Shape changed from {initial_shape} to {df_copy.shape}")
    return df_copy

def encode_categorical(df: pd.DataFrame, columns: List[str] = None) -> pd.DataFrame:
    """
    Encode categorical variables using one-hot encoding
    
    Args:
        df (pd.DataFrame): Input dataframe
        columns (List[str]): Columns to encode. If None, automatically detects categorical columns
        
    Returns:
        pd.DataFrame: Dataframe with encoded categorical variables
    """
    df_copy = df.copy()
    
    if columns is None:
        # Automatically detect categorical columns (object type or with few unique values)
        categorical_columns = []
        for col in df_copy.columns:
            if df_copy[col].dtype == 'object' or df_copy[col].nunique() <= 10:
                categorical_columns.append(col)
        columns = categorical_columns
    
    if not columns:
        logger.info("No categorical columns found to encode")
        return df_copy
    
    logger.info(f"Encoding categorical columns: {columns}")
    
    # One-hot encode categorical columns
    df_encoded = pd.get_dummies(df_copy, columns=columns, drop_first=True)
    
    logger.info(f"Encoded dataframe shape: {df_encoded.shape}")
    return df_encoded

def scale_features(df: pd.DataFrame, scaler=None, fit=True) -> Tuple[pd.DataFrame, object]:
    """
    Scale numerical features using StandardScaler
    
    Args:
        df (pd.DataFrame): Input dataframe
        scaler (StandardScaler): Pre-fitted scaler. If None, creates a new one
        fit (bool): Whether to fit the scaler or just transform
        
    Returns:
        Tuple[pd.DataFrame, StandardScaler]: Scaled dataframe and fitted scaler
    """
    df_copy = df.copy()
    
    # Select numerical columns
    numerical_columns = df_copy.select_dtypes(include=[np.number]).columns.tolist()
    
    if not numerical_columns:
        logger.info("No numerical columns found to scale")
        return df_copy, scaler
    
    logger.info(f"Scaling numerical columns: {numerical_columns}")
    
    if scaler is None:
        scaler = StandardScaler()
    
    if fit:
        df_copy[numerical_columns] = scaler.fit_transform(df_copy[numerical_columns])
    else:
        df_copy[numerical_columns] = scaler.transform(df_copy[numerical_columns])
    
    return df_copy, scaler

def split_data(df: pd.DataFrame, target_column: str = 'target', 
               test_size: float = 0.2, random_state: int = 42) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Split data into train and test sets
    
    Args:
        df (pd.DataFrame): Input dataframe
        target_column (str): Name of the target column
        test_size (float): Proportion of dataset to include in test split
        random_state (int): Random state for reproducibility
        
    Returns:
        Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]: X_train, X_test, y_train, y_test
    """
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in dataframe")
    
    # Separate features and target
    X = df.drop(columns=[target_column])
    y = df[target_column]
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    logger.info(f"Data split - Train: {X_train.shape}, Test: {X_test.shape}")
    return X_train, X_test, y_train, y_test

def preprocess_pipeline(df: pd.DataFrame, target_column: str = 'target') -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, object]:
    """
    Complete preprocessing pipeline
    
    Args:
        df (pd.DataFrame): Input dataframe
        target_column (str): Name of the target column
        
    Returns:
        Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, StandardScaler]: 
        X_train, X_test, y_train, y_test, fitted scaler
    """
    logger.info("Starting preprocessing pipeline")
    
    # Handle missing values
    df_clean = handle_missing_values(df)
    
    # Remove outliers (optional, can be skipped for prediction)
    # df_clean = remove_outliers(df_clean)
    
    # Encode categorical variables
    df_encoded = encode_categorical(df_clean)
    
    # Split data
    X_train, X_test, y_train, y_test = split_data(df_encoded, target_column)
    
    # Scale features
    X_train_scaled, scaler = scale_features(X_train, fit=True)
    X_test_scaled, _ = scale_features(X_test, scaler, fit=False)
    
    logger.info("Preprocessing pipeline completed")
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler