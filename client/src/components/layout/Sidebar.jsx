import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Plus, X, Folder, Settings, ShieldCheck, Zap } from 'lucide-react';
import api from '../../services/api';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await api.get('/workspaces');
        setWorkspaces(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch workspaces', error);
      }
    };
    fetchWorkspaces();
  }, []);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/tasks", icon: Zap, label: "My Tasks" },
    { to: "/members", icon: Users, label: "Members" },
  ];

  const bottomItems = [
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/security", icon: ShieldCheck, label: "Security" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <div 
        className={`fixed inset-y-0 left-0 top-16 w-64 bg-[#0a0a0c] border-r border-white/5 z-40 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 lg:hidden">
          <span className="font-bold text-white tracking-wider">NAVIGATION</span>
          <button onClick={closeSidebar} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-4 flex-1 overflow-y-auto w-full scrollbar-thin">
          <div className="mb-8">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-4 px-2">
              Menu
            </h3>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/dashboard"}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all group ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <item.icon size={18} className="mr-3" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px]">
                Workspaces
              </h3>
              <button className="text-slate-500 hover:text-white transition-colors">
                <Plus size={14} />
              </button>
            </div>
            
            <ul className="space-y-1">
              {workspaces.map((ws) => (
                <li key={ws._id}>
                  <NavLink
                    to={`/workspaces/${ws._id}`}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all group ${
                        isActive
                          ? 'bg-white/10 text-white border border-white/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Folder size={18} className="mr-3 text-blue-400/60" />
                    <span className="truncate">{ws.name}</span>
                  </NavLink>
                </li>
              ))}
              {workspaces.length === 0 && (
                <li className="px-4 py-3 text-xs text-slate-600 italic">
                  No active workspaces
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Sidebar Items */}
        <div className="p-4 border-t border-white/5">
          <ul className="space-y-1">
            {bottomItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <item.icon size={18} className="mr-3 text-slate-500" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/5">
            <p className="text-xs font-semibold text-white mb-1 tracking-wide">Pro Plan</p>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">Unlock advanced analytics and team limits.</p>
            <button className="w-full py-2 bg-white text-black text-[10px] font-bold rounded-lg hover:bg-slate-200 transition-colors">
              UPGRADE NOW
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
