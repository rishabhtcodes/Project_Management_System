import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Users, Play, Calendar, Video, Bell, 
  ArrowUpRight, Clock, CheckCircle2, MoreVertical,
  Activity, BarChart3, ListTodo, ChevronRight
} from 'lucide-react';
import workspaceService from '../services/workspace.service';
import boardService from '../services/board.service';
import Spinner from '../components/ui/Spinner';

const DashboardPage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceBoards, setWorkspaceBoards] = useState({});
  const [loading, setLoading] = useState(true);

  // Mock data for the Premium Widgets based on the reference image
  const todayTasks = [
    { id: 1, title: 'Color Palette Selection', project: 'Over9k: Gamers App', color: 'orange' },
    { id: 2, title: 'Creating Landing page for...', project: 'Guitar Tuner', color: 'blue' },
    { id: 3, title: 'Competitive & functional a...', project: 'Doctor+', color: 'blue' },
  ];

  const meetings = [
    { id: 1, time: '10:00 AM', title: 'Product Review', type: 'Discord' },
    { id: 2, time: '01:00 PM', title: 'Meeting with UX team', type: 'Video' },
  ];

  const calendarDays = [
    { day: 'MON', date: 18, active: false },
    { day: 'TUE', date: 19, active: false },
    { day: 'WED', date: 20, active: true },
    { day: 'THU', date: 21, active: false },
    { day: 'FRI', date: 22, active: false },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wsRes = await workspaceService.getWorkspaces();
        const wsData = wsRes.data || [];
        setWorkspaces(wsData || []);

        const boardsData = {};
        for (const ws of wsData) {
          const bRes = await boardService.getBoards(ws._id);
          boardsData[ws._id] = bRes.data || [];
        }
        setWorkspaceBoards(boardsData);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-dark-bg">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage your team and track projects effortlessly.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {['Today', 'Week', 'Month', 'Year'].map(tab => (
                <button 
                  key={tab} 
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'Week' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {tab}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN - Main Content */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
          
          {/* Top Row Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Today's Tasks Widget */}
            <div className="glass p-6 rounded-[2rem] relative overflow-hidden group">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">Today's tasks</h3>
                    <span className="bg-white/10 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                 </div>
                 <button className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center">
                    Manage <ChevronRight size={14} className="ml-0.5" />
                 </button>
              </div>
              <div className="space-y-4">
                {todayTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-white/10 transition-all cursor-pointer">
                    <div className="flex items-center space-x-4">
                       <div className={`p-2 rounded-xl ${task.color === 'orange' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                          <Play size={16} fill="currentColor" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white leading-none mb-1">{task.title}</p>
                          <p className="text-[10px] font-medium text-slate-500">{task.project}</p>
                       </div>
                    </div>
                    <CheckCircle2 size={16} className="text-slate-600 hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Meetings Widget */}
            <div className="glass p-6 rounded-[2rem]">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">Today's meetings</h3>
                    <span className="bg-white/10 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">6</span>
                 </div>
                 <button className="text-xs font-bold text-blue-500 hover:text-blue-400">View all</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {meetings.map((m, idx) => (
                  <div key={m.id} className={`p-4 rounded-2xl ${idx === 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5 border border-white/10'} space-y-3`}>
                    <div className="flex items-center justify-between">
                       <span className={`text-[10px] font-bold uppercase tracking-wider ${idx === 0 ? 'text-red-400' : 'text-slate-400'}`}>{m.time}</span>
                       {m.type === 'Discord' ? <div className="w-6 h-6 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400"><Video size={12}/></div> : <Video size={12} className="text-slate-500"/>}
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">{m.title}</p>
                  </div>
                ))}
                <div className="col-span-2 p-4 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-blue-500 hover:bg-white/5 transition-colors cursor-pointer">
                   <Plus size={20} className="mb-1" />
                   <span className="text-[10px] font-bold uppercase">Schedule meeting</span>
                </div>
              </div>
            </div>

          </div>

          {/* Schedule / Calendar Row */}
          <div className="glass p-8 rounded-[2rem]">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                   <Calendar size={20} className="text-blue-500" />
                   <h3 className="text-xl font-bold text-white tracking-tight">March 2026</h3>
                </div>
                <div className="flex items-center space-x-2">
                   <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors">
                      <ChevronRight size={18} className="rotate-180" />
                   </button>
                   <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors">
                      <ChevronRight size={18} />
                   </button>
                </div>
             </div>
             
             <div className="flex items-center justify-between">
                {calendarDays.map((day) => (
                   <div key={day.date} className={`flex flex-col items-center p-4 rounded-3xl transition-all cursor-pointer ${day.active ? 'bg-blue-600 shadow-xl shadow-blue-500/20' : 'hover:bg-white/5'}`}>
                      <span className={`text-[10px] font-bold mb-2 tracking-widest ${day.active ? 'text-white' : 'text-slate-500'}`}>{day.day}</span>
                      <span className={`text-xl font-black ${day.active ? 'text-white' : 'text-slate-300'}`}>{day.date}</span>
                   </div>
                ))}
             </div>

             <div className="mt-8 space-y-4">
                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <div className="w-1 h-12 bg-orange-500 rounded-full"></div>
                      <div>
                         <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1 block">Medium</span>
                         <h4 className="text-sm font-bold text-white">Color Palette Selection</h4>
                         <p className="text-xs text-slate-500 font-medium mt-0.5">Create a harmonious color scheme</p>
                      </div>
                   </div>
                   <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-[#141417] bg-slate-800"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-[#141417] bg-slate-700"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-[#141417] bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">+2</div>
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN - Statistics & Activity */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
          
          {/* Activity Widget */}
          <div className="glass p-8 rounded-[3rem]">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white tracking-tight">Activity</h3>
                <div className="flex items-center space-x-1 bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full text-[10px] font-black">
                   <ArrowUpRight size={10} />
                   <span>+12%</span>
                </div>
             </div>
             
             <div className="mb-8">
                <h4 className="text-5xl font-black text-white mb-2 tracking-tighter">70<span className="text-2xl text-slate-500 font-bold ml-1">%</span></h4>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Efficiency rate</p>
             </div>

             <div className="flex items-end justify-between h-32 gap-3 px-2">
                {[92, 41, 78, 0, 0].map((val, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-white/5 rounded-full h-24 relative overflow-hidden">
                         <div 
                           className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ${val > 80 ? 'bg-blue-500' : 'bg-white/10'}`} 
                           style={{ height: `${val}%` }}
                         />
                      </div>
                      <span className="text-[10px] font-black text-slate-600 mt-3">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]}</span>
                   </div>
                ))}
             </div>
          </div>

          {/* Projects Statistics */}
          <div className="glass p-8 rounded-[3rem]">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold text-white tracking-tight">Projects</h3>
                 <MoreVertical size={18} className="text-slate-500" />
              </div>
              
              <div className="flex items-center justify-between mb-8">
                 <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-[6px] border-white/5"></div>
                    <div className="absolute inset-0 rounded-full border-[6px] border-blue-500 border-t-transparent border-r-transparent -rotate-45"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-2xl font-black text-white">4</span>
                       <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active</span>
                    </div>
                 </div>
                 
                 <div className="space-y-3 flex-1 ml-8">
                    {['Over9k', 'Doctor+', 'AfterMid'].map((p, i) => (
                       <div key={p} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center space-x-2">
                             <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-orange-500' : i === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                             <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{p}</span>
                          </div>
                          <span className="text-[10px] font-black text-slate-500">{[44, 18, 14][i]}%</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Reminders</h4>
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                       <Clock size={16} className="text-blue-500" />
                       <span className="text-xs font-bold text-white">09:30 AM</span>
                    </div>
                    <div className="text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">Low</div>
                 </div>
              </div>
          </div>

        </div>

      </div>

      {/* Actual Workspaces Section (The original content integrated aesthetically) */}
      <div className="mt-16 mb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Workspaces</h2>
          <button className="glass px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center hover:bg-white/10 transition-all">
            <Plus size={16} className="mr-2" /> CREATE WORKSPACE
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workspaces.map((ws) => (
             <div key={ws._id} className="glass p-6 rounded-[2rem] hover:transform hover:scale-[1.02] transition-all group border border-white/5 hover:border-white/10">
                <div className="flex items-center space-x-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-black text-white shadow-lg">
                      {ws.name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                      <h4 className="text-lg font-bold text-white leading-none mb-1">{ws.name}</h4>
                      <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                         <Users size={12} className="mr-1" /> {[2, 4, 1, 8][Math.floor(Math.random()*4)]} members
                      </div>
                   </div>
                </div>

                <div className="space-y-3 mb-6">
                   {workspaceBoards[ws._id]?.slice(0, 3).map(board => (
                      <Link key={board._id} to={`/b/${board._id}`} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/[0.03]">
                         <span className="text-xs font-bold text-slate-300">{board.title}</span>
                         <ArrowUpRight size={14} className="text-slate-500" />
                      </Link>
                   ))}
                   {(!workspaceBoards[ws._id] || workspaceBoards[ws._id].length === 0) && (
                      <p className="text-[10px] font-medium text-slate-600 italic">No boards created yet</p>
                   )}
                </div>

                <Link to={`/workspaces/${ws._id}`} className="block w-full text-center py-3 rounded-xl bg-white/5 text-[10px] font-black text-blue-500 tracking-widest hover:bg-blue-600 hover:text-white transition-all uppercase">
                   Manage Workspace
                </Link>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
