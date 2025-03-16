import React from 'react';
import ImageUploader from './ImageUploader';
import { Trash2 } from 'lucide-react';

export default function ModelTrial() {
  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:shadow-gray-900/30">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Cell Classification Model
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Upload microscopic cell images for automated classification
          </p>
        </div>
        <ImageUploader />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Analysis History
          </h3>
          <button className="flex items-center px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear History
          </button>
        </div>
      </div>
    </div>
  );
}