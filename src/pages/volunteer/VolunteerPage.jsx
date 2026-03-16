import React, { useState } from 'react';
import PetCard from '../../components/pets/PetCard';
import { useAuth } from '../../context/AuthContext';

const VolunteerPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');

  // Mock data
  const mockRescueRequests = [
    {
      id: 1,
      title: 'Injured street dog - Bandra',
      description: 'Limping badly, needs immediate help',
      location: 'Bandra West, Mumbai',
      urgency: 'High',
      status: 'pending',
      petImage: 'https://images.unsplash.com/photo-1581578731548-61d927995cf5?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Stray kittens in drain',
      description: '3 kittens stuck, mother nearby',
      location: 'Andheri East',
      urgency: 'Medium',
      status: 'accepted',
      volunteerName: currentUser?.name || 'You'
    },
    {
      id: 3,
      title: 'Abandoned puppy',
      description: 'Very young, malnourished',
      location: 'Juhu Beach',
      urgency: 'High',
      status: 'completed'
    }
  ];

  const filteredRequests = mockRescueRequests.filter(req => req.status === activeTab);

  const handleAccept = (id) => {
    // Mock accept
    alert('Task accepted! Check your dashboard.');
  };

  return (
    <div className="min-h-screen bg-warm-beige py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">Volunteer Rescue Tasks</h1>
          <p className="text-xl text-text-dark/60 max-w-2xl mx-auto">
            Help animals in need. Accept rescue requests from your area.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-soft p-1 mb-8">
          <div className="flex bg-warm-beige rounded-2xl p-1">
            {['pending', 'accepted', 'completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-white shadow-sm text-primary-orange'
                    : 'text-text-dark/70 hover:text-text-dark'
                }`}
              >
                {tab === 'pending' ? '📋 Pending' :
                 tab === 'accepted' ? '✅ Accepted' :
                 '🎉 Completed'}
                {tab === 'pending' && ` (${mockRescueRequests.filter(r => r.status === 'pending').length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-6">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center">
              <span className="text-7xl mb-8 block">🚀</span>
              <h3 className="text-3xl font-bold text-text-dark mb-4">
                {activeTab === 'pending' ? 'No pending rescues' :
                 activeTab === 'accepted' ? "No accepted tasks" :
                 'No completed rescues'}
              </h3>
              <p className="text-xl text-text-dark/60 mb-8">
                {activeTab === 'pending' && "All caught up! Great job."}
              </p>
              <a href="/rescue" className="inline-flex items-center bg-primary-orange text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-400 transition-all">
                Find Rescue Requests
              </a>
            </div>
          ) : (
            filteredRequests.map(request => (
              <div key={request.id} className="bg-white rounded-3xl shadow-soft p-8 hover:shadow-xl transition-all">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                  <div className="flex-shrink-0">
                    <img
                      src={request.petImage}
                      alt={request.title}
                      className="w-32 h-32 object-cover rounded-2xl shadow-md"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-2xl font-bold text-text-dark">{request.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        request.urgency === 'High' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.urgency}
                      </span>
                    </div>
                    <p className="text-text-dark/70 mb-4 line-clamp-3">{request.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-text-dark/60 mb-6">
                      <span>📍 {request.location}</span>
                      <span>Reported 2h ago</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      >
                        Accept Rescue
                      </button>
                    )}
                    {request.status === 'accepted' && (
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-xl font-medium">
                        In Progress
                      </span>
                    )}
                    <button className="px-6 py-3 border-2 border-light-accent rounded-xl hover:border-primary-orange hover:bg-primary-orange/5 transition-all font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage;

