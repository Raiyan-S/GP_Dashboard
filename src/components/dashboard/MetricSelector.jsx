import React from 'react';

export const metricOptions = [
  { id: 'accuracy', label: 'Accuracy', dataKey: 'accuracy', color: '#60A5FA' },
  { id: 'loss', label: 'Loss', dataKey: 'loss', color: '#F87171' },
  { id: 'precision', label: 'Precision', dataKey: 'precision', color: '#34D399' },
  { id: 'recall', label: 'Recall', dataKey: 'recall', color: '#FBBF24' },
  { id: 'f1Score', label: 'F1 Score', dataKey: 'f1Score', color: '#818CF8' },
];

export default function MetricSelector({ selectedMetric, onMetricChange }) {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="metric-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Metric:
      </label>
      <select
        id="metric-select"
        value={selectedMetric}
        onChange={(e) => onMetricChange(e.target.value)}
        className="block w-40 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm"
      >
        {metricOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}