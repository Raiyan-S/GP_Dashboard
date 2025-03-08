import React from 'react';
import { formatPercentage, formatDecimal } from '../../utils/formatters';

export default function ClientSummary({ data }) {
  const latestRound = data[data.length - 1];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Latest Round Summary</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Round</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{latestRound.round_id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
          <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">{formatPercentage(latestRound.accuracy)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">F1 Score</p>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400">{formatPercentage(latestRound.f1_score)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loss</p>
          <p className="text-xl font-semibold text-red-600 dark:text-red-400">{formatDecimal(latestRound.loss, 3)}</p>
        </div>
      </div>
    </div>
  );
}