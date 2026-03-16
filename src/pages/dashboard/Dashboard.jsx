import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import UserDashboard from './UserDashboard';
import VolunteerDashboard from './VolunteerDashboard';
import NGODashboard from './NGODashboard';
import AdminDashboard from './AdminDashboard';


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'petOwner':
        return <UserDashboard />;
      case 'volunteer':
        return <VolunteerDashboard />;
      case 'ngo':
        return <NGODashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div className="text-center py-20">Invalid role. Please contact support.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-warm-beige flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64 transition-all">
        <button
          className="lg:hidden p-4 fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl"
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8">
          <h1 className="text-4xl font-bold text-text-dark mb-2">
            Dashboard
          </h1>
          <p className="text-xl text-text-dark/70 mb-12">
            Welcome back, <span className="font-semibold text-primary-orange">{currentUser?.name}</span> ({currentUser?.role})
          </p>
          {renderDashboard()}
        </div>
      </div>
    </div>
  );
};


export default Dashboard;

