import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import DesktopSidebar from '../../components/layout/DesktopSidebar';
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
    <div className="flex min-h-screen bg-warm-beige">
      {/* Permanent desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 shrink-0">
        <DesktopSidebar />
      </div>

      {/* Content */}
      <div className="flex-1 min-h-screen">
        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-4 z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl fixed top-4 left-4"
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="pt-16 lg:pt-0 p-6 lg:p-8">
          {renderDashboard()}
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
        </>
      )}
    </div>
  );
};

export default Dashboard;

