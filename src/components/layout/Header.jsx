import React from 'react';
import { Menu } from 'lucide-react';
import ProfileMenu from '../common/ProfileMenu';

export default function Header({ title, onTabChange, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 lg:hidden rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white ml-2 lg:ml-0">
            {title}
          </h1>
        </div>
        <ProfileMenu onTabChange={onTabChange} />
      </div>
    </header>
  );
}