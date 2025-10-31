import React, { useState } from 'react';
import axios from 'axios';
import ResultCard from './ResultCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('personal'); // For tab navigation
  const [showHelp, setShowHelp] = useState(false); // For help modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Form data being submitted:', formData);

    // Validate that all fields are filled
    const emptyFields = Object.entries(formData).filter(([key, value]) => 
      value === '' || value === null || value === undefined
    );
    
    if (emptyFields.length > 0) {
      setError(`Please fill in all fields. Missing: ${emptyFields.map(([key]) => key).join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      // Convert form data to numbers with validation
      const numericData = {};
      let hasInvalidData = false;
      
      for (const key in formData) {
        const value = parseFloat(formData[key]);
        if (isNaN(value)) {
          setError(`Invalid value for ${key}. Please enter a valid number.`);
          hasInvalidData = true;
          break;
        }
        numericData[key] = value;
      }
      
      if (hasInvalidData) {
        setLoading(false);
        return;
      }

      console.log('Sending request to backend with data:', numericData);

      // Make API call to backend
      const response = await axios.post('http://localhost:5000/api/predict', numericData);
      
      console.log('Received response from backend:', response);
      
      // Add input data to result for dashboard tracking
      const resultWithInput = {
        ...response.data,
        input_data: numericData
      };
      
      setResult(resultWithInput);
    } catch (err) {
      console.error('Prediction error:', err);
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data.error || 'Failed to get prediction. Please check your data and try again.';
        const errorDetails = err.response.data.details ? ` Details: ${err.response.data.details}` : '';
        setError(`Server error: ${errorMessage}${errorDetails}`);
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error: Unable to connect to the prediction service. Please make sure the backend server is running.');
      } else {
        // Something else happened
        setError(`Error: ${err.message || 'Failed to get prediction. Please check your data and try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      age: '',
      sex: '',
      cp: '',
      trestbps: '',
      chol: '',
      fbs: '',
      restecg: '',
      thalach: '',
      exang: '',
      oldpeak: '',
      slope: '',
      ca: '',
      thal: ''
    });
    setResult(null);
    setError(null);
    setActiveSection('personal');
  };

  const handleNewPrediction = () => {
    handleReset();
  };

  // Helper function to get helper text for each field
  const getHelperText = (fieldName) => {
    const helperTexts = {
      age: 'Age in years (20-100)',
      sex: '0 = Female, 1 = Male',
      cp: 'Chest pain type: 0=Typical angina, 1=Atypical angina, 2=Non-anginal pain, 3=Asymptomatic',
      trestbps: 'Resting blood pressure in mm Hg (90-200)',
      chol: 'Serum cholesterol in mg/dl (100-600)',
      fbs: 'Fasting blood sugar > 120 mg/dl: 0=False, 1=True',
      restecg: 'Resting electrocardiographic results: 0=Normal, 1=ST-T abnormality, 2=Left ventricular hypertrophy',
      thalach: 'Maximum heart rate achieved (60-220)',
      exang: 'Exercise induced angina: 0=No, 1=Yes',
      oldpeak: 'ST depression induced by exercise relative to rest (0-10)',
      slope: 'Slope of peak exercise ST segment: 0=Upsloping, 1=Flat, 2=Downsloping',
      ca: 'Number of major vessels colored by fluoroscopy (0-3)',
      thal: 'Thalassemia: 0=Normal, 1=Fixed defect, 2=Reversible defect'
    };
    return helperTexts[fieldName] || '';
  };

  // Function to get field labels
  const getFieldLabel = (fieldName) => {
    const labels = {
      age: 'Age',
      sex: 'Sex',
      cp: 'Chest Pain Type',
      trestbps: 'Resting Blood Pressure',
      chol: 'Cholesterol',
      fbs: 'Fasting Blood Sugar',
      restecg: 'Resting ECG Results',
      thalach: 'Maximum Heart Rate',
      exang: 'Exercise Induced Angina',
      oldpeak: 'ST Depression',
      slope: 'Slope of Peak Exercise',
      ca: 'Major Vessels',
      thal: 'Thalassemia'
    };
    return labels[fieldName] || fieldName;
  };

  // Function to get options for select fields
  const getFieldOptions = (fieldName) => {
    const options = {
      sex: [
        { value: '', label: 'Select sex' },
        { value: '0', label: 'Female' },
        { value: '1', label: 'Male' }
      ],
      cp: [
        { value: '', label: 'Select chest pain type' },
        { value: '0', label: '0 - Typical angina' },
        { value: '1', label: '1 - Atypical angina' },
        { value: '2', label: '2 - Non-anginal pain' },
        { value: '3', label: '3 - Asymptomatic' }
      ],
      fbs: [
        { value: '', label: 'Select fasting blood sugar' },
        { value: '0', label: '0 - ≤ 120 mg/dl' },
        { value: '1', label: '1 - > 120 mg/dl' }
      ],
      restecg: [
        { value: '', label: 'Select ECG results' },
        { value: '0', label: '0 - Normal' },
        { value: '1', label: '1 - ST-T abnormality' },
        { value: '2', label: '2 - Left ventricular hypertrophy' }
      ],
      exang: [
        { value: '', label: 'Select exercise induced angina' },
        { value: '0', label: '0 - No' },
        { value: '1', label: '1 - Yes' }
      ],
      slope: [
        { value: '', label: 'Select slope' },
        { value: '0', label: '0 - Upsloping' },
        { value: '1', label: '1 - Flat' },
        { value: '2', label: '2 - Downsloping' }
      ],
      ca: [
        { value: '', label: 'Select number of vessels' },
        { value: '0', label: '0 vessels' },
        { value: '1', label: '1 vessel' },
        { value: '2', label: '2 vessels' },
        { value: '3', label: '3 vessels' }
      ],
      thal: [
        { value: '', label: 'Select thalassemia' },
        { value: '0', label: '0 - Normal' },
        { value: '1', label: '1 - Fixed defect' },
        { value: '2', label: '2 - Reversible defect' }
      ]
    };
    return options[fieldName] || [];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Heart Disease Prediction
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Enter your medical information to get an instant heart disease risk assessment
            </p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How to use this form
              </button>
            </div>
          </div>

          {/* Help Modal */}
          {showHelp && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">How to Use This Form</h3>
                    <button
                      onClick={() => setShowHelp(false)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p>
                      This form requires specific medical data to provide an accurate heart disease risk assessment.
                      Please consult with your healthcare provider to obtain these measurements if you don't have them.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Important Notes:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>All fields are required for accurate prediction</li>
                        <li>Values should be current and accurate</li>
                        <li>This tool is for educational purposes only</li>
                        <li>Always consult with a healthcare professional for medical advice</li>
                      </ul>
                    </div>
                    <p>
                      If you're unsure about any values, use the most recent measurements from your medical records
                      or consult with your doctor before submitting.
                    </p>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowHelp(false)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Got it, continue to form
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result ? (
            <div className="space-y-8">
              <ResultCard result={result} onNewPrediction={handleNewPrediction} />
            </div>
          ) : (
            <>
              {/* Form Tabs */}
              <div className="mb-8">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                      onClick={() => setActiveSection('personal')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeSection === 'personal'
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Personal Info
                    </button>
                    <button
                      onClick={() => setActiveSection('medical')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeSection === 'medical'
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Medical Data
                    </button>
                    <button
                      onClick={() => setActiveSection('test')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeSection === 'test'
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Test Results
                    </button>
                  </nav>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                {activeSection === 'personal' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="space-y-6">
                      {/* Age */}
                      <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          min="20"
                          max="100"
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                          placeholder="Enter your age"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('age')}
                        </p>
                      </div>

                      {/* Sex */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Sex
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="sex"
                              value="0"
                              checked={formData.sex === '0'}
                              onChange={handleChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">Female</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="sex"
                              value="1"
                              checked={formData.sex === '1'}
                              onChange={handleChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">Male</span>
                          </label>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('sex')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Chest Pain Type */}
                      <div>
                        <label htmlFor="cp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Chest Pain Type
                        </label>
                        <select
                          id="cp"
                          name="cp"
                          value={formData.cp}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                        >
                          {getFieldOptions('cp').map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('cp')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Medical Data Section */}
                {activeSection === 'medical' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="space-y-6">
                      {/* Resting Blood Pressure */}
                      <div>
                        <label htmlFor="trestbps" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Resting Blood Pressure (mm Hg)
                        </label>
                        <input
                          type="number"
                          id="trestbps"
                          name="trestbps"
                          value={formData.trestbps}
                          onChange={handleChange}
                          min="90"
                          max="200"
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                          placeholder="Enter resting blood pressure"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('trestbps')}
                        </p>
                      </div>

                      {/* Serum Cholesterol */}
                      <div>
                        <label htmlFor="chol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Serum Cholesterol (mg/dl)
                        </label>
                        <input
                          type="number"
                          id="chol"
                          name="chol"
                          value={formData.chol}
                          onChange={handleChange}
                          min="100"
                          max="600"
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                          placeholder="Enter cholesterol level"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('chol')}
                        </p>
                      </div>

                      {/* Fasting Blood Sugar */}
                      <div>
                        <label htmlFor="fbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fasting Blood Sugar
                        </label>
                        <select
                          id="fbs"
                          name="fbs"
                          value={formData.fbs}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                        >
                          {getFieldOptions('fbs').map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('fbs')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Resting ECG Results */}
                      <div>
                        <label htmlFor="restecg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Resting ECG Results
                        </label>
                        <select
                          id="restecg"
                          name="restecg"
                          value={formData.restecg}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                        >
                          {getFieldOptions('restecg').map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('restecg')}
                        </p>
                      </div>

                      {/* Maximum Heart Rate */}
                      <div>
                        <label htmlFor="thalach" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Maximum Heart Rate Achieved
                        </label>
                        <input
                          type="number"
                          id="thalach"
                          name="thalach"
                          value={formData.thalach}
                          onChange={handleChange}
                          min="60"
                          max="220"
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                          placeholder="Enter maximum heart rate"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('thalach')}
                        </p>
                      </div>

                      {/* Exercise Induced Angina */}
                      <div>
                        <label htmlFor="exang" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Exercise Induced Angina
                        </label>
                        <select
                          id="exang"
                          name="exang"
                          value={formData.exang}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                        >
                          {getFieldOptions('exang').map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('exang')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Results Section */}
                {activeSection === 'test' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="space-y-6">
                      {/* ST Depression */}
                      <div>
                        <label htmlFor="oldpeak" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          ST Depression Induced by Exercise
                        </label>
                        <input
                          type="number"
                          id="oldpeak"
                          name="oldpeak"
                          value={formData.oldpeak}
                          onChange={handleChange}
                          min="0"
                          max="10"
                          step="0.1"
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                          placeholder="Enter ST depression value"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('oldpeak')}
                        </p>
                      </div>

                      {/* Slope of Peak Exercise */}
                      <div>
                        <label htmlFor="slope" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Slope of Peak Exercise ST Segment
                        </label>
                        <select
                          id="slope"
                          name="slope"
                          value={formData.slope}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                        >
                          {getFieldOptions('slope').map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('slope')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Major Vessels */}
                      <div>
                        <label htmlFor="ca" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Number of Major Vessels Colored
                        </label>
                        <select
                          id="ca"
                          name="ca"
                          value={formData.ca}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                        >
                          {getFieldOptions('ca').map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('ca')}
                        </p>
                      </div>

                      {/* Thalassemia */}
                      <div>
                        <label htmlFor="thal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Thalassemia
                        </label>
                        <select
                          id="thal"
                          name="thal"
                          value={formData.thal}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
                        >
                          {getFieldOptions('thal').map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {getHelperText('thal')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Navigation and Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-3">
                    {activeSection !== 'personal' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (activeSection === 'medical') setActiveSection('personal');
                          else if (activeSection === 'test') setActiveSection('medical');
                        }}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                      >
                        Previous
                      </button>
                    )}
                    
                    {activeSection !== 'test' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (activeSection === 'personal') setActiveSection('medical');
                          else if (activeSection === 'medical') setActiveSection('test');
                        }}
                        className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                      >
                        Next
                      </button>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                    >
                      Reset
                    </button>
                    
                    {activeSection === 'test' ? (
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Analyzing...' : 'Get Prediction'}
                      </button>
                    ) : null}
                  </div>
                </div>

                {loading && <LoadingSpinner />}
                {error && <ErrorMessage message={error} />}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;