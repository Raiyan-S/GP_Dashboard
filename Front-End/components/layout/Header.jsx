import React, { useState, useContext } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';
import { useTheme } from '../../hooks/useTheme';

export default function Header({ title, setActiveTab, menuClick }) {
  const { username } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={menuClick}
            className="p-2 -ml-2 lg:hidden rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white ml-2 lg:ml-0">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? (
              <Moon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            ) : (
              <Sun className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          <div className="relative w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
            {username.split('@')[0]}
          </span>
        </div>
      </div>
    </header>
  );
}
