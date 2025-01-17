import React from 'react';
import { Layout, BarChart3, Users, TestTube, Settings, LogOut } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: BarChart3, id: 'dashboard' },
  { name: 'Clients', icon: Users, id: 'clients' },
  { name: 'Model Trial', icon: TestTube, id: 'model-trial' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 flex flex-col transition-colors">
      <div className="flex items-center h-16 px-4 border-b dark:border-gray-700">
        <Layout className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">ALL Dashboard</span>
      </div>

      <nav className="flex-1 mt-4">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === item.id
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </button>
        ))}
      </nav>

      <button
        onClick={() => console.log('Logout clicked')}
        className="flex items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-t dark:border-gray-700 transition-colors"
      >
        <LogOut className="h-5 w-5 mr-3" />
        Logout
      </button>
    </div>
  );
}