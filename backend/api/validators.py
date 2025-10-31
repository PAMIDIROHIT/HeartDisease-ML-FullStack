"""
Input validation for Heart Disease Prediction API
"""
import re
from werkzeug.datastructures import FileStorage

def validate_patient_data(data):
    """
    Validate patient data for heart disease prediction
    
    Args:
        data (dict): Patient data dictionary
        
    Returns:
        tuple: (is_valid, errors) where is_valid is boolean and errors is list of error messages
    """
    errors = []
    
    # Required fields
    required_fields = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
        'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
    ]
    
    # Check for missing fields
    for field in required_fields:
        if field not in data:
            errors.append(f"Missing required field: {field}")
            continue
            
        # Validate data types and ranges
        try:
            if field == 'age':
                age = int(data[field])
                if not 20 <= age <= 100:
                    errors.append("Age must be between 20 and 100")
                    
            elif field == 'sex':
                sex = int(data[field])
                if sex not in [0, 1]:
                    errors.append("Sex must be 0 (female) or 1 (male)")
                    
            elif field == 'cp':
                cp = int(data[field])
                if cp not in [0, 1, 2, 3]:
                    errors.append("Chest pain type must be 0, 1, 2, or 3")
                    
            elif field == 'trestbps':
                trestbps = int(data[field])
                if not 90 <= trestbps <= 200:
                    errors.append("Resting blood pressure must be between 90 and 200 mm Hg")
                    
            elif field == 'chol':
                chol = int(data[field])
                if not 100 <= chol <= 600:
                    errors.append("Cholesterol must be between 100 and 600 mg/dl")
                    
            elif field == 'fbs':
                fbs = int(data[field])
                if fbs not in [0, 1]:
                    errors.append("Fasting blood sugar must be 0 or 1")
                    
            elif field == 'restecg':
                restecg = int(data[field])
                if restecg not in [0, 1, 2]:
                    errors.append("Resting ECG must be 0, 1, or 2")
                    
            elif field == 'thalach':
                thalach = int(data[field])
                if not 60 <= thalach <= 220:
                    errors.append("Maximum heart rate must be between 60 and 220 bpm")
                    
            elif field == 'exang':
                exang = int(data[field])
                if exang not in [0, 1]:
                    errors.append("Exercise induced angina must be 0 or 1")
                    
            elif field == 'oldpeak':
                oldpeak = float(data[field])
                if not 0 <= oldpeak <= 10:
                    errors.append("ST depression must be between 0 and 10")
                    
            elif field == 'slope':
                slope = int(data[field])
                if slope not in [0, 1, 2]:
                    errors.append("Slope must be 0, 1, or 2")
                    
            elif field == 'ca':
                ca = int(data[field])
                if not 0 <= ca <= 3:
                    errors.append("Number of major vessels must be between 0 and 3")
                    
            elif field == 'thal':
                thal = int(data[field])
                if thal not in [0, 1, 2]:
                    errors.append("Thalassemia must be 0, 1, or 2")
                    
        except (ValueError, TypeError):
            errors.append(f"Invalid data type for field: {field}")
    
    return len(errors) == 0, errors

def validate_csv_file(file):
    """
    Validate CSV file for batch prediction
    
    Args:
        file (FileStorage): Uploaded CSV file
        
    Returns:
        tuple: (is_valid, errors) where is_valid is boolean and errors is list of error messages
    """
    errors = []
    
    # Check if file is provided
    if not file:
        errors.append("No file provided")
        return False, errors
    
    # Check file type
    if not isinstance(file, FileStorage):
        errors.append("Invalid file object")
        return False, errors
    
    # Check filename
    if not file.filename:
        errors.append("No file selected")
        return False, errors
    
    # Check file extension
    if not file.filename.lower().endswith('.csv'):
        errors.append("File must be a CSV file")
        return False, errors
    
    # Check file size (limit to 10MB)
    file.seek(0, 2)  # Seek to end of file
    file_length = file.tell()
    file.seek(0)  # Reset file pointer
    
    if file_length > 10 * 1024 * 1024:  # 10MB
        errors.append("File size must be less than 10MB")
        return False, errors
    
    return True, errors

def sanitize_input(data):
    """
    Sanitize input data by removing extra whitespace and converting types
    
    Args:
        data (dict): Raw input data
        
    Returns:
        dict: Sanitized data
    """
    sanitized = {}
    
    for key, value in data.items():
        # Handle None values
        if value is None:
            sanitized[key] = None
            continue
            
        # Convert to string and strip whitespace
        if isinstance(value, str):
            value = value.strip()
            
        # Convert numeric strings to appropriate types
        if isinstance(value, str):
            # Check if it's a float
            if re.match(r'^-?\d+\.\d+$', value):
                sanitized[key] = float(value)
                continue
                
            # Check if it's an integer
            if re.match(r'^-?\d+$', value):
                sanitized[key] = int(value)
                continue
                
        # Keep the value as is
        sanitized[key] = value
    
    return sanitized