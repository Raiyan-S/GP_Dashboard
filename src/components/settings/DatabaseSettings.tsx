import React from 'react';
import { Database } from 'lucide-react';
import DatabaseConnection from './database/DatabaseConnection';
import DatabaseActions from './database/DatabaseActions';

export default function DatabaseSettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
      <div className="flex items-center space-x-2 mb-6">
        <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold dark:text-white">Database Configuration</h2>
      </div>
      
      <div className="space-y-6">
        <DatabaseConnection />
        <DatabaseActions />
      </div>
    </div>
  );
}