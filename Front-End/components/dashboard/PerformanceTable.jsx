import React from 'react';
import { ChevronRight, Download } from 'lucide-react'; // Icons from lucide-react
import { exportToCSV } from '../../utils/export';
import { usePerformanceData } from '../../hooks/usePerformanceData';
import ResponsiveTable from '../Table';

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
      
      <ResponsiveTable data={data}/>
    </div>
  )
}