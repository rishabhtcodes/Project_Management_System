import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Plus, X } from 'lucide-react';
import api from '../../services/api';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await api.get('/workspaces');
        setWorkspaces(res.data.data);
      } catch (error) {
        console.error('Failed to fetch workspaces', error);
      }
    };
    fetchWorkspaces();
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-800/50 z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <div 
        className={`fixed inset-y-0 left-0 top-14 w-64 bg-slate-50 border-r border-slate-200 z-40 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-3.5rem)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-semibold text-slate-700">Menu</span>
          <button onClick={closeSidebar} className="text-slate-500 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto w-full">
          <ul className="space-y-1 mb-6">
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`
                }
              >
                <LayoutDashboard size={18} className="mr-3" />
                Dashboard
              </NavLink>
            </li>
          </ul>

          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Workspaces
            </h3>
            <button className="text-slate-400 hover:text-slate-600 focus:outline-none">
              <Plus size={16} />
            </button>
          </div>
          
          <ul className="space-y-1">
            {workspaces.map((ws) => (
              <li key={ws._id}>
                <NavLink
                  to={`/workspaces/${ws._id}`}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`
                  }
                >
                  <Users size={18} className="mr-3" />
                  <span className="truncate">{ws.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
