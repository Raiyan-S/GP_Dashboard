import React from 'react';
import LoadingSkeleton from '../common/LoadingSkeleton';

export default function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-8 w-32" />
          <LoadingSkeleton className="h-4 w-28" />
        </div>
        <LoadingSkeleton className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
}