import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-orange/10 mt-auto">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
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
              <a href="https://instagram.com/pawconnect" className="w-10 h-10 bg-primary-orange/20 rounded-full flex items-center justify-center hover:bg-primary-orange/40 hover:scale-110 transition-all duration-300" title="Instagram">
                <svg className="w-5 h-5 text-primary-orange" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689.046 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.046 4.354-.2 6.782-2.618 6.979-6.98.075-1.317.048-1.724-.046-4.946-.2-4.358-2.58-6.78-6.979-6.98-1.283-.059-1.69-.073-4.948-.046zm0 5.838c2.633 0 4.66-2.027 4.66-4.538s-2.027-4.538-4.66-4.538-4.66 2.027-4.66 4.538 2.027 4.538 4.66 4.538zm0 1.391c-2.566-0.043-4.656-2.104-4.656-4.701 0-2.597 2.09-4.701 4.656-4.701 2.597 0 4.656 2.09 4.656 4.701 0 2.597-2.09-4.701-4.656-4.701-2.566 0-4.656 2.104-2.566 4.701z"/></svg>
              </a>
              <a href="https://x.com/pawconnect" className="w-10 h-10 bg-primary-orange/20 rounded-full flex items-center justify-center hover:bg-primary-orange/40 hover:scale-110 transition-all duration-300" title="X">
                <svg className="w-5 h-5 text-primary-orange" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com/company/pawconnect" className="w-10 h-10 bg-primary-orange/20 rounded-full flex items-center justify-center hover:bg-primary-orange/40 hover:scale-110 transition-all duration-300" title="LinkedIn">
                <svg className="w-5 h-5 text-primary-orange" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 1 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h3.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/pets" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300 block">Browse Pets</Link></li>
              <li><Link to="/reports" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300 block">Lost Pets</Link></li>
              <li><Link to="/adoption" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300 block">Adoption</Link></li>
              <li><Link to="/add-pet" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300 block">Report Pet</Link></li>
              <li><Link to="/volunteer" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300 block">Volunteer</Link></li>
              <li><Link to="/rescue" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300 block">Rescue</Link></li>
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">AI Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/breed-detect" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300 block">Breed Detection</Link></li>
              <li><Link to="/pet-health" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300 block">Pet Health</Link></li>
              <li><Link to="/ai/chat" className="text-text-dark/70 hover:text-primary-orange transition-colors duration-300 block">AI Chat Assistant</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">Contact</h3>
            <ul className="space-y-2 text-text-dark/70">
              <li className="flex items-start space-x-2">
                <span>📧</span>
                <a href="mailto:hello@pawconnect.in" className="hover:text-primary-orange transition-colors">hello@pawconnect.in</a>
              </li>
              <li className="flex items-start space-x-2">
                <span>📞</span>
                <a href="tel:+919876543210" className="hover:text-primary-orange transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-start space-x-2">
                <span>📍</span>
                <span>Mumbai, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-orange/20 mt-8 pt-8 text-center">
          <p className="text-text-dark/60">© 2026 PawConnect India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
