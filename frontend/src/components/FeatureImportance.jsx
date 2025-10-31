import React from 'react';

const FeatureImportance = ({ featureImportance }) => {
  // Convert feature importance object to sorted array
  const sortedFeatures = Object.entries(featureImportance)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 features

  // Find max importance for scaling
  const maxImportance = Math.max(...sortedFeatures.map(([, importance]) => importance));

  // Get color based on importance value
  const getColor = (importance) => {
    const intensity = Math.abs(importance) / maxImportance;
    if (importance > 0) {
      // Positive importance - blue scale
      const blueValue = Math.floor(100 + intensity * 155);
      return `rgb(59, ${Math.floor(130 * (1 - intensity) + 180 * intensity)}, ${blueValue})`;
    } else {
      // Negative importance - red scale
      const redValue = Math.floor(100 + intensity * 155);
      return `rgb(${redValue}, ${Math.floor(68 * (1 - intensity) + 100 * intensity)}, 68)`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {sortedFeatures.map(([feature, importance], index) => (
          <div key={feature} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 w-8">
                  {index + 1}.
                </span>
                <span className="text-sm font-medium text-gray-700 truncate">
                  {feature}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {importance.toFixed(3)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 transition-all duration-300 group-hover:h-3">
              <div
                className="h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.abs(importance) / maxImportance * 100}%`,
                  backgroundColor: getColor(importance),
                  marginLeft: importance < 0 ? `${(1 - Math.abs(importance) / maxImportance) * 100}%` : '0'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-gray-600">Positive Impact</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Negative Impact</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Features with higher absolute values have greater influence on the prediction
        </p>
      </div>
    </div>
  );
};

export default FeatureImportance;