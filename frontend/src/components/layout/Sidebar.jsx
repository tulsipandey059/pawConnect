import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  if (!isOpen && !onClose) {
    // Desktop permanent mode - no overlay classes
    const { currentUser } = useAuth();
    // ... rest navItems code
  }
  const { currentUser, logout } = useAuth();

  const getRoleNavItems = (role) => {
    const common = [
      { to: '/dashboard', label: 'Dashboard', icon: '📊' },
      { to: '/notifications', label: 'Notifications', icon: '🔔' },
      { to: '/profile', label: 'Profile', icon: '👤' },
    ];

    switch (role) {
      case 'owner':
        return [
          ...common,
          { to: '/pets', label: 'My Pets', icon: '🐾' },
          { to: '/report-lost', label: 'Report Lost Pet', icon: '🐕‍🦺' },
          { to: '/report-found', label: 'Report Found Pet', icon: '🐈' },
          { to: '/ai-matches', label: 'AI Matches', icon: '🤖' },
        ];
      case 'ngo':
        return [
          ...common,
          { to: '/dashboard/nearby-lost', label: 'Nearby Lost Pets', icon: '🐕' },
          { to: '/rescue-requests', label: 'Rescue Requests', icon: '🚨' },
          { to: '/adoption-requests', label: 'Adoption Requests', icon: '❤️' },
          { to: '/case-management', label: 'Case Management', icon: '📋' },
        ];
      case 'volunteer':
        return [
          ...common,
          { to: '/nearby-alerts', label: 'Nearby Alerts', icon: '🔔' },
          { to: '/accept-help', label: 'Accept Help Requests', icon: '👍' },
          { to: '/assigned-tasks', label: 'Assigned Tasks', icon: '✅' },
          { to: '/map', label: 'Map', icon: '🗺️' },
        ];
      default:
        return common;
    }
  };

  const navItems = getRoleNavItems(currentUser?.role);


  return (
    <div className={`fixed inset-0 z-40 h-full w-64 bg-white shadow-2xl border-r border-gray-200 transform lg:translate-x-0 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-text-dark">PawConnect</h2>
        {currentUser && (
          <div className="mt-4 p-4 bg-primary-orange/10 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-text-dark">{currentUser.name}</p>
                <p className="text-sm text-gray-600">{currentUser.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link 
                to={item.to}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-primary-orange/10 transition-all text-text-dark hover:text-primary-orange font-medium"
                onClick={onClose}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

