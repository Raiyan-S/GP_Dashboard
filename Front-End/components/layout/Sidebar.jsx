import React, { useContext } from 'react'; 
import { Link } from 'react-router-dom'; // Link is used to navigate between routes without reloading the page
import { Layout, BarChart3, Users, TestTube, LogOut, X } from 'lucide-react'; // Icons from Lucide 
import { AuthContext } from '../auth/AuthContext'; // Authentication context to get user info and logout function

// Sidebar navigation items
// Each item has a name, icon, id, and path
// The id is used to identify the active tab, and the path is used for routing
// The navigation items for admin users
const adminNavigation = [
  { name: 'Dashboard', icon: BarChart3, id: 'dashboard', path: '/dashboard' },
  { name: 'Clients', icon: Users, id: 'clients', path: '/clients' },
  { name: 'Model Trial', icon: TestTube, id: 'model-trial', path: '/model-trial' },
];
// The navigation items for clinic users
const clinicNavigation = [
  { name: 'Model Trial', icon: TestTube, id: 'model-trial', path: '/model-trial' },
];

// Used in App.jsx
export default function Sidebar({ activeTab, setActiveTab, isSidebarOpen, onClose }) {
  const { userRole, logoutt } = useContext(AuthContext); // Get user role and logout function from AuthContext

  // Function to handle tab change and close the sidebar (if open on mobile)
  // This function is called when a navigation item is clicked
  const handleTabChange = (id) => {
    setActiveTab(id);
    onClose();
  };

  // Determine the navigation items based on the user role
  const navigation = userRole === 'admin' ? adminNavigation : clinicNavigation;

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
      {/* The condition when it is true, the sidebar is translated to its original position.
      When it is false, the sidebar is translated off-screen to the left. 
      On large screens, it is always in its original position */}
      <aside className={`fixed top-0 left-0 h-full w-64 lg:inset-y-0 lg:flex lg:flex-col bg-white dark:bg-gray-800 
          shadow-lg dark:shadow-gray-900/30 transform transition-transform duration-200 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} z-50 lg:z-30
      `}>
        {/* Top Sidebar */}
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
            {/* Each item is a link that navigates to the corresponding path */}
            {navigation.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === item.id
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
              >
                <item.icon className="h-5 w-5 mr-3" /> {/* Sidebar Icons */}
                {item.name} {/* Sidebar Names */}
              </Link>
            ))}
          </div>
        </nav>
            
        {/* Bottom Sidebar */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Logout function */}
          <button
            onClick={logoutt}
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