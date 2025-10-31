import React, { useState } from 'react';
import { useAppContext } from '../App';
import FeatureImportance from './FeatureImportance';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const ResultCard = ({ result, onNewPrediction }) => {
  const { addPrediction } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Save prediction to history only once when component mounts with result
  const hasSaved = React.useRef(false);
  
  React.useEffect(() => {
    if (result && !hasSaved.current) {
      addPrediction(result);
      hasSaved.current = true;
    }
  }, [result, addPrediction]);

  // Generate PDF-style report
  const generatePDFReport = () => {
    const reportWindow = window.open('', '_blank');
    const reportDate = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Heart Disease Prediction Report</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
          }
          
          .report-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
          }
          
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
            margin-bottom: 30px;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
          }
          
          .hospital-info h1 {
            color: #1e40af;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .hospital-info p {
            color: #64748b;
            font-size: 12px;
          }
          
          .report-meta {
            text-align: right;
            font-size: 12px;
            color: #64748b;
          }
          
          .report-title {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 8px;
          }
          
          .report-title h2 {
            color: #1e40af;
            font-size: 28px;
            margin-bottom: 10px;
          }
          
          .report-title p {
            color: #64748b;
            font-size: 14px;
          }
          
          .section {
            margin: 25px 0;
            page-break-inside: avoid;
          }
          
          .section-title {
            background: #1e40af;
            color: white;
            padding: 10px 15px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
            margin-bottom: 15px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 15px;
          }
          
          .info-item {
            padding: 12px;
            background: #f8fafc;
            border-left: 3px solid #3b82f6;
            border-radius: 4px;
          }
          
          .info-label {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          
          .info-value {
            font-size: 15px;
            color: #1e293b;
            font-weight: 600;
          }
          
          .result-box {
            padding: 25px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          
          .result-positive {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            border: 2px solid #ef4444;
          }
          
          .result-negative {
            background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
            border: 2px solid #22c55e;
          }
          
          .result-icon {
            font-size: 50px;
            margin-bottom: 10px;
          }
          
          .result-text {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .result-positive .result-text {
            color: #dc2626;
          }
          
          .result-negative .result-text {
            color: #16a34a;
          }
          
          .result-desc {
            font-size: 14px;
            color: #64748b;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
          }
          
          .stat-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e2e8f0;
          }
          
          .stat-label {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 8px;
          }
          
          .stat-value {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
          }
          
          .test-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          
          .test-table th {
            background: #1e40af;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 13px;
          }
          
          .test-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
          }
          
          .test-table tr:nth-child(even) {
            background: #f8fafc;
          }
          
          .recommendations-list {
            list-style: none;
            padding: 0;
          }
          
          .recommendations-list li {
            padding: 12px;
            margin-bottom: 10px;
            background: #f0fdf4;
            border-left: 4px solid #22c55e;
            border-radius: 4px;
            font-size: 13px;
          }
          
          .recommendations-list li:before {
            content: "✓";
            color: #22c55e;
            font-weight: bold;
            margin-right: 10px;
          }
          
          .feature-importance-list {
            list-style: none;
            padding: 0;
          }
          
          .feature-importance-list li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin-bottom: 8px;
            background: #f8fafc;
            border-radius: 4px;
            font-size: 13px;
          }
          
          .feature-bar {
            height: 8px;
            background: #3b82f6;
            border-radius: 4px;
            margin-top: 5px;
          }
          
          .disclaimer {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
          }
          
          .disclaimer h3 {
            color: #92400e;
            margin-bottom: 10px;
            font-size: 16px;
          }
          
          .disclaimer p {
            color: #78350f;
            font-size: 13px;
            line-height: 1.6;
          }
          
          .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          
          .signature-box {
            text-align: center;
          }
          
          .signature-line {
            width: 200px;
            border-top: 2px solid #333;
            margin: 40px auto 10px;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            font-size: 11px;
            color: #64748b;
          }
          
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            
            .report-container {
              padding: 10mm;
            }
            
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-section">
              <div class="logo">
                ❤️
              </div>
              <div class="hospital-info">
                <h1>CardioHealth Medical Center</h1>
                <p>Advanced Cardiac Care & Diagnostics</p>
                <p>📞 +1 (555) 123-4567 | 📧 info@cardiohealth.com</p>
              </div>
            </div>
            <div class="report-meta">
              <p><strong>Report ID:</strong> CHD-${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p><strong>Generated:</strong> ${reportDate}</p>
              <p><strong>Status:</strong> Confidential</p>
            </div>
          </div>
          
          <!-- Report Title -->
          <div class="report-title">
            <h2>Heart Disease Risk Assessment Report</h2>
            <p>Comprehensive Cardiovascular Health Analysis</p>
          </div>
          
          <!-- Patient Information -->
          <div class="section">
            <div class="section-title">Patient Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Patient ID</div>
                <div class="info-value">PT-${Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Report Date</div>
                <div class="info-value">${new Date().toLocaleDateString('en-US')}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Age</div>
                <div class="info-value">${result.input_data.age} years</div>
              </div>
              <div class="info-item">
                <div class="info-label">Gender</div>
                <div class="info-value">${result.input_data.sex === 1 ? 'Male' : 'Female'}</div>
              </div>
            </div>
          </div>
          
          <!-- Prediction Result -->
          <div class="section">
            <div class="section-title">Diagnosis Summary</div>
            <div class="result-box ${result.prediction === 1 ? 'result-positive' : 'result-negative'}">
              <div class="result-icon">${result.prediction === 1 ? '⚠️' : '✅'}</div>
              <div class="result-text">
                ${result.prediction === 1 ? 'Heart Disease Risk Detected' : 'No Significant Heart Disease Risk'}
              </div>
              <div class="result-desc">
                ${result.prediction === 1 
                  ? 'Based on the analysis, there are indicators of potential cardiovascular risk.' 
                  : 'Based on the analysis, no significant cardiovascular risk indicators detected.'}
              </div>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Risk Level</div>
                <div class="stat-value" style="color: ${result.risk_level === 'High' ? '#dc2626' : result.risk_level === 'Medium' ? '#f59e0b' : '#22c55e'}">
                  ${result.risk_level}
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Risk Probability</div>
                <div class="stat-value">${Math.round(result.probability * 100)}%</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Confidence Level</div>
                <div class="stat-value">${result.confidence}</div>
              </div>
            </div>
          </div>
          
          <!-- Clinical Parameters -->
          <div class="section">
            <div class="section-title">Clinical Test Parameters</div>
            <table class="test-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Age</td>
                  <td>${result.input_data.age}</td>
                  <td>years</td>
                  <td>${result.input_data.age > 50 ? '⚠️ Monitor' : '✓ Normal'}</td>
                </tr>
                <tr>
                  <td>Resting Blood Pressure</td>
                  <td>${result.input_data.trestbps}</td>
                  <td>mm Hg</td>
                  <td>${result.input_data.trestbps > 140 ? '⚠️ High' : '✓ Normal'}</td>
                </tr>
                <tr>
                  <td>Serum Cholesterol</td>
                  <td>${result.input_data.chol}</td>
                  <td>mg/dl</td>
                  <td>${result.input_data.chol > 240 ? '⚠️ High' : result.input_data.chol > 200 ? '⚠️ Borderline' : '✓ Normal'}</td>
                </tr>
                <tr>
                  <td>Fasting Blood Sugar</td>
                  <td>${result.input_data.fbs === 1 ? '> 120' : '< 120'}</td>
                  <td>mg/dl</td>
                  <td>${result.input_data.fbs === 1 ? '⚠️ High' : '✓ Normal'}</td>
                </tr>
                <tr>
                  <td>Maximum Heart Rate</td>
                  <td>${result.input_data.thalach}</td>
                  <td>bpm</td>
                  <td>${result.input_data.thalach < 100 ? '⚠️ Low' : '✓ Normal'}</td>
                </tr>
                <tr>
                  <td>Exercise Induced Angina</td>
                  <td>${result.input_data.exang === 1 ? 'Yes' : 'No'}</td>
                  <td>-</td>
                  <td>${result.input_data.exang === 1 ? '⚠️ Positive' : '✓ Negative'}</td>
                </tr>
                <tr>
                  <td>ST Depression</td>
                  <td>${result.input_data.oldpeak}</td>
                  <td>mm</td>
                  <td>${result.input_data.oldpeak > 2 ? '⚠️ Significant' : '✓ Normal'}</td>
                </tr>
                <tr>
                  <td>Chest Pain Type</td>
                  <td>${result.input_data.cp}</td>
                  <td>type</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Feature Importance -->
          <div class="section">
            <div class="section-title">Key Risk Factors Analysis</div>
            <ul class="feature-importance-list">
              ${Object.entries(result.feature_importance)
                .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                .slice(0, 6)
                .map(([feature, importance]) => `
                  <li>
                    <div>
                      <strong>${feature}</strong>
                      <div class="feature-bar" style="width: ${Math.abs(importance) * 100}%; background: ${importance > 0 ? '#3b82f6' : '#ef4444'}"></div>
                    </div>
                    <span>${(importance * 100).toFixed(1)}%</span>
                  </li>
                `).join('')}
            </ul>
          </div>
          
          <!-- Recommendations -->
          <div class="section">
            <div class="section-title">Medical Recommendations & Precautions</div>
            <ul class="recommendations-list">
              ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
              ${result.prediction === 1 ? `
                <li>Schedule an appointment with a cardiologist for comprehensive evaluation</li>
                <li>Consider stress test and echocardiogram if recommended by physician</li>
                <li>Monitor blood pressure and heart rate regularly</li>
              ` : `
                <li>Maintain current healthy lifestyle practices</li>
                <li>Schedule annual cardiovascular health checkups</li>
              `}
              ${result.input_data.chol > 240 ? '<li>Work with healthcare provider to manage cholesterol levels through diet and/or medication</li>' : ''}
              ${result.input_data.trestbps > 140 ? '<li>Monitor and manage blood pressure - consider lifestyle modifications and medical consultation</li>' : ''}
              ${result.input_data.age > 60 ? '<li>Regular cardiac monitoring recommended due to age-related risk factors</li>' : ''}
            </ul>
          </div>
          
          <!-- Disclaimer -->
          <div class="disclaimer">
            <h3>⚠️ Important Medical Disclaimer</h3>
            <p>
              This report is generated by an AI-powered predictive model for screening purposes only. 
              It is NOT a substitute for professional medical diagnosis, advice, or treatment. 
              All medical decisions should be made in consultation with qualified healthcare providers. 
              The predictions are based on statistical patterns and may not account for individual medical history, 
              genetic factors, or other relevant clinical information. Always seek the advice of your physician 
              or other qualified health provider with any questions regarding a medical condition.
            </p>
            <p style="margin-top: 10px;">
              <strong>For Medical Emergencies:</strong> If you experience chest pain, shortness of breath, 
              or other cardiac symptoms, seek immediate medical attention or call emergency services.
            </p>
          </div>
          
          <!-- Signature Section -->
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <p><strong>Authorized Medical Officer</strong></p>
              <p style="font-size: 11px; color: #64748b;">Digital Report - No Signature Required</p>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <p><strong>Date of Issue</strong></p>
              <p style="font-size: 11px; color: #64748b;">${new Date().toLocaleDateString('en-US')}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p><strong>CardioHealth Medical Center</strong> | Advanced Cardiac Care & Diagnostics</p>
            <p>123 Medical Plaza, Healthcare District, City, State 12345</p>
            <p>This is a computer-generated report. For questions, contact: support@cardiohealth.com</p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} CardioHealth Medical Center. All rights reserved. | Report ID: CHD-${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
          
          <!-- Print Button (hidden when printing) -->
          <div style="text-align: center; margin-top: 30px;" class="no-print">
            <button onclick="window.print()" style="
              background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
              color: white;
              padding: 15px 40px;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ">
              🖨️ Print Report
            </button>
            <button onclick="window.close()" style="
              background: #64748b;
              color: white;
              padding: 15px 40px;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              margin-left: 15px;
            ">
              ✕ Close
            </button>
          </div>
        </div>
      </body>
      </html>
    `;
    
    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
  };

  // Determine icon and color based on prediction
  const getPredictionInfo = () => {
    if (result.prediction === 1) {
      return {
        icon: '⚠️',
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        gradient: 'from-red-500 to-orange-500',
        text: 'Heart Disease Detected',
        description: 'Based on the provided information, there is a risk of heart disease.',
        action: 'Immediate medical consultation recommended'
      };
    } else {
      return {
        icon: '✅',
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        gradient: 'from-green-500 to-teal-500',
        text: 'No Heart Disease Detected',
        description: 'Based on the provided information, there is no significant risk of heart disease.',
        action: 'Continue maintaining healthy lifestyle'
      };
    }
  };

  const predictionInfo = getPredictionInfo();

  // Get risk level color
  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'; 
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'; 
    }
  };

  // Prepare data for charts
  const probabilityData = [
    { name: 'Risk', value: result.probability * 100 },
    { name: 'Safety', value: 100 - (result.probability * 100) }
  ];

  const COLORS = ['#ef4444', '#22c55e'];

  // Prepare feature importance data for bar chart
  const featureImportanceData = Object.entries(result.feature_importance)
    .map(([feature, importance]) => ({
      name: feature,
      value: importance
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Prepare data for radar chart (top 6 features)
  const radarData = Object.entries(result.feature_importance)
    .map(([feature, importance]) => ({
      subject: feature,
      A: Math.abs(importance) * 100,
      fullMark: 100
    }))
    .sort((a, b) => b.A - a.A)
    .slice(0, 6);

  // Get personalized recommendations based on risk factors
  const getPersonalizedRecommendations = () => {
    const recommendations = [...result.recommendations];
    
    // Add specific recommendations based on high-risk features
    const highImpactFeatures = Object.entries(result.feature_importance)
      .filter(([, importance]) => Math.abs(importance) > 0.1)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, 3);
    
    if (highImpactFeatures.length > 0) {
      recommendations.push(`Focus on managing ${highImpactFeatures[0][0]} as it's a significant risk factor`);
    }
    
    if (result.input_data?.age > 50) {
      recommendations.push('Consider regular cardiac screenings due to age factor');
    }
    
    if (result.input_data?.chol > 240) {
      recommendations.push('Work with your doctor to manage high cholesterol levels');
    }
    
    return recommendations;
  };

  const personalizedRecommendations = getPersonalizedRecommendations();

  return (
    <div className="space-y-8">
      {/* Main Result Card with Gradient Header */}
      <div className="rounded-2xl shadow-xl overflow-hidden">
        <div className={`bg-gradient-to-r ${predictionInfo.gradient} p-6 text-white`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="text-5xl">
                {predictionInfo.icon}
              </div>
              <div className="ml-4">
                <h2 className="text-3xl font-bold">
                  {predictionInfo.text}
                </h2>
                <p className="text-blue-100 mt-1">
                  {predictionInfo.description}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-white/20 backdrop-blur-sm`}>
                {Math.round(result.probability * 100)}% Risk Probability
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6">
          {/* Result Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analysis'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Detailed Analysis
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recommendations'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Recommendations
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'data'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Your Data
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Risk Level</div>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getRiskLevelColor(result.risk_level)}`}>
                  {result.risk_level} Risk
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  Based on your medical data analysis
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Confidence</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {result.confidence}
                </div>
                <div className="mt-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${result.probability * 100}%` }}
                  ></div>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  Model confidence in this prediction
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Risk Visualization</div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={probabilityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {probabilityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
                  Risk vs Safety Probability
                </p>
              </div>
            </div>
          )}

          {/* Detailed Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="space-y-8">
              {/* Feature Importance with Enhanced Visualization */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Feature Importance Analysis
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Top contributing factors
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <FeatureImportance featureImportance={result.feature_importance} />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Factors Visualization</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={featureImportanceData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[-1, 1]} />
                          <YAxis type="category" dataKey="name" width={80} />
                          <Tooltip 
                            formatter={(value) => [value.toFixed(3), 'Importance']}
                            labelFormatter={(value) => `Feature: ${value}`}
                          />
                          <Bar dataKey="value" fill="#3b82f6">
                            {featureImportanceData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.value > 0 ? '#3b82f6' : '#ef4444'} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart for Feature Comparison */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Feature Impact Radar
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Feature Impact"
                        dataKey="A"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Impact']} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                  Visualization of the relative impact of top risk factors
                </p>
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Personalized Recommendations
                </h3>
                <button
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {showRecommendations ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              {showRecommendations ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Immediate Actions</h4>
                    <ul className="space-y-3">
                      {personalizedRecommendations.slice(0, Math.ceil(personalizedRecommendations.length / 2)).map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-0.5">
                            <svg className="h-4 w-4 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="ml-3 text-gray-700 dark:text-gray-300">{rec}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Long-term Health</h4>
                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-5 h-full">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h5 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Health Boost</h5>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {predictionInfo.action}. Regular checkups and maintaining a healthy lifestyle are key to heart health.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Exercise
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          Diet
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                          Sleep
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Recommendations are hidden. Click "Show Details" to view personalized health recommendations based on your risk assessment.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Your Data Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Entered Data
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(result.input_data).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  This is the data you entered for the heart disease prediction. You can review this information to ensure accuracy.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Risk Trend Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Risk Trend Analysis
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { name: 'Baseline', risk: 30 },
                { name: 'Your Profile', risk: Math.round(result.probability * 100) },
                { name: 'Optimal', risk: 10 }
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Risk']}
                labelFormatter={(value) => `Category: ${value}`}
              />
              <Line 
                type="monotone" 
                dataKey="risk" 
                stroke="#3b82f6" 
                activeDot={{ r: 8 }} 
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
          Comparison of your risk level with baseline and optimal health profiles
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">Important Disclaimer</h3>
            <div className="mt-2 text-yellow-700 dark:text-yellow-300">
              <p>
                This prediction is based on a machine learning model and should not be used as a substitute for professional medical advice.
                Always consult with a qualified healthcare provider for accurate diagnosis and treatment recommendations.
              </p>
              <p className="mt-2 font-medium">
                This tool is designed for educational and informational purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={onNewPrediction}
          className="px-8 py-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
        >
          Make Another Prediction
        </button>
        <div className="flex gap-4">
          <button
            onClick={generatePDFReport}
            className="px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          >
            📄 Generate Report
          </button>
          <button
            onClick={() => {
              const dataStr = JSON.stringify(result, null, 2);
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
              const exportFileDefaultName = 'heart_disease_prediction.json';
              const linkElement = document.createElement('a');
              linkElement.setAttribute('href', dataUri);
              linkElement.setAttribute('download', exportFileDefaultName);
              linkElement.click();
            }}
            className="px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          >
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;