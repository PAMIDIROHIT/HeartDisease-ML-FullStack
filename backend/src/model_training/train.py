"""
Model training utilities for heart disease prediction
"""
import pandas as pd
import numpy as np
import pickle
import os
import logging
from datetime import datetime
from typing import Dict, Tuple, Any
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import GridSearchCV, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def train_all_models(X_train: pd.DataFrame, y_train: pd.Series) -> Dict[str, Any]:
    """
    Train multiple models for heart disease prediction
    
    Args:
        X_train (pd.DataFrame): Training features
        y_train (pd.Series): Training labels
        
    Returns:
        Dict[str, Any]: Dictionary with trained models and their performance
    """
    logger.info("Starting model training for all algorithms")
    
    # Define models
    models = {
        'LogisticRegression': LogisticRegression(random_state=42, max_iter=1000),
        'DecisionTree': DecisionTreeClassifier(random_state=42),
        'RandomForest': RandomForestClassifier(random_state=42, n_estimators=100),
        'SVM': SVC(random_state=42, probability=True),
        'XGBoost': XGBClassifier(random_state=42),
        'NeuralNetwork': MLPClassifier(random_state=42, max_iter=1000)
    }
    
    trained_models = {}
    model_performance = {}
    
    # Train each model
    for name, model in models.items():
        try:
            logger.info(f"Training {name}...")
            model.fit(X_train, y_train)
            trained_models[name] = model
            
            # Cross-validation scores
            cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
            model_performance[name] = {
                'cv_mean': cv_scores.mean(),
                'cv_std': cv_scores.std()
            }
            
            logger.info(f"{name} trained successfully. CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
            
        except Exception as e:
            logger.error(f"Error training {name}: {str(e)}")
            continue
    
    return {
        'models': trained_models,
        'performance': model_performance
    }

def hyperparameter_tuning(X_train: pd.DataFrame, y_train: pd.Series, 
                         model_name: str = 'RandomForest') -> Dict[str, Any]:
    """
    Perform hyperparameter tuning for selected models
    
    Args:
        X_train (pd.DataFrame): Training features
        y_train (pd.Series): Training labels
        model_name (str): Name of the model to tune
        
    Returns:
        Dict[str, Any]: Dictionary with tuned model and best parameters
    """
    logger.info(f"Starting hyperparameter tuning for {model_name}")
    
    # Define parameter grids for different models
    param_grids = {
        'LogisticRegression': {
            'C': [0.1, 1, 10],
            'penalty': ['l1', 'l2'],
            'solver': ['liblinear']
        },
        'DecisionTree': {
            'max_depth': [3, 5, 7, 10, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4]
        },
        'RandomForest': {
            'n_estimators': [50, 100, 200],
            'max_depth': [3, 5, 7, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4]
        },
        'SVM': {
            'C': [0.1, 1, 10],
            'kernel': ['rbf', 'linear'],
            'gamma': ['scale', 'auto']
        },
        'XGBoost': {
            'n_estimators': [50, 100, 200],
            'max_depth': [3, 5, 7],
            'learning_rate': [0.01, 0.1, 0.2],
            'subsample': [0.8, 1.0]
        },
        'NeuralNetwork': {
            'hidden_layer_sizes': [(50,), (100,), (50, 50)],
            'activation': ['relu', 'tanh'],
            'alpha': [0.0001, 0.001, 0.01]
        }
    }
    
    if model_name not in param_grids:
        logger.warning(f"No parameter grid defined for {model_name}")
        return {}
    
    # Select model
    if model_name == 'LogisticRegression':
        model = LogisticRegression(random_state=42, max_iter=1000)
    elif model_name == 'DecisionTree':
        model = DecisionTreeClassifier(random_state=42)
    elif model_name == 'RandomForest':
        model = RandomForestClassifier(random_state=42)
    elif model_name == 'SVM':
        model = SVC(random_state=42, probability=True)
    elif model_name == 'XGBoost':
        model = XGBClassifier(random_state=42)
    elif model_name == 'NeuralNetwork':
        model = MLPClassifier(random_state=42, max_iter=1000)
    else:
        logger.error(f"Unsupported model: {model_name}")
        return {}
    
    # Perform grid search
    grid_search = GridSearchCV(
        model, 
        param_grids[model_name], 
        cv=5, 
        scoring='accuracy',
        n_jobs=-1,
        verbose=1
    )
    
    grid_search.fit(X_train, y_train)
    
    logger.info(f"Best parameters for {model_name}: {grid_search.best_params_}")
    logger.info(f"Best cross-validation score: {grid_search.best_score_:.4f}")
    
    return {
        'model': grid_search.best_estimator_,
        'best_params': grid_search.best_params_,
        'best_score': grid_search.best_score_
    }

def evaluate_models(models: Dict[str, Any], X_test: pd.DataFrame, y_test: pd.Series) -> Dict[str, Dict]:
    """
    Evaluate trained models on test set
    
    Args:
        models (Dict[str, Any]): Dictionary of trained models
        X_test (pd.DataFrame): Test features
        y_test (pd.Series): Test labels
        
    Returns:
        Dict[str, Dict]: Dictionary with evaluation metrics for each model
    """
    logger.info("Evaluating models on test set")
    
    evaluation_results = {}
    
    for name, model in models.items():
        try:
            # Make predictions
            y_pred = model.predict(X_test)
            y_pred_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else None
            
            # Calculate metrics
            metrics = {
                'accuracy': accuracy_score(y_test, y_pred),
                'precision': precision_score(y_test, y_pred, average='binary'),
                'recall': recall_score(y_test, y_pred, average='binary'),
                'f1_score': f1_score(y_test, y_pred, average='binary')
            }
            
            # ROC-AUC (if probabilities are available)
            if y_pred_proba is not None:
                metrics['roc_auc'] = roc_auc_score(y_test, y_pred_proba)
            
            evaluation_results[name] = metrics
            logger.info(f"{name} - Accuracy: {metrics['accuracy']:.4f}, F1: {metrics['f1_score']:.4f}")
            
        except Exception as e:
            logger.error(f"Error evaluating {name}: {str(e)}")
            continue
    
    return evaluation_results

def save_best_model(model: Any, scaler: Any, feature_names: list, model_path: str = None):
    """
    Save the best model, scaler, and feature names
    
    Args:
        model (Any): Trained model
        scaler (Any): Fitted scaler
        feature_names (list): List of feature names
        model_path (str): Path to save the model files
    """
    if model_path is None:
        model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'trained_models')
    
    # Create directory if it doesn't exist
    os.makedirs(model_path, exist_ok=True)
    
    # Save model
    model_file = os.path.join(model_path, 'best_model.pkl')
    with open(model_file, 'wb') as f:
        pickle.dump(model, f)
    
    # Save scaler
    scaler_file = os.path.join(model_path, 'scaler.pkl')
    with open(scaler_file, 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save feature names
    feature_file = os.path.join(model_path, 'feature_names.pkl')
    with open(feature_file, 'wb') as f:
        pickle.dump(feature_names, f)
    
    logger.info(f"Model, scaler, and feature names saved to {model_path}")

def create_model_card(model_name: str, metrics: Dict[str, float], 
                     best_params: Dict = None, save_path: str = None) -> str:
    """
    Create a model card with metadata and performance information
    
    Args:
        model_name (str): Name of the model
        metrics (Dict[str, float]): Performance metrics
        best_params (Dict): Best hyperparameters (optional)
        save_path (str): Path to save the model card
        
    Returns:
        str: Model card content
    """
    model_card = f"""
# Model Card: {model_name}

## Model Information
- **Model Name**: {model_name}
- **Training Date**: {datetime.now().strftime('%Y-%m-%d')}
- **Framework**: scikit-learn

## Performance Metrics
- **Accuracy**: {metrics.get('accuracy', 0):.4f}
- **Precision**: {metrics.get('precision', 0):.4f}
- **Recall**: {metrics.get('recall', 0):.4f}
- **F1 Score**: {metrics.get('f1_score', 0):.4f}
- **ROC AUC**: {metrics.get('roc_auc', 0):.4f}

## Hyperparameters
"""
    
    if best_params:
        for param, value in best_params.items():
            model_card += f"- **{param}**: {value}\n"
    else:
        model_card += "Default hyperparameters\n"
    
    model_card += """
## Notes
This model was trained on the UCI Heart Disease dataset for predicting heart disease risk.
"""
    
    if save_path:
        card_file = os.path.join(save_path, f'{model_name.replace(" ", "_")}_model_card.md')
        with open(card_file, 'w') as f:
            f.write(model_card)
        logger.info(f"Model card saved to {card_file}")
    
    return model_card

def main_training_pipeline():
    """
    Main training pipeline that executes the complete model training process
    """
    logger.info("Starting main training pipeline")
    
    try:
        # Import data loading functions
        from src.data_processing.load_data import load_processed_data
        from src.data_processing.preprocess import preprocess_pipeline
        from src.data_processing.feature_engineering import get_feature_names
        
        # Load data
        train_df, test_df = load_processed_data()
        
        # Preprocess data
        X_train, X_test, y_train, y_test, scaler = preprocess_pipeline(train_df)
        
        # Train all models
        training_results = train_all_models(X_train, y_train)
        models = training_results['models']
        performance = training_results['performance']
        
        # Evaluate models
        evaluation_results = evaluate_models(models, X_test, y_test)
        
        # Find best model based on F1 score
        best_model_name = max(evaluation_results.keys(), 
                             key=lambda x: evaluation_results[x]['f1_score'])
        best_model = models[best_model_name]
        best_metrics = evaluation_results[best_model_name]
        
        logger.info(f"Best model: {best_model_name} with F1 score: {best_metrics['f1_score']:.4f}")
        
        # Perform hyperparameter tuning on top 3 models
        top_models = sorted(evaluation_results.keys(), 
                           key=lambda x: evaluation_results[x]['f1_score'], 
                           reverse=True)[:3]
        
        tuned_models = {}
        for model_name in top_models:
            tuning_result = hyperparameter_tuning(X_train, y_train, model_name)
            if tuning_result:
                tuned_models[model_name] = tuning_result
        
        # Evaluate tuned models
        tuned_evaluation = {}
        for model_name, tuning_result in tuned_models.items():
            tuned_model = tuning_result['model']
            y_pred = tuned_model.predict(X_test)
            y_pred_proba = tuned_model.predict_proba(X_test)[:, 1]
            
            tuned_evaluation[model_name] = {
                'accuracy': accuracy_score(y_test, y_pred),
                'precision': precision_score(y_test, y_pred),
                'recall': recall_score(y_test, y_pred),
                'f1_score': f1_score(y_test, y_pred),
                'roc_auc': roc_auc_score(y_test, y_pred_proba)
            }
        
        # Find best tuned model
        if tuned_evaluation:
            best_tuned_model_name = max(tuned_evaluation.keys(), 
                                       key=lambda x: tuned_evaluation[x]['f1_score'])
            best_tuned_metrics = tuned_evaluation[best_tuned_model_name]
            
            if best_tuned_metrics['f1_score'] > best_metrics['f1_score']:
                best_model = tuned_models[best_tuned_model_name]['model']
                best_metrics = best_tuned_metrics
                best_model_name = f"{best_tuned_model_name} (Tuned)"
                best_params = tuned_models[best_tuned_model_name]['best_params']
            else:
                best_params = {}
        else:
            best_params = {}
        
        # Save best model
        feature_names = get_feature_names()
        save_best_model(best_model, scaler, feature_names)
        
        # Create model card
        model_card = create_model_card(best_model_name, best_metrics, best_params)
        logger.info("Model card created")
        logger.info(model_card)
        
        # Print summary
        logger.info("=== TRAINING SUMMARY ===")
        logger.info(f"Best Model: {best_model_name}")
        logger.info(f"Accuracy: {best_metrics['accuracy']:.4f}")
        logger.info(f"Precision: {best_metrics['precision']:.4f}")
        logger.info(f"Recall: {best_metrics['recall']:.4f}")
        logger.info(f"F1 Score: {best_metrics['f1_score']:.4f}")
        logger.info(f"ROC AUC: {best_metrics['roc_auc']:.4f}")
        
        return {
            'best_model': best_model,
            'best_model_name': best_model_name,
            'best_metrics': best_metrics,
            'all_models_performance': evaluation_results,
            'tuned_models_performance': tuned_evaluation
        }
        
    except Exception as e:
        logger.error(f"Error in training pipeline: {str(e)}")
        raise

if __name__ == "__main__":
    # Run the training pipeline
    results = main_training_pipeline()