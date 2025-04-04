import React from 'react';

// Used in PerformanceChart.jsx
export default function ClientSummary({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-600 dark:text-gray-400">No data available</p>;
  }

  // Find the round with the best F1 score
  const bestRound = data.reduce(
    (best, current) => {
      const currentF1 = current?.metrics?.f1 || 0; // Safely access current.metrics.f1
      const bestF1 = best?.metrics?.f1 || 0; // Safely access best.metrics.f1
      return currentF1 > bestF1 ? current : best;
    },
    { metrics: { f1: 0 } }
  );

  const { round_id = 'N/A', metrics = {} } = bestRound; // Safely destructure bestRound

  // Could add precision and recall here later
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Best Round Summary</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Round</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{round_id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
          <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            {metrics.accuracy?.toFixed(3) + '%' || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">F1 Score</p>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400">
            {metrics.f1?.toFixed(3) + '%' || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loss</p>
          <p className="text-xl font-semibold text-red-600 dark:text-red-400">
            {metrics.avg_loss?.toFixed(3) || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
