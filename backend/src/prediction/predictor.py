"""
Heart Disease Prediction Service
"""
import pandas as pd
import numpy as np
import pickle
import os
import logging
from typing import Dict, List, Any, Union
import warnings
warnings.filterwarnings("ignore")

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HeartDiseasePredictor:
    """
    Heart Disease Prediction Service
    """
    
    def __init__(self, model_path: str = None):
        """
        Initialize the predictor with trained model, scaler, and feature configuration
        
        Args:
            model_path (str): Path to the trained model directory
        """
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'trained_models')
        
        self.model_path = model_path
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.explainer = None
        
        # Load components
        self._load_model_components()
    
    def _load_model_components(self):
        """Load trained model, scaler, and feature names"""
        try:
            # Load model
            model_file = os.path.join(self.model_path, 'best_model.pkl')
            if os.path.exists(model_file):
                with open(model_file, 'rb') as f:
                    self.model = pickle.load(f)
                logger.info("Model loaded successfully")
            else:
                # Try to find the existing model in the project root
                root_model = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'best_model_random_forest_(tuned).pkl')
                if os.path.exists(root_model):
                    with open(root_model, 'rb') as f:
                        self.model = pickle.load(f)
                    logger.info("Using existing model from project root")
                else:
                    logger.warning("No trained model found")
            
            # Load scaler
            scaler_file = os.path.join(self.model_path, 'scaler.pkl')
            if os.path.exists(scaler_file):
                with open(scaler_file, 'rb') as f:
                    self.scaler = pickle.load(f)
                logger.info("Scaler loaded successfully")
            else:
                # Try to find the existing scaler in the project root
                root_scaler = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'scaler.pkl')
                if os.path.exists(root_scaler):
                    with open(root_scaler, 'rb') as f:
                        self.scaler = pickle.load(f)
                    logger.info("Using existing scaler from project root")
                else:
                    logger.warning("No scaler found")
            
            # Load feature names
            feature_file = os.path.join(self.model_path, 'feature_names.pkl')
            if os.path.exists(feature_file):
                with open(feature_file, 'rb') as f:
                    self.feature_names = pickle.load(f)
                logger.info("Feature names loaded successfully")
            else:
                # Try to find the existing feature names in the project root
                root_features = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'feature_names.pkl')
                if os.path.exists(root_features):
                    with open(root_features, 'rb') as f:
                        self.feature_names = pickle.load(f)
                    logger.info("Using existing feature names from project root")
                else:
                    # Default feature names
                    self.feature_names = [
                        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
                        'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
                    ]
                    logger.info("Using default feature names")
            
        except Exception as e:
            logger.error(f"Error loading model components: {str(e)}")
            raise
    
    def preprocess_input(self, patient_data: Dict[str, Any]) -> np.ndarray:
        """
        Preprocess input data for prediction
        
        Args:
            patient_data (Dict[str, Any]): Patient data dictionary
            
        Returns:
            np.ndarray: Processed feature array
        """
        try:
            # Create DataFrame from patient data
            df = pd.DataFrame([patient_data])
            
            # Ensure all required features are present
            for feature in self.feature_names:
                if feature not in df.columns:
                    df[feature] = 0  # Default value
            
            # Select and order features
            df = df[self.feature_names]
            
            # Scale features if scaler is available
            if self.scaler is not None:
                df_scaled = self.scaler.transform(df)
            else:
                df_scaled = df.values
            
            return df_scaled
            
        except Exception as e:
            logger.error(f"Error preprocessing input: {str(e)}")
            raise
    
    def predict(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make heart disease prediction for a single patient
        
        Args:
            patient_data (Dict[str, Any]): Patient data dictionary
            
        Returns:
            Dict[str, Any]: Prediction results
        """
        try:
            # Preprocess input
            processed_data = self.preprocess_input(patient_data)
            
            # Make prediction
            prediction = self.model.predict(processed_data)[0]
            probability = self.model.predict_proba(processed_data)[0]
            
            # Get probability for positive class (heart disease)
            prob_heart_disease = probability[1]
            
            # Calculate risk level
            if prob_heart_disease < 0.3:
                risk_level = "Low"
            elif prob_heart_disease < 0.7:
                risk_level = "Medium"
            else:
                risk_level = "High"
            
            # Format confidence
            confidence = f"{prob_heart_disease * 100:.1f}%"
            
            # Create feature importance (mock values since we don't have SHAP explainer)
            feature_importance = {}
            if hasattr(self.model, 'feature_importances_'):
                importances = self.model.feature_importances_
                for i, feature in enumerate(self.feature_names):
                    feature_importance[feature] = float(importances[i])
            else:
                # Mock feature importance for demonstration
                mock_importance = [
                    0.12, 0.08, 0.15, 0.10, 0.09, 0.05,
                    0.07, 0.13, 0.06, 0.08, 0.04, 0.02, 0.01
                ]
                for i, feature in enumerate(self.feature_names):
                    feature_importance[feature] = mock_importance[i] if i < len(mock_importance) else 0.01
            
            # Generate recommendations based on risk level
            recommendations = []
            if risk_level == "High":
                recommendations = [
                    "Consult a cardiologist immediately",
                    "Consider stress tests and echocardiograms",
                    "Review lifestyle factors (diet, exercise, smoking)",
                    "Monitor blood pressure and cholesterol regularly"
                ]
            elif risk_level == "Medium":
                recommendations = [
                    "Schedule a checkup with your doctor",
                    "Consider lifestyle modifications",
                    "Monitor symptoms and risk factors",
                    "Regular exercise and healthy diet"
                ]
            else:
                recommendations = [
                    "Maintain healthy lifestyle habits",
                    "Regular checkups as recommended by your doctor",
                    "Continue current exercise regimen",
                    "Monitor risk factors periodically"
                ]
            
            # Create result dictionary
            result = {
                "prediction": int(prediction),
                "probability": float(prob_heart_disease),
                "risk_level": risk_level,
                "confidence": confidence,
                "feature_importance": feature_importance,
                "recommendations": recommendations
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error making prediction: {str(e)}")
            raise
    
    def predict_proba(self, patient_data: Dict[str, Any]) -> np.ndarray:
        """
        Get prediction probabilities for both classes
        
        Args:
            patient_data (Dict[str, Any]): Patient data dictionary
            
        Returns:
            np.ndarray: Array of probabilities for each class
        """
        processed_data = self.preprocess_input(patient_data)
        return self.model.predict_proba(processed_data)[0]
    
    def batch_predict(self, data_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Make predictions for multiple patients
        
        Args:
            data_list (List[Dict[str, Any]]): List of patient data dictionaries
            
        Returns:
            List[Dict[str, Any]]: List of prediction results
        """
        results = []
        for patient_data in data_list:
            try:
                result = self.predict(patient_data)
                results.append(result)
            except Exception as e:
                results.append({
                    "error": "Prediction failed",
                    "message": str(e)
                })
        return results

# For testing the predictor
if __name__ == "__main__":
    # Example usage
    predictor = HeartDiseasePredictor()
    
    # Sample patient data
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
    
    # Make prediction
    result = predictor.predict(sample_data)
    print("Prediction result:", result)