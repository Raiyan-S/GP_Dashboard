import React from 'react';
import ThemeSettings from './ThemeSettings';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-white">Settings</h2>
      <ThemeSettings />
    </div>
  );
}