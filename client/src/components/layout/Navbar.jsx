import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, Bell, Menu, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';

const Navbar = ({ toggleSidebar, showSidebarToggle = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 h-14 flex items-center px-4 justify-between shrink-0 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-4">
        {showSidebarToggle && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
        )}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="bg-primary-600 text-white p-1 rounded">
            <Home size={18} />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight hidden sm:block">
            TaskSprint
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        <button className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center focus:outline-none"
          >
            <Avatar user={user} size="sm" className="hover:ring-2 hover:ring-primary-200 transition-all" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-slate-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 flex items-center hover:bg-slate-50 transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
