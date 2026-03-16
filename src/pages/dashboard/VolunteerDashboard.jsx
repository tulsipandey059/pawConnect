import React from 'react';
import { mockRescueRequests, mockVolunteers } from '../../utils/mockData';

const VolunteerDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Nearby Rescue Requests */}
      <div className="bg-white rounded-3xl shadow-soft p-8">
        <h3 className="text-2xl font-bold text-text-dark mb-6">Nearby Rescue Requests</h3>
        <div className="space-y-4">
          {mockRescueRequests.map(req => (
            <div key={req.id} className="flex items-center p-6 bg-gradient-to-r from-primary-orange/5 to-orange-500/5 rounded-2xl border border-primary-orange/20">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-orange/10 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">🚨</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark">{req.title}</h4>
                <p className="text-text-dark/70">{req.location}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                req.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Preview */}
      <div className="bg-white rounded-3xl shadow-soft p-8">
        <h3 className="text-2xl font-bold text-text-dark mb-6">Rescue Alerts Map</h3>
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <span className="text-5xl mb-4 block">🗺️</span>
            <p className="text-xl text-text-dark/70">Interactive map coming soon</p>
            <p className="text-sm text-text-dark/50">3 alerts within 5km</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
          <div className="text-3xl font-bold text-primary-orange">2</div>
          <div className="text-text-dark/70 mt-1">Active Tasks</div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
          <div className="text-3xl font-bold text-green-600">12</div>
          <div className="text-text-dark/70 mt-1">Completed</div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">5km</div>
          <div className="text-text-dark/70 mt-1">Coverage Radius</div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600">4.9</div>
          <div className="text-text-dark/70 mt-1">Rating</div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

