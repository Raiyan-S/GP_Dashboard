import React from 'react';
import { formatPercentage, formatDecimal, formatTimestamp } from '../../utils/formatters';
import { ChevronRight, Download } from 'lucide-react'; // Icons from lucide-react
import { exportToCSV } from '../../utils/export';
import { usePerformanceData } from '../../hooks/usePerformanceData';

export default function PerformanceTable({ data, onSeeAll }) {
  const { allData } = usePerformanceData();

  const handleExport = () => {
    exportToCSV(allData, `performance_data_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Training Rounds</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleExport}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </button>
          <button
            onClick={onSeeAll}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            See All
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden space-y-4">
        {data.map((row, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Round {row.round}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{formatTimestamp(index)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Accuracy</span>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                    {formatPercentage(row.accuracy)}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">F1 Score</span>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                    {formatPercentage(row.f1Score)}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Loss</span>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
                    {formatDecimal(row.loss)}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Precision</span>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                    {formatDecimal(row.precision)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Round</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Accuracy</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">F1 Score</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Loss</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Precision</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                      {row.round}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                        {formatPercentage(row.accuracy)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                        {formatPercentage(row.f1Score)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
                        {formatDecimal(row.loss)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                        {formatDecimal(row.precision)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatTimestamp(index)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}