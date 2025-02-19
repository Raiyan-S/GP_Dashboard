import React from 'react';

// Define the StatsCardSkeleton component
// Used in DashboardStats.jsx
export default function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left side of the card */}
        <div className="space-y-3 flex-1">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-24" />
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-8 w-32" />
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-28" />
        </div>
        {/* Right side of the card */}
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full w-12 h-12" />
      </div>
    </div>
  );
}