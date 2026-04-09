import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  if (loading) return null;

  const isAuthenticated = !!currentUser;
  const [showAITools, setShowAITools] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-warm-beige/95 backdrop-blur-sm shadow-soft">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🐾</span>
            </div>
            <span className="text-xl font-bold text-text-dark">PawConnect</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium">
              Home
            </Link>
            <Link to="/browse" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium">
              Browse Pets
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-bold border-b-2 border-transparent hover:border-primary-orange pb-1">
                Dashboard
              </Link>
            )}
            <Link to="/lost-pets" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium">
              Lost Pets
            </Link>
            <Link to="/adoption" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium">
              Adoption
            </Link>
            <Link to="/add-pet" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium">
              Report Pet
            </Link>
            <Link to="/map" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium">
              Map
            </Link>
              {isAuthenticated && (
                <Link to="/profile" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-3 block border-l-4 border-transparent hover:border-primary-orange" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
              )}
              {/* AI Tools Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowAITools(!showAITools)}
                className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium flex items-center space-x-1"
              >
                AI Tools
                <svg className={`w-4 h-4 transition-transform ${showAITools ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showAITools && (
                <ul className="absolute top-full left-0 mt-2 w-48 bg-white shadow-2xl rounded-2xl border border-gray-200 py-2 z-50">
                  <li>
                    <Link 
                      to="/ai/image-search" 
                      className="block px-4 py-3 text-sm text-text-dark hover:bg-primary-orange/5 hover:text-primary-orange transition-all w-full text-left font-medium" 
                      onClick={() => setShowAITools(false)}
                    >
                      Image Similarity Search
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/breed-detect" 
                      className="block px-4 py-3 text-sm text-text-dark hover:bg-primary-orange/5 hover:text-primary-orange transition-all w-full text-left font-medium" 
                      onClick={() => setShowAITools(false)}
                    >
                      Breed Detection
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/health" 
                      className="block px-4 py-3 text-sm text-text-dark hover:bg-primary-orange/5 hover:text-primary-orange transition-all w-full text-left font-medium" 
                      onClick={() => setShowAITools(false)}
                    >
                      Pet Health (Disease Prediction)
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/ai/chat" 
                      className="block px-4 py-3 text-sm text-text-dark hover:bg-primary-orange/5 hover:text-primary-orange transition-all w-full text-left font-medium" 
                      onClick={() => setShowAITools(false)}
                    >
                      AI Chat Assistant
                    </Link>
                  </li>
                </ul>
              )}
            </div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 ml-auto">
                {/* Optional Notification Bell */}
                <Link to="/notifications" className="p-1.5 rounded-xl hover:bg-light-accent transition-colors relative group">
                  <svg className="w-6 h-6 text-text-dark group-hover:text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">3</span>
                </Link>
                {/* Profile Icon */}
                <Link to="/profile" className="flex items-center space-x-2 -mr-1">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-orange to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:scale-105 transition-transform">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="bg-primary-orange text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-400 transition-all duration-300 shadow-soft hover:shadow-lg ml-auto">
                Sign In
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-light-accent/50 transition-colors duration-300" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-1 pt-2 pb-6">
              <Link to="/" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-bold px-4 py-3 block border-l-4 border-transparent hover:border-primary-orange" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/browse" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-3 block border-l-4 border-transparent hover:border-primary-orange" onClick={() => setIsOpen(false)}>
                Browse Pets
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-semibold px-4 py-3 block border-l-4 border-primary-orange bg-primary-orange/5" onClick={() => setIsOpen(false)}>
                  📊 Dashboard
                </Link>
              )}
              <Link to="/lost-pets" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-3 block border-l-4 border-transparent hover:border-primary-orange" onClick={() => setIsOpen(false)}>
                Lost Pets
              </Link>
              <Link to="/adoption" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-3 block border-l-4 border-transparent hover:border-primary-orange" onClick={() => setIsOpen(false)}>
                Adoption
              </Link>
              <Link to="/add-pet" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-3 block border-l-4 border-transparent hover:border-primary-orange" onClick={() => setIsOpen(false)}>
                Report Pet
              </Link>
              <Link to="/map" className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-3 block border-l-4 border-transparent hover:border-primary-orange" onClick={() => setIsOpen(false)}>
                Map
              </Link>
              {/* AI Tools Dropdown Mobile */}
              <div>
                <button 
                  onClick={() => setShowAITools(!showAITools)}
                  className="w-full text-left flex justify-between items-center py-3 px-4 text-text-dark hover:text-primary-orange font-medium border-l-4 border-transparent hover:border-primary-orange"
                >
                  AI Tools
                  <svg className={`w-5 h-5 transition-transform ${showAITools ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showAITools && (
                  <div className="pl-8 space-y-2 bg-light-accent/30 py-2 rounded-r-xl mx-4 mt-1 border-r-2 border-primary-orange/30">
                    <Link to="/ai/image-search" className="block py-2 pl-4 pr-8 text-sm text-text-dark/80 hover:text-primary-orange transition-colors" onClick={() => {
                      setShowAITools(false);
                      setIsOpen(false);
                    }}>
                      Image Similarity Search
                    </Link>
                    <Link to="/breed-detect" className="block py-2 pl-4 pr-8 text-sm text-text-dark/80 hover:text-primary-orange transition-colors" onClick={() => {
                      setShowAITools(false);
                      setIsOpen(false);
                    }}>
                      Breed Detection
                    </Link>
                    <Link to="/health" className="block py-2 pl-4 pr-8 text-sm text-text-dark/80 hover:text-primary-orange transition-colors" onClick={() => {
                      setShowAITools(false);
                      setIsOpen(false);
                    }}>
                      Pet Health (Disease Prediction)
                    </Link>
                    <Link to="/ai/chat" className="block py-2 pl-4 pr-8 text-sm text-text-dark/80 hover:text-primary-orange transition-colors" onClick={() => {
                      setShowAITools(false);
                      setIsOpen(false);
                    }}>
                      AI Chat Assistant
                    </Link>
                  </div>
                )}
              </div>
              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-200 pt-4 px-4">
                    {/* Notification Bell Mobile */}
                    <Link to="/notifications" className="flex items-center space-x-3 py-3 text-text-dark hover:text-primary-orange transition-colors font-medium border-l-4 border-transparent hover:border-primary-orange" onClick={() => setIsOpen(false)}>
                      <div className="relative">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">3</span>
                      </div>
                      <span>Notifications</span>
                    </Link>
                    {/* Profile */}
                    <Link to="/profile" className="flex items-center space-x-3 py-3 text-text-dark hover:text-primary-orange transition-all font-medium border-l-4 border-transparent hover:border-primary-orange group" onClick={() => setIsOpen(false)}>
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-orange to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                        {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-semibold">{currentUser?.role || 'User'}</span>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 px-4">
                  <Link to="/login" className="block w-full bg-primary-orange text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-orange-400 transition-all duration-300 shadow-soft hover:shadow-lg text-center" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

