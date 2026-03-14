import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, Bell, Menu, Search, Moon, Sun } from 'lucide-react';
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
    <nav className="glass sticky top-0 z-50 h-16 flex items-center px-6 justify-between shrink-0 border-b border-white/5 shadow-2xl">
      <div className="flex items-center space-x-6">
        {showSidebarToggle && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:bg-white/10 lg:hidden transition-all"
          >
            <Menu size={20} />
          </button>
        )}
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
            <Home size={18} />
          </div>
          <span className="font-bold text-xl text-white tracking-tight hidden sm:block">
            TaskSprint
          </span>
        </Link>

        {/* Search Bar - Aesthetic addition */}
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-64 focus-within:w-80 focus-within:border-blue-500/50 transition-all">
          <Search size={16} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="bg-transparent border-none focus:ring-0 text-sm placeholder-slate-500 text-slate-200 ml-2 w-full"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
          <button className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors">
            <Moon size={16} />
          </button>
          <button className="p-1.5 rounded-full bg-blue-600 text-white shadow-lg">
            <Sun size={16} />
          </button>
        </div>

        <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 relative transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-[#141417]"></span>
        </button>

        <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center focus:outline-none"
          >
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500">
               <Avatar user={user} size="sm" className="border-2 border-[#141417]" />
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 glass rounded-2xl shadow-premium py-2 z-50 border border-white/10 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                  My Tasks
                </button>
              </div>
              <div className="border-t border-white/5 pt-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 flex items-center hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
