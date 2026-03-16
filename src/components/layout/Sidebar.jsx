import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();

  const navItems = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/browse', label: 'Browse Pets', icon: '🐾' },
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/profile', label: 'Profile', icon: '👤' },
    { to: '/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/volunteer', label: 'Volunteer', icon: '❤️' },
    { to: '/ai/chat', label: 'AI Chat', icon: '🤖' },
    { to: '/rescue', label: 'Rescue', icon: '🚨' },
    { to: '/contact', label: 'Contact', icon: '📞' },
  ];


  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
      
      <nav className="p-4">
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
    </div>
  );
};

export default Sidebar;

