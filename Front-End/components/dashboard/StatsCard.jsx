import React from 'react';

// Used in DashboardStats.jsx
export default function StatsCard({ title, value, Icon}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors">
      <div className="flex items-center justify-between">
        <div> 
          {/* Card Title and Value */}
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
        </div>
        {/* Icons */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );
}