import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DesktopSidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const roleLabel = currentUser?.role === 'owner'
    ? 'Pet Owner'
    : currentUser?.role
      ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
      : '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleNavItems = (role) => {
    const common = [
      { to: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
      { to: '/notifications', label: 'Notifications', icon: 'Bell' },
    ];

    switch (role) {
      case 'owner':
        return [
          ...common,
          { to: '/my-pets', label: 'My Pets', icon: 'Pets' },
          { to: '/report-lost', label: 'Report Lost Pet', icon: 'Lost' },
          { to: '/report-found', label: 'Report Found Pet', icon: 'Found' },
          { to: '/ai/chat', label: 'AI Assistant', icon: 'AI' },
        ];
      case 'ngo':
        return [
          ...common,
          { to: '/lost-pets', label: 'Nearby Lost Pets', icon: 'Lost' },
          { to: '/rescue', label: 'Rescue Requests', icon: 'Rescue' },
          { to: '/adoption', label: 'Adoption Requests', icon: 'Adopt' },
          { to: '/map', label: 'Case Map', icon: 'Map' },
        ];
      case 'volunteer':
        return [
          ...common,
          { to: '/lost-pets', label: 'Nearby Alerts', icon: 'Alerts' },
          { to: '/volunteer', label: 'Accept Help Requests', icon: 'Help' },
          { to: '/dashboard#assigned-tasks', label: 'Assigned Tasks', icon: 'Tasks' },
          { to: '/map', label: 'Map', icon: 'Map' },
        ];
      case 'admin':
        return [
          ...common,
          { to: '/lost-pets', label: 'Reports', icon: 'Reports' },
          { to: '/rescue', label: 'Rescue Queue', icon: 'Rescue' },
          { to: '/adoption', label: 'Adoptions', icon: 'Adopt' },
        ];
      default:
        return common;
    }
  };

  const navItems = getRoleNavItems(currentUser?.role);

  return (
    <div className="h-full w-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b flex-shrink-0">
        <h2 className="text-2xl font-bold text-text-dark">PawConnect</h2>
        {currentUser && (
          <button
            type="button"
            className="mt-4 p-4 bg-primary-orange/10 rounded-2xl w-full text-left hover:bg-primary-orange/20 transition-colors"
            onClick={() => navigate('/profile')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-text-dark">{currentUser.name}</p>
                <p className="text-sm text-gray-600">{roleLabel}</p>
              </div>
            </div>
          </button>
        )}
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-primary-orange/10 transition-all text-text-dark hover:text-primary-orange font-medium"
              >
                <span>{item.label}</span>
                <span className="text-xs uppercase tracking-wide text-text-dark/40">{item.icon}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {currentUser && (
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default DesktopSidebar;
