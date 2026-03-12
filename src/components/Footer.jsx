import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-orange/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🐾</span>
              </div>
              <span className="text-xl font-bold text-text-dark">PawConnect</span>
            </div>
            <p className="text-text-dark/70 mb-4 max-w-md">
              AI-powered pet recovery and adoption platform helping reunite lost pets with their families and finding loving homes for pets in need.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary-orange/20 rounded-full flex items-center justify-center hover:bg-primary-orange/40 transition-colors duration-300">
                <span className="text-primary-orange">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary-orange/20 rounded-full flex items-center justify-center hover:bg-primary-orange/40 transition-colors duration-300">
                <span className="text-primary-orange">📸</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary-orange/20 rounded-full flex items-center justify-center hover:bg-primary-orange/40 transition-colors duration-300">
                <span className="text-primary-orange">🐦</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
        <Link to="/browse" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300">
          Browse Pets
        </Link>
      </li>
      <li>
        <Link to="/health" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300">
          Pet Health
        </Link>
      </li>
      <li>
        <Link to="/breed-detect" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300">
          Breed Detection
        </Link>
      </li>
      <li>
        <Link to="/add-pet" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300">
                  Add Pet
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">Contact</h3>
            <ul className="space-y-2 text-text-dark/70">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <span>hello@pawconnect.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>Mumbai, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-orange/20 mt-8 pt-8 text-center text-text-dark/60">
          <p>© 2024 PawConnect India. All rights reserved. Made with ❤️ for pets everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

