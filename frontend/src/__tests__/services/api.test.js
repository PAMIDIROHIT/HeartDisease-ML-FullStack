import axios from 'axios';
import {
  predictHeartDisease,
  batchPredict,
  getModelInfo,
  getFeatureDescriptions,
  healthCheck
} from '../../services/api';

// Mock axios
jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('predictHeartDisease', () => {
    test('makes POST request to /predict endpoint', async () => {
      const mockResponse = { data: { prediction: 1, probability: 0.87 } };
      axios.post.mockResolvedValue(mockResponse);
      
      const patientData = { age: 63, sex: 1 };
      const result = await predictHeartDisease(patientData);
      
      expect(axios.post).toHaveBeenCalledWith('/predict', patientData);
      expect(result).toEqual(mockResponse.data);
    });

    test('throws error when prediction fails', async () => {
      axios.post.mockRejectedValue(new Error('Network error'));
      
      const patientData = { age: 63, sex: 1 };
      
      await expect(predictHeartDisease(patientData)).rejects.toThrow('Prediction failed');
    });
  });

  describe('batchPredict', () => {
    test('makes POST request with form data to /predict/batch endpoint', async () => {
      const mockResponse = { data: { predictions: [] } };
      axios.post.mockResolvedValue(mockResponse);
      
      const mockFile = new File([''], 'test.csv', { type: 'text/csv' });
      const result = await batchPredict(mockFile);
      
      expect(axios.post).toHaveBeenCalledWith('/predict/batch', expect.any(FormData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: expect.any(Function),
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getModelInfo', () => {
    test('makes GET request to /model/info endpoint', async () => {
      const mockResponse = { data: { name: 'Random Forest', accuracy: 0.87 } };
      axios.get.mockResolvedValue(mockResponse);
      
      const result = await getModelInfo();
      
      expect(axios.get).toHaveBeenCalledWith('/model/info');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getFeatureDescriptions', () => {
    test('makes GET request to /features endpoint', async () => {
      const mockResponse = { data: { age: { description: 'Age in years' } } };
      axios.get.mockResolvedValue(mockResponse);
      
      const result = await getFeatureDescriptions();
      
      expect(axios.get).toHaveBeenCalledWith('/features');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('healthCheck', () => {
    test('makes GET request to /health endpoint', async () => {
      const mockResponse = { data: { status: 'healthy' } };
      axios.get.mockResolvedValue(mockResponse);
      
      const result = await healthCheck();
      
      expect(axios.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual(mockResponse.data);
    });
  });
});