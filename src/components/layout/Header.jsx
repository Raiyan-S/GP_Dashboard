import React, { useState, useRef, useEffect } from 'react';
// useState for managing state, useRef for referencing DOM elements, useEffect for side effects
import { Menu, LogOut, Settings } from 'lucide-react'; // Icons from Lucide 

// Header component
export default function Header({ title, setActiveTab, menuClick }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Function to handle click outside the profile dropdown menu
  const handleClickOutside = (event) => {
    // profileRef.current is the DOM element, and event.target is the clicked element
    // If the clicked element is outside the profile dropdown menu, close the menu
    if (!profileRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };

  // Detect click outside the profile dropdown menu and close the menu
  // We remove the event listener because it could cause memory leaks
  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Go to Settings tab when the Settings button is clicked and close the profile menu
  const handleSettingsClick = () => {
    setActiveTab('settings');
    setIsProfileOpen(false);
  };

  // Header component JSX
  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">

          {/* Menu Button on Mobile Screens */}
          <button
            onClick={menuClick}
            className="p-2 -ml-2 lg:hidden rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" /> {/* Menu Icon */}
          </button>

          {/* Page Title */}
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white ml-2 lg:ml-0">
            {title}
          </h1>
        </div>

        {/* Profile Dropdown Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-medium">A</span> {/* Profile Pic */}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span> {/* Profile Name */}
          </button>

          {/* Profile Menu Open */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 transition-colors">
              <button
                onClick={handleSettingsClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="h-4 w-4 mr-3" /> {/* Settings Icon */}
                Settings
              </button>
              
              {/* Logout function (Not implemented yet, same thing in Sidebar.jsx) */}
              <button
                onClick={() => console.log('Logout clicked')}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="h-4 w-4 mr-3" /> {/* Logout Icon */}
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}