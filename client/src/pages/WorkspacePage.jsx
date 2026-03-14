import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Settings, Plus } from 'lucide-react';
import workspaceService from '../services/workspace.service';
import boardService from '../services/board.service';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';

const WorkspacePage = () => {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const wsRes = await workspaceService.getWorkspace(id);
        const bRes = await boardService.getBoards(id);
        
        setWorkspace(wsRes.data);
        setBoards(bRes.data || []);
      } catch (error) {
        console.error('Failed to load workspace', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-10 flex justify-center"><Spinner /></div>;
  }

  if (!workspace) {
    return <div className="p-10 text-center text-slate-400 font-bold tracking-tight">Workspace not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Workspace Header */}
      <div className="glass p-8 rounded-[2rem] shadow-premium mb-12 flex flex-col sm:flex-row sm:items-center justify-between transition-all">
        <div className="flex items-center space-x-6 mb-4 sm:mb-0">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center font-black text-4xl shadow-lg">
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">{workspace.name}</h1>
            <p className="text-slate-500 text-sm font-bold flex items-center mt-2 uppercase tracking-widest">
              <Users size={14} className="mr-2 text-blue-500" />
              {workspace.members?.length || 1} members
            </p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 transition-all"><Settings size={16} className="mr-2" /> Settings</Button>
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20"><Users size={16} className="mr-2" /> Invite</Button>
        </div>
      </div>

      {/* Boards Section */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center tracking-tight">
          <Layout className="mr-3 text-blue-500" size={24} /> Boards
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            key={board._id}
            to={`/b/${board._id}`}
            className="h-32 rounded-lg p-4 relative group shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            style={{ backgroundColor: board.background || '#0079bf' }}
          >
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="font-semibold text-white block relative z-10 drop-shadow-md text-lg break-words line-clamp-2">
              {board.title}
            </span>
          </Link>
        ))}
        
        <button 
          className="h-32 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all shadow-lg group border-dashed"
        >
          <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-[10px] uppercase tracking-widest">Create new board</span>
        </button>
      </div>
      
      {/* Members Section Placeholder */}
      <div className="mt-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center tracking-tight">
          <Users className="mr-3 text-purple-500" size={24} /> Team Members
        </h2>
        <div className="glass rounded-[2rem] overflow-hidden border border-white/10">
          <ul className="divide-y divide-white/5">
            {workspace.members?.map((member) => (
              <li key={member.user._id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar user={member.user} className="ring-2 ring-white/5" />
                  <div>
                    <p className="text-sm font-bold text-white leading-none mb-1">{member.user.name}</p>
                    <p className="text-xs font-medium text-slate-500">{member.user.email}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-slate-400">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

import { Layout } from 'lucide-react'; // Added import for Layout
export default WorkspacePage;
