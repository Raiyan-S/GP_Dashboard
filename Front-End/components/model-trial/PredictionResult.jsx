import React from 'react';
import { Activity, Maximize2 } from 'lucide-react';

export default function PredictionDisplay({ prediction }) {
  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Analysis Results</h3>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative group">
            <img 
              src={prediction.imageUrl} 
              alt="Analyzed cell"
              className="rounded-lg w-full h-64 object-cover"
            />
            <button 
              className="absolute top-2 right-2 p-1 bg-black/50 rounded hover:bg-black/70 transition-colors"
              onClick={() => window.open(prediction.imageUrl, '_blank')}
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Image Details</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Dimensions: {prediction.details.dimensions.width} x {prediction.details.dimensions.height}px</p>
              <p>Image Type: {prediction.details.imageType}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Classification</h4>
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Class</p>
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{prediction.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confidence Score</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 dark:bg-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {prediction.confidence.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}