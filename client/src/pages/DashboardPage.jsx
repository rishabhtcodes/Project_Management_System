import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import workspaceService from '../services/workspace.service';
import boardService from '../services/board.service';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const DashboardPage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceBoards, setWorkspaceBoards] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wsRes = await workspaceService.getWorkspaces();
        const wsData = wsRes.data || [];
        setWorkspaces(wsData);

        // Fetch boards for each workspace
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
    return <div className="p-10 flex justify-center"><Spinner /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h1 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">Your Workspaces</h1>
      
      {workspaces.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg border border-slate-200">
          <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No workspaces yet</h3>
          <p className="text-slate-500 mb-6">Create a workspace to start collaborating with your team.</p>
          <Button>Create Workspace</Button>
        </div>
      ) : (
        <div className="space-y-10">
          {workspaces.map((ws) => (
            <div key={ws._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 text-primary-700 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <Link 
                    to={`/workspaces/${ws._id}`}
                    className="text-xl font-semibold text-slate-800 hover:text-primary-600 transition-colors"
                  >
                    {ws.name}
                  </Link>
                </div>
                <Link to={`/workspaces/${ws._id}`}>
                  <Button variant="outline" size="sm">View Workspace</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {workspaceBoards[ws._id]?.map((board) => (
                  <Link
                    key={board._id}
                    to={`/b/${board._id}`}
                    className="h-28 rounded-lg p-3 relative group shadow-sm hover:shadow-md transition-all overflow-hidden"
                    style={{ backgroundColor: board.background || '#0079bf' }}
                  >
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <span className="font-semibold text-white truncate block relative z-10 drop-shadow-sm">
                      {board.title}
                    </span>
                  </Link>
                ))}
                
                <button 
                  className="h-28 rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                >
                  <Plus size={24} className="mb-1" />
                  <span className="text-sm font-medium">Create new board</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
