import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Layout, Zap, Users } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <Layout size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">TaskSprint</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-primary-700 transition-colors"
              >
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32 lg:pb-24">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
          Manage projects.<br />
          <span className="text-primary-600">Move faster together.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 mb-10">
          TaskSprint brings all your tasks, teammates, and tools together. Keep everything in the same place—even if your team isn't.
        </p>
        <div className="flex justify-center flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
          >
            Start doing
            <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          >
            See how it works
          </a>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              A productivity powerhouse
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
              Simple, flexible, and powerful. All it takes are boards, lists, and cards to get a clear view of who's doing what and what needs to get done.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Intuitive Boards</h3>
              <p className="text-slate-600">
                Organize projects into visual boards. Drag and drop tasks effortlessly through custom workflows.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Sync</h3>
              <p className="text-slate-600">
                See changes as they happen. No refresh needed. Collaborate instantly with your team.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Workspaces</h3>
              <p className="text-slate-600">
                Group relevant boards together. Invite members and manage permissions at the workspace level.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Layout className="w-6 h-6 text-slate-400" />
            <span className="font-semibold text-slate-500">TaskSprint</span>
          </div>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} TaskSprint. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
