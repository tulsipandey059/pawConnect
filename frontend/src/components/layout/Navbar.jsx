import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinkClass =
  'text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium';

const mobileNavLinkClass =
  'text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-3 block border-l-4 border-transparent hover:border-primary-orange';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAITools, setShowAITools] = useState(false);
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = !!currentUser;

  const closeMenus = () => {
    setIsOpen(false);
    setShowAITools(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
    navigate('/');
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-warm-beige/95 backdrop-blur-sm shadow-soft">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenus}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-orange">
              <span className="text-xl text-white">P</span>
            </div>
            <span className="text-xl font-bold text-text-dark">PawConnect</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={navLinkClass}>
              Home
            </Link>
            <Link to="/browse" className={navLinkClass}>
              Browse Pets
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className={navLinkClass}>
                Dashboard
              </Link>
            ) : null}
            <Link to="/lost-pets" className={navLinkClass}>
              Lost Pets
            </Link>
            <Link to="/adoption" className={navLinkClass}>
              Adoption
            </Link>
            <Link to="/add-pet" className={navLinkClass}>
              Report Pet
            </Link>
            <Link to="/map" className={navLinkClass}>
              Map
            </Link>
            {isAuthenticated ? (
              <Link to="/profile" className={navLinkClass}>
                Profile
              </Link>
            ) : null}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAITools((current) => !current)}
                className="flex items-center space-x-1 text-text-dark transition-colors duration-300 hover:text-primary-orange font-medium"
              >
                <span>AI Tools</span>
                <svg
                  className={`h-4 w-4 transition-transform ${showAITools ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showAITools ? (
                <ul className="absolute left-0 top-full z-50 mt-2 w-48 rounded-2xl border border-gray-200 bg-white py-2 shadow-2xl">
                  <li>
                    <Link
                      to="/ai/image-search"
                      className="block w-full px-4 py-3 text-left text-sm font-medium text-text-dark transition-all hover:bg-primary-orange/5 hover:text-primary-orange"
                      onClick={closeMenus}
                    >
                      Image Similarity Search
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/breed-detect"
                      className="block w-full px-4 py-3 text-left text-sm font-medium text-text-dark transition-all hover:bg-primary-orange/5 hover:text-primary-orange"
                      onClick={closeMenus}
                    >
                      Breed Detection
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/health"
                      className="block w-full px-4 py-3 text-left text-sm font-medium text-text-dark transition-all hover:bg-primary-orange/5 hover:text-primary-orange"
                      onClick={closeMenus}
                    >
                      Pet Health (Disease Prediction)
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/ai/chat"
                      className="block w-full px-4 py-3 text-left text-sm font-medium text-text-dark transition-all hover:bg-primary-orange/5 hover:text-primary-orange"
                      onClick={closeMenus}
                    >
                      AI Chat Assistant
                    </Link>
                  </li>
                </ul>
              ) : null}
            </div>

            {isAuthenticated ? (
              <div className="ml-auto flex items-center space-x-3">
                <Link
                  to="/notifications"
                  className="group relative rounded-xl p-1.5 transition-colors hover:bg-light-accent"
                >
                  <svg
                    className="h-6 w-6 text-text-dark group-hover:text-primary-orange"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    3
                  </span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-2 -mr-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-orange to-orange-500 text-white font-bold shadow-lg transition-transform hover:scale-105">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-auto rounded-full bg-primary-orange px-6 py-2.5 font-medium text-white shadow-soft transition-all duration-300 hover:bg-orange-400 hover:shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 transition-colors duration-300 hover:bg-light-accent/50 md:hidden"
            onClick={() => setIsOpen((current) => !current)}
          >
            <svg className="h-6 w-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {isOpen ? (
          <div className="pb-4 md:hidden">
            <div className="space-y-1 pb-6 pt-2">
              <Link to="/" className={mobileNavLinkClass} onClick={closeMenus}>
                Home
              </Link>
              <Link to="/browse" className={mobileNavLinkClass} onClick={closeMenus}>
                Browse Pets
              </Link>
              {isAuthenticated ? (
                <Link to="/dashboard" className={mobileNavLinkClass} onClick={closeMenus}>
                  Dashboard
                </Link>
              ) : null}
              <Link to="/lost-pets" className={mobileNavLinkClass} onClick={closeMenus}>
                Lost Pets
              </Link>
              <Link to="/adoption" className={mobileNavLinkClass} onClick={closeMenus}>
                Adoption
              </Link>
              <Link to="/add-pet" className={mobileNavLinkClass} onClick={closeMenus}>
                Report Pet
              </Link>
              <Link to="/map" className={mobileNavLinkClass} onClick={closeMenus}>
                Map
              </Link>

              <div>
                <button
                  type="button"
                  onClick={() => setShowAITools((current) => !current)}
                  className="flex w-full items-center justify-between border-l-4 border-transparent px-4 py-3 text-left font-medium text-text-dark hover:border-primary-orange hover:text-primary-orange"
                >
                  <span>AI Tools</span>
                  <svg
                    className={`h-5 w-5 transition-transform ${showAITools ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showAITools ? (
                  <div className="mx-4 mt-1 rounded-r-xl border-r-2 border-primary-orange/30 bg-light-accent/30 py-2 pl-8 space-y-2">
                    <Link
                      to="/ai/image-search"
                      className="block py-2 pl-4 pr-8 text-sm text-text-dark/80 transition-colors hover:text-primary-orange"
                      onClick={closeMenus}
                    >
                      Image Similarity Search
                    </Link>
                    <Link
                      to="/breed-detect"
                      className="block py-2 pl-4 pr-8 text-sm text-text-dark/80 transition-colors hover:text-primary-orange"
                      onClick={closeMenus}
                    >
                      Breed Detection
                    </Link>
                    <Link
                      to="/health"
                      className="block py-2 pl-4 pr-8 text-sm text-text-dark/80 transition-colors hover:text-primary-orange"
                      onClick={closeMenus}
                    >
                      Pet Health (Disease Prediction)
                    </Link>
                    <Link
                      to="/ai/chat"
                      className="block py-2 pl-4 pr-8 text-sm text-text-dark/80 transition-colors hover:text-primary-orange"
                      onClick={closeMenus}
                    >
                      AI Chat Assistant
                    </Link>
                  </div>
                ) : null}
              </div>

              {isAuthenticated ? (
                <div className="border-t border-gray-200 px-4 pt-4">
                  <Link
                    to="/notifications"
                    className="flex items-center space-x-3 border-l-4 border-transparent py-3 font-medium text-text-dark transition-colors hover:border-primary-orange hover:text-primary-orange"
                    onClick={closeMenus}
                  >
                    <div className="relative">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        3
                      </span>
                    </div>
                    <span>Notifications</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="group flex items-center space-x-3 border-l-4 border-transparent py-3 font-medium text-text-dark transition-all hover:border-primary-orange hover:text-primary-orange"
                    onClick={closeMenus}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-orange to-orange-500 text-white font-bold shadow-lg transition-transform group-hover:scale-105">
                      {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="font-semibold">{currentUser?.role || 'User'}</span>
                  </Link>
                  <button
                    type="button"
                    className="w-full rounded-2xl bg-primary-orange px-6 py-4 text-center text-lg font-bold text-white shadow-soft transition-all duration-300 hover:bg-orange-400 hover:shadow-lg"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 px-4 pt-4">
                  <Link
                    to="/login"
                    className="block w-full rounded-2xl bg-primary-orange px-6 py-4 text-center text-lg font-bold text-white shadow-soft transition-all duration-300 hover:bg-orange-400 hover:shadow-lg"
                    onClick={closeMenus}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
