import React from 'react';
import { PerformanceData } from '../../types';
import { formatPercentage, formatDecimal, formatTimestamp } from '../../utils/formatters';
import { ChevronRight, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/export';
import { usePerformanceData } from '../../hooks/usePerformanceData';

interface PerformanceTableProps {
  data: PerformanceData[];
  onSeeAll?: () => void;
}

export default function PerformanceTable({ data, onSeeAll }: PerformanceTableProps) {
  const { allData } = usePerformanceData(); // Get all data for export

  const handleExport = () => {
    exportToCSV(allData, `performance_data_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
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
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Round</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Accuracy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">F1 Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Loss</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{row.round}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600 dark:text-blue-400">{formatPercentage(row.accuracy)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600 dark:text-green-400">{formatPercentage(row.f1Score)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-red-600 dark:text-red-400">{formatDecimal(row.loss)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{formatTimestamp(index)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}