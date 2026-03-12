import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-warm-beige/95 backdrop-blur-sm shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🐾</span>
            </div>
            <span className="text-xl font-bold text-text-dark">PawConnect</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium"
            >
              Browse Pets
            </Link>
            <Link 
              to="/add-pet" 
              className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium"
            >
              Add Pet
            </Link>
            <Link 
              to="/health" 
              className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium"
            >
              Health Checker
            </Link>
            <Link 
              to="/breed-detect" 
              className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium"
            >
              Breed Detection
            </Link>
            <Link to="/signin" className="bg-primary-orange text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-400 transition-all duration-300 shadow-soft hover:shadow-lg">
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-light-accent/50 transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3 pt-2">
              <Link 
                to="/" 
                className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/browse" 
                className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Browse Pets
              </Link>
              <Link 
                to="/add-pet" 
                className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Add Pet
              </Link>
              <Link 
                to="/health" 
                className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Health Checker
              </Link>
              <Link 
                to="/breed-detect" 
                className="text-text-dark hover:text-primary-orange transition-colors duration-300 font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                Breed Detection
              </Link>
              <Link 
                to="/signin" 
                className="bg-primary-orange text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-400 transition-all duration-300 shadow-soft mx-4 text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

