import React, { useState } from 'react';
import { useAppContext } from '../App';

const HealthTips = () => {
  const { darkMode } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('all');

  // Health tips data organized by category
  const healthTips = [
    {
      id: 1,
      category: 'diet',
      title: 'Heart-Healthy Diet',
      description: 'Focus on eating plenty of fruits, vegetables, and whole grains. Limit saturated fats, trans fats, cholesterol, sodium, and added sugars.',
      tips: [
        'Eat fish at least twice a week, especially fatty fish like salmon and mackerel',
        'Choose lean meats and poultry',
        'Use healthy oils like olive oil and canola oil',
        'Limit processed and fast foods',
        'Reduce sodium intake to less than 2,300mg per day'
      ],
      icon: '🥗'
    },
    {
      id: 2,
      category: 'exercise',
      title: 'Regular Physical Activity',
      description: 'Regular exercise helps strengthen your heart muscle, lower blood pressure, and reduce stress.',
      tips: [
        'Aim for at least 150 minutes of moderate-intensity aerobic activity per week',
        'Include muscle-strengthening activities at least 2 days per week',
        'Take the stairs instead of the elevator',
        'Walk or bike to work if possible',
        'Find activities you enjoy to stay motivated'
      ],
      icon: '🏃'
    },
    {
      id: 3,
      category: 'lifestyle',
      title: 'Healthy Lifestyle Choices',
      description: 'Making positive lifestyle changes can significantly reduce your risk of heart disease.',
      tips: [
        'Quit smoking and avoid secondhand smoke',
        'Limit alcohol consumption to moderate levels',
        'Get 7-9 hours of quality sleep each night',
        'Manage stress through meditation, yoga, or deep breathing',
        'Maintain a healthy weight'
      ],
      icon: '🧘'
    },
    {
      id: 4,
      category: 'monitoring',
      title: 'Regular Health Monitoring',
      description: 'Keep track of key health indicators to catch potential issues early.',
      tips: [
        'Check your blood pressure regularly',
        'Monitor your cholesterol levels',
        'Keep track of your weight and BMI',
        'Schedule regular check-ups with your doctor',
        'Know your family health history'
      ],
      icon: '🩺'
    },
    {
      id: 5,
      category: 'mental',
      title: 'Mental Health & Stress Management',
      description: 'Chronic stress can damage your arteries and worsen other risk factors for heart disease.',
      tips: [
        'Practice mindfulness or meditation daily',
        'Engage in hobbies you enjoy',
        'Maintain strong social connections',
        'Seek professional help if you experience depression or anxiety',
        'Take breaks and practice relaxation techniques'
      ],
      icon: '🧠'
    },
    {
      id: 6,
      category: 'sleep',
      title: 'Quality Sleep',
      description: 'Poor sleep is linked to higher risks of heart disease, high blood pressure, and stroke.',
      tips: [
        'Aim for 7-9 hours of sleep each night',
        'Keep a consistent sleep schedule',
        'Create a relaxing bedtime routine',
        'Keep your bedroom cool, dark, and quiet',
        'Avoid screens at least an hour before bedtime'
      ],
      icon: '😴'
    }
  ];

  // Filter tips based on active category
  const filteredTips = activeCategory === 'all' 
    ? healthTips 
    : healthTips.filter(tip => tip.category === activeCategory);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Tips', icon: '🌟' },
    { id: 'diet', name: 'Diet', icon: '🥗' },
    { id: 'exercise', name: 'Exercise', icon: '🏃' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🧘' },
    { id: 'monitoring', name: 'Monitoring', icon: '🩺' },
    { id: 'mental', name: 'Mental Health', icon: '🧠' },
    { id: 'sleep', name: 'Sleep', icon: '😴' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Heart Health Tips & Resources
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Expert advice to help you maintain a healthy heart and reduce your risk of heart disease
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTips.map((tip) => (
            <div 
              key={tip.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className={`p-6 border-b-4 ${
                tip.category === 'diet' ? 'border-green-500' :
                tip.category === 'exercise' ? 'border-blue-500' :
                tip.category === 'lifestyle' ? 'border-purple-500' :
                tip.category === 'monitoring' ? 'border-red-500' :
                tip.category === 'mental' ? 'border-yellow-500' :
                'border-teal-500'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{tip.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tip.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{tip.description}</p>
                <ul className="space-y-2">
                  {tip.tips.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    tip.category === 'diet' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                    tip.category === 'exercise' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                    tip.category === 'lifestyle' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' :
                    tip.category === 'monitoring' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
                    tip.category === 'mental' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                    'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100'
                  }`}>
                    {categories.find(cat => cat.id === tip.category)?.name}
                  </span>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                    Save Tip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Personalized Recommendations Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Personalized Recommendations
            </h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              Based on your prediction history, here are tailored suggestions for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-bold text-gray-900 dark:text-white">Consistency</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Based on your history, maintaining consistent healthy habits is key to reducing your risk.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-bold text-gray-900 dark:text-white">Progress Tracking</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Regular monitoring of your health metrics helps track improvements over time.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-bold text-gray-900 dark:text-white">Support System</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Engage with family or friends to maintain motivation and accountability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTips;