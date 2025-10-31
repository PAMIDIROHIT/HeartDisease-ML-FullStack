import React, { useState, createContext, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import HealthTips from './pages/HealthTips';
import NotFound from './pages/NotFound';
import './styles/index.css';

// Create context for global state
const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

function App() {
  const [predictions, setPredictions] = useState([]);

  // Add a new prediction to history with unique ID
  const addPrediction = (prediction) => {
    setPredictions(prev => {
      const newPrediction = { 
        ...prediction, 
        id: Date.now(), // Use timestamp as unique ID
        timestamp: new Date().toISOString()
      };
      return [newPrediction, ...prev]; // Add to beginning for proper sorting
    });
  };

  // Clear prediction history
  const clearPredictions = () => {
    setPredictions([]);
  };

  const contextValue = {
    predictions,
    addPrediction,
    clearPredictions
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/health-tips" element={<HealthTips />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppContext.Provider>
  );
}

export default App;