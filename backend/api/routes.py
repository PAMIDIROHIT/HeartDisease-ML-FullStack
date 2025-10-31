import os
import sys
import json
import logging
from datetime import datetime
from io import BytesIO
import base64

from flask import Blueprint, request, jsonify, send_file
from flask_cors import CORS

# Add src directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from src.prediction.predictor import HeartDiseasePredictor
from src.services.pdf_generator import PDFGenerator

# Create blueprint
bp = Blueprint('api', __name__)

# Initialize predictor
predictor = HeartDiseasePredictor()

# Initialize PDF generator
pdf_generator = PDFGenerator()
    
@bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    logging.info("Health check endpoint called")
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@bp.route('/predict', methods=['POST'])
def predict():
    """Prediction endpoint"""
    logging.info("Predict endpoint called")
    try:
        # Get input data
        input_data = request.get_json()
        
        logging.info(f"Received input data: {input_data}")
        
        # Validate input
        if not input_data:
            return jsonify({'error': 'No input data provided'}), 400
            
        # Log the received data for debugging
        logging.info(f"Received prediction request with data: {input_data}")
        
        # Validate that all required fields are present
        required_fields = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
        missing_fields = [field for field in required_fields if field not in input_data]
        
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
            
        # Validate that all fields have numeric values
        for field in required_fields:
            try:
                float(input_data[field])
            except (ValueError, TypeError):
                return jsonify({'error': f'Invalid value for field {field}: {input_data[field]}'}), 400
        
        # Make prediction
        result = predictor.predict(input_data)
        
        # Add input data to result for tracking
        result['input_data'] = input_data
        
        logging.info(f"Prediction successful: {result}")
        return jsonify(result)
        
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500

@bp.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    """Generate PDF report endpoint"""
    try:
        # Get prediction data
        prediction_data = request.get_json()
        
        # Validate input
        if not prediction_data:
            return jsonify({'error': 'No prediction data provided'}), 400
        
        # Generate PDF
        pdf_bytes = pdf_generator.generate_heart_disease_report(prediction_data)
        
        # Create response with PDF data
        return jsonify({
            'success': True,
            'pdf_data': base64.b64encode(pdf_bytes).decode('utf-8'),
            'filename': f'heart_disease_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        })
        
    except Exception as e:
        logging.error(f"PDF generation error: {str(e)}")
        return jsonify({'error': 'PDF generation failed', 'details': str(e)}), 500

@bp.route('/download-pdf', methods=['POST'])
def download_pdf():
    """Download PDF report endpoint"""
    try:
        # Get prediction data
        prediction_data = request.get_json()
        
        # Validate input
        if not prediction_data:
            return jsonify({'error': 'No prediction data provided'}), 400
        
        # Generate PDF
        pdf_bytes = pdf_generator.generate_heart_disease_report(prediction_data)
        
        # Create BytesIO object
        pdf_buffer = BytesIO(pdf_bytes)
        pdf_buffer.seek(0)
        
        # Generate filename
        filename = f'heart_disease_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        
        # Return PDF as attachment
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        logging.error(f"PDF download error: {str(e)}")
        return jsonify({'error': 'PDF download failed', 'details': str(e)}), 500