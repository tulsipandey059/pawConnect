// Placeholder Map Component
// Install: npm install react-leaflet @types/leaflet
import React from 'react';

const MapComponent = ({ center = [19.0760, 72.8777], zoom = 12, height = '400px', pets = [] }) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-soft bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100">
      <div className="h-[400px] w-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-1">Map View</h3>
            <p className="opacity-90">Location-based pet alerts</p>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="font-semibold text-text-dark">{pets.length} pets nearby</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;

