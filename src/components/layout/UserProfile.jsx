import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User } from 'lucide-react';

const userProfile = {
  name: "User",
  email: "user@example.com",
  role: "Researcher"
};

export default function UserProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">{userProfile.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
            <p className="text-xs text-gray-500">{userProfile.email}</p>
          </div>
          <a href="#profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <User className="h-4 w-4 mr-3" />
            Profile
          </a>
          <a href="#settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </a>
          <a href="#logout" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
            <LogOut className="h-4 w-4 mr-3" />
            Sign out
          </a>
        </div>
      )}
    </div>
  );
}