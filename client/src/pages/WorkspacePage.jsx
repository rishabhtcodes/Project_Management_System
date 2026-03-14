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
    return <div className="p-10 text-center">Workspace not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Workspace Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white w-16 h-16 rounded-xl flex items-center justify-center font-bold text-3xl shadow-inner">
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{workspace.name}</h1>
            <p className="text-slate-500 text-sm flex items-center mt-1">
              <Users size={14} className="mr-1" />
              {workspace.members?.length || 1} members
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline"><Settings size={16} className="mr-2" /> Settings</Button>
          <Button><Users size={16} className="mr-2" /> Invite Members</Button>
        </div>
      </div>

      {/* Boards Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center">
          <Layout className="mr-2" size={20} /> Boards
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
          className="h-32 rounded-lg bg-slate-100 border border-slate-300 flex flex-col items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors shadow-sm"
        >
          <Plus size={24} className="mb-2" />
          <span className="font-medium">Create new board</span>
        </button>
      </div>
      
      {/* Members Section Placeholder */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Users className="mr-2" size={20} /> Team Members
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <ul className="divide-y divide-slate-200">
            {workspace.members?.map((member) => (
              <li key={member.user._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Avatar user={member.user} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{member.user.name}</p>
                    <p className="text-xs text-slate-500">{member.user.email}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
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
