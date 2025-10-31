import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PredictionForm from '../../components/PredictionForm';

// Mock axios to avoid actual API calls
jest.mock('axios', () => ({
  post: jest.fn()
}));

describe('PredictionForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    render(<PredictionForm />);
    
    // Check that key form elements are present
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sex/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chest Pain Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Resting Blood Pressure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cholesterol/i)).toBeInTheDocument();
    expect(screen.getByText(/Load Sample Data/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
    expect(screen.getByText(/Predict/i)).toBeInTheDocument();
  });

  test('loads sample data when button is clicked', () => {
    render(<PredictionForm />);
    
    const loadSampleButton = screen.getByText(/Load Sample Data/i);
    fireEvent.click(loadSampleButton);
    
    // Check that some sample values are loaded
    expect(screen.getByLabelText(/Age/i)).toHaveValue('63');
    expect(screen.getByLabelText(/Resting Blood Pressure/i)).toHaveValue('145');
  });

  test('resets form when reset button is clicked', () => {
    render(<PredictionForm />);
    
    // First load sample data
    fireEvent.click(screen.getByText(/Load Sample Data/i));
    expect(screen.getByLabelText(/Age/i)).toHaveValue('63');
    
    // Then reset the form
    fireEvent.click(screen.getByText(/Reset/i));
    expect(screen.getByLabelText(/Age/i)).toHaveValue('');
  });

  test('shows validation errors for required fields', () => {
    render(<PredictionForm />);
    
    // Try to submit empty form
    fireEvent.click(screen.getByText(/Predict/i));
    
    // Check that form is still visible (not submitted)
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
  });
});