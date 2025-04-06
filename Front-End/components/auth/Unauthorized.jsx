import React from 'react';

// Used in ProtectRoute.jsx
// This component is displayed when the user tries to access a page they are not authorized to view
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Unauthorized</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You do not have permission to view this page.</p>
      </div>
    </div>
  );
};

export default Unauthorized;