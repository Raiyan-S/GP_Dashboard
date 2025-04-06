import React, { useContext } from 'react'; 
import { Menu, Sun, Moon } from 'lucide-react'; // Icons from Lucide
import { AuthContext } from '../auth/AuthContext'; // Authentication context to get user info
import { useTheme } from '../../hooks/useTheme'; // Custom hook to manage theme

export default function Header({ title, menuClick }) {
  const { username } = useContext(AuthContext); // Get username from AuthContext
  const { theme, setTheme } = useTheme(); // Get theme and setTheme from custom hook

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

        {/* Title and menu button on mobile view */}
        <div className="flex items-center">
          <button
            onClick={menuClick} // Function to open the sidebar menu
            className="p-2 -ml-2 lg:hidden rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" /> {/* Menu icon */}
          </button>
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white ml-2 lg:ml-0">
            {title} {/* Title based on the page */}
          </h1>
        </div>

        {/* Theme toggle and user profile */}
        <div className="flex items-center space-x-4 ml-auto">
          <button
            onClick={toggleTheme} // Handle theme toggle
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? (
              <Moon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            ) : (
              <Sun className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            )} {/* Icon based on the theme */}
          </button>

          {/* User profile */}
          {username && (
            <>
              <div className="relative w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
                {username.split('@')[0]}
              </span>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
