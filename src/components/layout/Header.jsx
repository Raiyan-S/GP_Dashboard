import React from 'react';
import ProfileMenu from '../common/ProfileMenu';

export default function Header({ title, onTabChange }) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow transition-colors">
      <div className="px-8 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        <ProfileMenu onTabChange={onTabChange} />
      </div>
    </header>
  );
}