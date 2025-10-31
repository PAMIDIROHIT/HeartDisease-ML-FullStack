import React, { useState, useMemo } from 'react';
import { useAppContext } from '../App';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const Dashboard = () => {
  const { predictions, clearPredictions } = useAppContext();
  const [timeRange, setTimeRange] = useState('all'); // all, 7days, 30days
  const [viewMode, setViewMode] = useState('overview'); // overview, trends, comparison

  // Filter predictions based on time range
  const filteredPredictions = useMemo(() => {
    if (timeRange === 'all') return predictions;
    
    const now = new Date();
    const daysAgo = timeRange === '7days' ? 7 : 30;
    const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
    
    return predictions.filter(pred => new Date(pred.id) >= cutoffDate);
  }, [predictions, timeRange]);

  // Prepare data for charts
  const chartData = useMemo(() => {
    return filteredPredictions.map((pred, index) => ({
      name: `Prediction ${index + 1}`,
      date: new Date(pred.id).toLocaleDateString(),
      probability: pred.probability,
      riskLevel: pred.risk_level,
      age: pred.input_data?.age || 0,
      cholesterol: pred.input_data?.chol || 0
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredPredictions]);

  // Prepare data for comparison chart
  const comparisonData = useMemo(() => {
    if (filteredPredictions.length < 2) return [];
    
    return filteredPredictions
      .map((pred, index) => ({
        name: `Prediction ${index + 1}`,
        date: new Date(pred.id).toLocaleDateString(),
        probability: pred.probability,
        riskLevel: pred.risk_level,
        age: pred.input_data?.age || 0,
        cholesterol: pred.input_data?.chol || 0
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-5); // Last 5 predictions for comparison
  }, [filteredPredictions]);

  // Calculate statistics
  const totalPredictions = filteredPredictions.length;
  const highRiskCount = filteredPredictions.filter(pred => pred.risk_level === 'High').length;
  const mediumRiskCount = filteredPredictions.filter(pred => pred.risk_level === 'Medium').length;
  const lowRiskCount = filteredPredictions.filter(pred => pred.risk_level === 'Low').length;
  
  // Calculate average risk probability
  const avgRiskProbability = totalPredictions > 0 
    ? filteredPredictions.reduce((sum, pred) => sum + pred.probability, 0) / totalPredictions 
    : 0;

  // Risk distribution data
  const riskDistributionData = [
    { name: 'High Risk', value: highRiskCount, color: '#ef4444' },
    { name: 'Medium Risk', value: mediumRiskCount, color: '#f59e0b' },
    { name: 'Low Risk', value: lowRiskCount, color: '#22c55e' }
  ];

  // Get risk level color
  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  // Get risk level badge
  const getRiskLevelBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return '🔴 High';
      case 'Medium': return '🟡 Medium';
      case 'Low': return '🟢 Low';
      default: return riskLevel;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Prediction Dashboard
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            View your prediction history and track your heart health trends
          </p>
        </div>

        {totalPredictions === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">No predictions yet</h3>
            <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Get started by making your first heart disease prediction to track your heart health trends.
            </p>
            <div className="mt-8">
              <a
                href="/predict"
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
              >
                Make Your First Prediction
                <svg className="ml-2 -mr-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Predictions: {totalPredictions}
                </div>
                <button
                  onClick={clearPredictions}
                  className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition duration-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                >
                  Clear History
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
                
                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                  <button
                    onClick={() => setViewMode('overview')}
                    className={`px-4 py-2 text-sm font-medium ${
                      viewMode === 'overview'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setViewMode('trends')}
                    className={`px-4 py-2 text-sm font-medium border-l border-gray-300 dark:border-gray-600 ${
                      viewMode === 'trends'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Trends
                  </button>
                  <button
                    onClick={() => setViewMode('comparison')}
                    className={`px-4 py-2 text-sm font-medium border-l border-gray-300 dark:border-gray-600 ${
                      viewMode === 'comparison'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Comparison
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Predictions</div>
                    <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{totalPredictions}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-red-100 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-red-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">High Risk</div>
                    <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{highRiskCount}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-yellow-100 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Medium Risk</div>
                    <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{mediumRiskCount}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-green-100 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Risk</div>
                    <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{lowRiskCount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Risk Trend Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Risk Probability Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        domain={[0, 1]} 
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Probability']}
                        labelFormatter={(value) => `Prediction: ${value}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="probability" 
                        name="Risk Probability"
                        stroke="#3b82f6" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Distribution Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Risk Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Comparison Chart (only shown in comparison view) */}
            {viewMode === 'comparison' && comparisonData.length > 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Risk Comparison Over Time</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        domain={[0, 1]} 
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Probability']}
                        labelFormatter={(value) => `Prediction: ${value}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="probability" 
                        name="Risk Probability" 
                        fill="#3b82f6" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                  Comparison of your risk probabilities across your last {comparisonData.length} predictions
                </p>
              </div>
            )}

            {/* Detailed Analytics Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detailed Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-5">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Average Risk Probability</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {(avgRiskProbability * 100).toFixed(1)}%
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${avgRiskProbability * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-5">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Risk Improvement</div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {chartData.length > 1 
                      ? `${((chartData[0].probability - chartData[chartData.length - 1].probability) * 100).toFixed(1)}%` 
                      : 'N/A'}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {chartData.length > 1 
                      ? chartData[0].probability > chartData[chartData.length - 1].probability
                        ? '📉 Improvement'
                        : '📈 Increase'
                      : 'Need more data'}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-5">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Prediction Consistency</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {totalPredictions > 0 
                      ? `${Math.round((lowRiskCount / totalPredictions) * 100)}%` 
                      : '0%'}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Low risk predictions
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Predictions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Predictions</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {Math.min(5, filteredPredictions.length)} of {filteredPredictions.length} predictions
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Risk Level</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Probability</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Age</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cholesterol</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPredictions.slice(0, 5).map((prediction, index) => (
                      <tr key={prediction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(prediction.id).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(prediction.risk_level)}`}>
                            {getRiskLevelBadge(prediction.risk_level)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {(prediction.probability * 100).toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {prediction.input_data?.age || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {prediction.input_data?.chol || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;