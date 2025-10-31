/**
 * API Service for Heart Disease Prediction
 */
import axios from 'axios';

// API base URL - defaults to localhost in development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any request preprocessing here
    console.log(`Making request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Predict heart disease for a single patient
 * @param {Object} patientData - Patient medical data
 * @returns {Promise<Object>} Prediction result
 */
export const predictHeartDisease = async (patientData) => {
  try {
    const response = await apiClient.post('/predict', patientData);
    return response.data;
  } catch (error) {
    throw new Error(`Prediction failed: ${error.message}`);
  }
};

/**
 * Batch predict for multiple patients
 * @param {File} csvFile - CSV file with patient data
 * @returns {Promise<Object>} Batch prediction results
 */
export const batchPredict = async (csvFile) => {
  try {
    const formData = new FormData();
    formData.append('file', csvFile);
    
    const response = await apiClient.post('/predict/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        // Handle upload progress if needed
        console.log(`Upload progress: ${Math.round((progressEvent.loaded * 100) / progressEvent.total)}%`);
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error(`Batch prediction failed: ${error.message}`);
  }
};

/**
 * Get model information
 * @returns {Promise<Object>} Model metadata
 */
export const getModelInfo = async () => {
  try {
    const response = await apiClient.get('/model/info');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch model info: ${error.message}`);
  }
};

/**
 * Get feature descriptions
 * @returns {Promise<Object>} Feature descriptions and valid ranges
 */
export const getFeatureDescriptions = async () => {
  try {
    const response = await apiClient.get('/features');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch feature descriptions: ${error.message}`);
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(`Health check failed: ${error.message}`);
  }
};

// Export the apiClient for direct usage if needed
export default apiClient;