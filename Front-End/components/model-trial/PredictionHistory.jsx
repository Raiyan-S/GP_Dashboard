import React from 'react';

export default function PredictionHistory({ predictions, selectedId, onSelect }) {
  if (predictions.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No analyses performed yet. Upload an image to get started.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {predictions.map((prediction) => (
        <button
          key={`prediction-${prediction.id}`}
          onClick={() => onSelect(prediction.id)}
          className={`flex space-x-4 p-4 rounded-lg text-left transition-colors ${
            selectedId === prediction.id
              ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500'
              : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <div className="w-20 h-20 flex-shrink-0">
            <img
              src={prediction.imageUrl}
              alt={`Analysis ${prediction.id}`}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {prediction.class}
              </p>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                #{prediction.id}
              </span>
            </div>
            <div className="mt-1 flex items-center space-x-2">
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                  style={{ width: `${prediction.confidence}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {prediction.confidence.toFixed(1)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {prediction.details.imageType} • {prediction.details.dimensions.width}x{prediction.details.dimensions.height}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}