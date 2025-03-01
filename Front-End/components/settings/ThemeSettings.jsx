import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold dark:text-white">Appearance</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setTheme('light')}
          className={`p-4 rounded-lg border-2 flex flex-col items-center space-y-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            theme === 'light' ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <Sun className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium dark:text-gray-300">Light</span>
        </button>

        <button
          onClick={() => setTheme('dark')}
          className={`p-4 rounded-lg border-2 flex flex-col items-center space-y-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            theme === 'dark' ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium dark:text-gray-300">Dark</span>
        </button>

        <button
          onClick={() => setTheme('system')}
          className={`p-4 rounded-lg border-2 flex flex-col items-center space-y-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            theme === 'system' ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <Monitor className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium dark:text-gray-300">System</span>
        </button>
      </div>
    </div>
  );
}