import React from 'react';
import { ChevronRight } from 'lucide-react'; // Icon from lucide-react
import ResponsiveTable from '../common/Table'; // Component to display data in a table format

// Used in ClientOverview.jsx
export default function PerformanceTable({ data, onSeeAll }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Training Rounds</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={onSeeAll} // Function to handle "See All" button click (navigates to clients page)
              className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              See All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
      </div>
      
      <ResponsiveTable data={data}/> {/* Table to display performance data */}
    </div>
  )
}