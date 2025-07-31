// ✅ src/layout/Topbar.jsx
import React, { useState } from 'react';
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Topbar = ({ setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          className="md:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors" 
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(true);
          }}
          aria-label="Open Sidebar"
        >
          <FaBars className="text-sky-700 text-lg sm:text-xl" />
        </button>
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-sky-700 truncate">
          ColdStorePro Admin
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors relative" aria-label="Notifications">
          <FaBell className="text-gray-600 text-sm sm:text-base" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* User dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="User menu"
          >
            <span className="text-gray-600 hidden sm:block text-sm">
              <span className="hidden md:inline">Welcome, </span><strong>Admin</strong>
            </span>
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-700">
              <FaUser className="text-xs sm:text-sm" />
            </div>
          </button>
          
          {/* Dropdown menu */}
          {dropdownOpen && (
            <div 
              className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <a 
                href="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaUser className="text-gray-500" />
                Profile
              </a>
              <a 
                href="/settings" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaCog className="text-gray-500" />
                Settings
              </a>
              <hr className="my-1" />
              <a 
                href="/logout" 
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaSignOutAlt className="text-red-500" />
                Logout
              </a>
            </div>
          )}
        </div>
        
        {/* Separate logout button for smaller devices */}
        <a 
          href="/logout"
          className="bg-red-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded hover:bg-red-600 transition-all duration-200 flex items-center gap-1"
        >
          <FaSignOutAlt className="text-xs" />
          <span>Logout</span>
        </a>
      </div>
    </header>
  );
};

export default Topbar;
