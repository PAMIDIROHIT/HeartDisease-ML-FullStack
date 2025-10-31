import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Stats for the animated counter
  const [stats, setStats] = useState({
    accuracy: 0,
    users: 0,
    predictions: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        accuracy: 90,
        users: 10000,
        predictions: 50000
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      content: 'This system helped me identify potential heart issues early. The predictions were incredibly accurate and the recommendations were spot on.',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Patient',
      content: 'As someone with a family history of heart disease, this tool gives me peace of mind and helps me monitor my risk factors effectively.',
      rating: 5
    },
    {
      id: 3,
      name: 'Dr. Robert Williams',
      role: 'Medical Researcher',
      content: 'The feature importance visualization helped me understand which factors were most critical for my heart health. Extremely valuable insights!',
      rating: 5
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section with Animation */}
      <div className={`text-center py-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="inline-block bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-full mb-6 animate-pulse">
          <span className="font-medium">AI-Powered Healthcare</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 mb-6">
          <span className="block">AI-Powered</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mt-2">
            Heart Disease Prediction
          </span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
          Get instant risk assessment using advanced machine learning to help detect heart disease early and save lives
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/predict"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Start Prediction
            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link
            to="/health-tips"
            className="inline-flex items-center px-8 py-4 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            Health Tips
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-blue-500">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {stats.accuracy}%
          </div>
          <div className="text-lg font-medium text-gray-900">
            Model Accuracy
          </div>
          <div className="mt-2 text-gray-500">
            Industry-leading precision
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-teal-500">
          <div className="text-4xl font-bold text-teal-600 mb-2">
            {stats.users.toLocaleString()}+
          </div>
          <div className="text-lg font-medium text-gray-900">
            Happy Users
          </div>
          <div className="mt-2 text-gray-500">
            Trust our system worldwide
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-purple-500">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {stats.predictions.toLocaleString()}+
          </div>
          <div className="text-lg font-medium text-gray-900">
            Predictions Made
          </div>
          <div className="mt-2 text-gray-500">
            Early detections saved
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Why Choose Our System?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Advanced technology meets medical expertise for the best heart health assessment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-500">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">90%+ Accuracy</h3>
            <p className="text-gray-600">
              Our machine learning model achieves over 90% accuracy in detecting heart disease risk using advanced algorithms
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-green-500">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mx-auto mb-4">
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Results</h3>
            <p className="text-gray-600">
              Get your heart disease risk assessment in seconds with our fast processing and real-time analysis
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-purple-500">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mx-auto mb-4">
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your health data is processed securely and never stored on our servers. Privacy is our top priority
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-teal-500">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 mx-auto mb-4">
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered</h3>
            <p className="text-gray-600">
              Advanced machine learning algorithms analyze your data for accurate predictions and personalized recommendations
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Get your heart disease risk assessment in three simple steps
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enter Health Data</h3>
              <p className="text-gray-600">
                Provide your medical information including age, blood pressure, cholesterol levels, and more in our easy-to-use form
              </p>
            </div>

            <div className="text-center group">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-teal-100 text-teal-600 mx-auto mb-6 group-hover:bg-teal-200 transition-colors duration-300">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Analyzes Patterns</h3>
              <p className="text-gray-600">
                Our machine learning model analyzes your data to identify patterns associated with heart disease using advanced algorithms
              </p>
            </div>

            <div className="text-center group">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-purple-100 text-purple-600 mx-auto mb-6 group-hover:bg-purple-200 transition-colors duration-300">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Instant Prediction</h3>
              <p className="text-gray-600">
                Receive your personalized risk assessment, feature importance analysis, and health recommendations within seconds
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials with Auto-Rotation */}
      <div className="mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            What Our Users Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Hear from people who have benefited from our heart disease prediction system
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-lg mb-8">
              "{testimonials[activeTestimonial].content}"
            </p>
            <div className="flex items-center">
              <div className="ml-4">
                <div className="font-bold text-gray-900 text-lg">{testimonials[activeTestimonial].name}</div>
                <div className="text-gray-500">{testimonials[activeTestimonial].role}</div>
              </div>
            </div>
          </div>
          
          {/* Testimonial Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`h-3 w-3 rounded-full ${
                  index === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-16 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Check Your Heart Health?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100 mb-10">
            Join thousands of users who have already taken control of their heart health with our AI-powered system
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/predict"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-lg text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 transform hover:scale-105"
            >
              Try It Now - It's Free
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 border border-white text-base font-medium rounded-lg shadow-lg text-white bg-transparent hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 transform hover:scale-105"
            >
              View Sample Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;