import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  trend?: string;
}

export default function StatsCard({ title, value, Icon, trend }: StatsCardProps) {
  const trendValue = parseFloat(trend || '0');
  const isPositive = trendValue > 0;
  const isNegative = trendValue < 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
          {trend && (
            <p className={`text-sm mt-1 ${
              isPositive ? 'text-green-500 dark:text-green-400' :
              isNegative ? 'text-red-500 dark:text-red-400' :
              'text-gray-500 dark:text-gray-400'
            }`}>
              {isPositive ? '+' : ''}{trend}% from last round
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );
}