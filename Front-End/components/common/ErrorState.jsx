import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-400">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 inline-flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}