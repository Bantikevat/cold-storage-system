// src/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, X, Menu } from 'lucide-react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

const MenuItem = ({ title, icon, children }) => {
  const location = useLocation();
  const path = location.pathname;

  // Automatically open menu if current path is in children
  const childPaths = React.Children.map(children, child =>
    child.props.to
  ) || [];

  const isActive = childPaths.some(childPath => path === childPath);
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (isActive && !open) setOpen(true);
  }, [path, isActive, open]);

  return (
    <div className="menu-item">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-2 py-2 rounded-lg transition-all duration-200 hover:bg-green-800/30 focus:outline-none focus:ring-1 focus:ring-green-500"
      >
        <span className="flex items-center gap-2 text-green-300 font-medium truncate">
          {icon} {title}
        </span>
        {children && (
          open ? <ChevronDown size={18} className="text-green-300 flex-shrink-0" /> : <ChevronRight size={18} className="text-green-300 flex-shrink-0" />
        )}
      </button>
      <div className={`ml-4 mt-1 overflow-hidden transition-all duration-300 ${open ? 'max-h-screen' : 'max-h-0'} flex flex-col gap-1`}>
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  // Close sidebar on navigation on mobile
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);

  return (
    <aside
      className={clsx(
        'bg-gray-900 text-white fixed top-0 left-0 h-full w-64 md:w-72 z-50 transform transition-transform duration-300 ease-in-out shadow-xl border-r border-green-700 overflow-hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:static md:h-screen'
      )}
      onClick={(e) => e.stopPropagation()} // Prevent clicks from closing via overlay
    >
      <div className="p-4 sm:p-6 overflow-y-auto h-full flex flex-col">
        {/* ❌ Close button on mobile */}
        <div className="md:hidden flex justify-end mb-2">
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Sidebar"
            className="p-1 rounded-full hover:bg-gray-800"
          >
            <X size={22} className="text-white hover:text-red-400 transition" />
          </button>
        </div>

        {/* 🔰 Logo */}
        <h2 className="text-xl sm:text-2xl font-extrabold mb-6 text-green-400 tracking-wide text-center md:text-left">
          ColdStorePro
        </h2>

        {/* ✅ Navigation Links - Scrollable area */}
        <nav className="flex flex-col gap-3 text-sm overflow-y-auto custom-scrollbar pr-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `hover:bg-green-800/20 px-3 py-2 rounded-lg text-green-300 font-medium transition flex items-center ${isActive ? 'bg-green-800/40 text-green-200' : ''
              }`
            }
          >
            📊 Dashboard
          </NavLink>
          <MenuItem title="👨‍🌾 Farmers">
            <NavLink
              to="/add-farmer"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Add Farmer
            </NavLink>
            <NavLink
              to="/farmers"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📄 Farmer List
            </NavLink>
          </MenuItem>

          <MenuItem title="🧾 Purchase">
            <NavLink
              to="/purchase-entry"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Entry
            </NavLink>
            <NavLink
              to="/purchase-list"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📋 List
            </NavLink>

          </MenuItem>

          <MenuItem title="👥 Clients">
            <NavLink
              to="/add-customer"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Add Customer
            </NavLink>
            <NavLink
              to="/customer-list"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📋 Customer List
            </NavLink>
          </MenuItem>
          <MenuItem title="💰 Sales">
            <NavLink
              to="/sales-entry"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Entry
            </NavLink>
            <NavLink
              to="/sales-list"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📋 List
            </NavLink>

          </MenuItem>


          <MenuItem title="📦 Stock">
            <NavLink
              to="/stock/add"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Manual Stock Entry
            </NavLink>
            <NavLink
              to="/stock"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📦 Stock List
            </NavLink>
            <NavLink
              to="/stock-history"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📜 Stock History
            </NavLink>
          </MenuItem>
          {/* Farmers Menu Item */}


          <MenuItem title="📦 Storage">
            <NavLink
              to="/add-storage"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              ➕ Entry
            </NavLink>
            <NavLink
              to="/storage-list"
              className={({ isActive }) =>
                `hover:translate-x-1 transition hover:text-green-400 px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : ''
                }`
              }
            >
              📋 List
            </NavLink>
          </MenuItem>


          
          






          <MenuItem title="📈 Reports">
            <NavLink
              to="/report"
              className={({ isActive }) =>
                `hover:translate-x-1 transition px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : 'hover:text-green-400'
                }`
              }
            >
              📊 Report_P
            </NavLink>
            <NavLink
              to="/sales-report"
              className={({ isActive }) =>
                `hover:translate-x-1 transition px-3 py-1.5 rounded-lg flex items-center ${isActive ? 'text-green-500 font-medium bg-green-900/30' : 'hover:text-green-400'
                }`
              }
            >
              📊 Report Sales
            </NavLink>
          </MenuItem>





          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `hover:bg-green-800/20 px-3 py-2 rounded-lg text-green-300 font-medium transition flex items-center ${isActive ? 'bg-green-800/40 text-green-200' : ''
              }`
            }
          >
            ⚙️ Settings
          </NavLink>

          <NavLink
            to="/logout"
            className="text-red-400 hover:text-red-300 px-3 py-2 rounded-lg transition flex items-center hover:bg-red-900/20"
          >
            🚪 Logout
          </NavLink>


          
        </nav>

        {/* Footer if needed */}
        <div className="mt-auto pt-4 text-center text-xs text-gray-500">
          v1.0.0 © KT Traders
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
