import React from 'react';
import PredictionForm from '../components/PredictionForm';

const Predict = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Heart Disease Prediction
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Enter your medical information to get a personalized heart disease risk assessment
          </p>
        </div>
        <PredictionForm />
      </div>
    </div>
  );
};

export default Predict;