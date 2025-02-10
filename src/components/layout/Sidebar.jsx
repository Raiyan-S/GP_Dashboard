import React from 'react';
import { Layout, BarChart3, Users, TestTube, Settings, LogOut, X } from 'lucide-react'; // Icons from Lucide 

// Sidebar navigation items
const navigation = [
  { name: 'Dashboard', icon: BarChart3, id: 'dashboard' },
  { name: 'Clients', icon: Users, id: 'clients' },
  { name: 'Model Trial', icon: TestTube, id: 'model-trial' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

// Sidebar component
export default function Sidebar({ activeTab, setActiveTab, isSidebarOpen, onClose }) {
  // 
  const handleTabChange = (id) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <div>
      {/* Mobile backdrop blur */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm lg:hidden z-40"
          onClick={onClose} // Close the sidebar when the backdrop is clicked
        />
      )}

      {/* Sidebar */}
      {/* <aside> is content that are indirectly related to the surrounding content. */}
      {/* The condition when it is true, the sidebar is translated to its original position.
      When it is false, the sidebar is translated off-screen to the left. 
      On large screens, it is always in its original position */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 
        lg:fixed lg:inset-y-0 lg:flex lg:flex-col
        bg-white dark:bg-gray-800 
        shadow-lg dark:shadow-gray-900/30 
        transform transition-transform duration-200 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        z-50 lg:z-30
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <Layout className="h-8 w-8 text-blue-600 dark:text-blue-400" /> {/* Main Icon on top left */}
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">FL-ALL Dashboard</span> {/* Main Name */}
          </div>
          {/* Clickable button to close the sidebar on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {/* X Icon */}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto">
          <div className="px-2 space-y-1 mt-4">
            {/* Iterate through navigation items */}
            {/* Condition when active tab is the item's id, color it blue */}
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === item.id
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
              >
                <item.icon className="h-5 w-5 mr-3" /> {/* Sidebar Icons */}
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Logout function (Not implemented yet, same thing in Header.jsx) */}
          <button
            onClick={() => console.log('Logout clicked')}
            className="w-full flex items-center px-6 py-4 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" /> {/* Signout Icon */}
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
}