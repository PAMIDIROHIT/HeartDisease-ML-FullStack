import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultCard from '../../components/ResultCard';

// Mock the FeatureImportance component
jest.mock('../../components/FeatureImportance', () => () => <div>Feature Importance Chart</div>);

describe('ResultCard Component', () => {
  const mockResult = {
    prediction: 1,
    probability: 0.87,
    risk_level: 'High',
    confidence: '87.0%',
    feature_importance: {
      age: 0.12,
      sex: 0.08,
      cp: 0.15
    },
    recommendations: [
      'Consult a cardiologist immediately',
      'Monitor blood pressure regularly'
    ]
  };

  const mockOnNewPrediction = jest.fn();

  test('renders heart disease detected result correctly', () => {
    render(<ResultCard result={mockResult} onNewPrediction={mockOnNewPrediction} />);
    
    // Check that heart disease detected message is shown
    expect(screen.getByText(/Heart Disease Detected/i)).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    
    // Check risk level
    expect(screen.getByText('High')).toBeInTheDocument();
    
    // Check confidence
    expect(screen.getByText('87.0%')).toBeInTheDocument();
    
    // Check recommendations
    expect(screen.getByText('Consult a cardiologist immediately')).toBeInTheDocument();
    expect(screen.getByText('Monitor blood pressure regularly')).toBeInTheDocument();
  });

  test('renders no heart disease detected result correctly', () => {
    const noDiseaseResult = {
      ...mockResult,
      prediction: 0,
      risk_level: 'Low',
      confidence: '13.0%'
    };
    
    render(<ResultCard result={noDiseaseResult} onNewPrediction={mockOnNewPrediction} />);
    
    // Check that no heart disease message is shown
    expect(screen.getByText(/No Heart Disease Detected/i)).toBeInTheDocument();
    expect(screen.getByText('❤️')).toBeInTheDocument();
    
    // Check risk level
    expect(screen.getByText('Low')).toBeInTheDocument();
    
    // Check confidence
    expect(screen.getByText('13.0%')).toBeInTheDocument();
  });

  test('renders feature importance section', () => {
    render(<ResultCard result={mockResult} onNewPrediction={mockOnNewPrediction} />);
    
    // Check that feature importance component is rendered
    expect(screen.getByText('Feature Importance Chart')).toBeInTheDocument();
  });
});