import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            About Heart Disease Prediction System
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Leveraging machine learning to help detect heart disease risk early
          </p>
        </div>

        <div className="mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Heart disease is the leading cause of death globally, claiming about 17.9 million lives each year. 
                  Early detection and intervention can significantly improve outcomes and save lives. Our mission is to 
                  make heart disease risk assessment accessible to everyone through advanced machine learning technology.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">How It Works</h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Our system uses a machine learning model trained on the UCI Heart Disease dataset, which contains 
                  medical information from over 1,000 patients. The model analyzes 13 key medical indicators to 
                  predict the likelihood of heart disease with high accuracy.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">The Technology</h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  We employ a Random Forest classifier, which is an ensemble learning method that combines multiple 
                  decision trees to make predictions. This approach provides robust performance and handles complex 
                  interactions between medical features effectively.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">Medical Features Analyzed</h2>
                <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Age and sex</li>
                  <li>• Chest pain type</li>
                  <li>• Resting blood pressure</li>
                  <li>• Serum cholesterol</li>
                  <li>• Fasting blood sugar</li>
                  <li>• Resting electrocardiographic results</li>
                  <li>• Maximum heart rate achieved</li>
                  <li>• Exercise induced angina</li>
                  <li>• ST depression induced by exercise</li>
                  <li>• Slope of the peak exercise ST segment</li>
                  <li>• Number of major vessels colored by fluoroscopy</li>
                  <li>• Thalassemia</li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">Important Disclaimer</h2>
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-300">
                    This prediction system is intended for educational and informational purposes only. 
                    It is not a substitute for professional medical advice, diagnosis, or treatment. 
                    Always seek the advice of your physician or other qualified health provider with any 
                    questions you may have regarding a medical condition. Never disregard professional 
                    medical advice or delay in seeking it because of something you have read on this website.
                  </p>
                </div>

                <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">The Team</h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Our team consists of data scientists, machine learning engineers, and healthcare professionals 
                  committed to using technology to improve healthcare outcomes. We continuously work to improve 
                  the accuracy and reliability of our predictions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Ready to Take Control of Your Heart Health?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
              Join thousands of users who have already taken steps toward better heart health
            </p>
            <div className="mt-10">
              <a
                href="/predict"
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 transform hover:scale-105"
              >
                Get Started Now
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;