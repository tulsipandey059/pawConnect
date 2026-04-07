import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Topbar from '../../components/layout/Topbar';
import Sidebar from '../../components/layout/Sidebar';
import DesktopSidebar from '../../components/layout/DesktopSidebar';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();

  const renderDashboard = () => {
    if (!currentUser?.role) {
      return <div className="text-center py-20 text-text-dark text-xl font-semibold">Loading your dashboard...</div>;
    }

    // Dummy data for all roles
    const dummyPets = [
      { id: 1, name: 'Max', breed: 'Golden Retriever', status: 'Lost', image: '/src/assets/images/pets/placeholder.jpg', location: 'Central Park' },
      { id: 2, name: 'Luna', breed: 'Siamese Cat', status: 'Found', image: '/src/assets/images/pets/placeholder.jpg', location: 'Main Street' },
      { id: 3, name: 'Buddy', breed: 'Labrador', status: 'Lost', image: '/src/assets/images/pets/placeholder.jpg', location: 'School Area' },
    ];

    const dummyRequests = [
      { id: 1, pet: 'Buddy', applicant: 'John Doe', status: 'Pending', type: 'Adoption' },
      { id: 2, pet: 'Bella', applicant: 'Jane Smith', status: 'Approved', type: 'Rescue' },
      { id: 3, pet: 'Charlie', applicant: 'Mike Johnson', status: 'Rejected', type: 'Adoption' },
    ];

    const dummyMatches = [
      { name: 'Perfect match for Max', similarity: 95, location: '2km away', breed: 'Golden Retriever' },
      { name: 'Good match for Luna', similarity: 82, location: '5km away', breed: 'Siamese' },
      { name: 'Possible match for Buddy', similarity: 70, location: '1km away', breed: 'Labrador Mix' },
    ];

    const dummyTasks = [
      { id: 1, title: 'Help find lost Golden Retriever', location: 'Central Park', status: 'Active' },
      { id: 2, title: 'Check on found Siamese cat', location: 'Main Street', status: 'Completed' },
    ];

    const getRoleColor = (role) => {
      const colors = {
        owner: 'bg-blue-100 text-blue-800',
        ngo: 'bg-green-100 text-green-800',
        volunteer: 'bg-orange-100 text-orange-800',
        admin: 'bg-purple-100 text-purple-800',
      };
      return colors[role] || 'bg-gray-100 text-gray-800';
    };

    const roleTitle = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1).toLowerCase() + ' Dashboard';

    if (currentUser.role === 'owner') {
      return (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h1 className="text-3xl font-bold text-text-dark mb-2">{roleTitle}</h1>
            <p className="text-lg text-text-dark/60">Manage your pets, report sightings, and view AI matches</p>
          </div>

          {/* Report Lost Pet Form */}
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6 flex items-center">
              <span className="mr-3">🐕</span>
              Report Lost Pet
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <input className="p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none placeholder:text-gray-400" placeholder="Pet Name" />
              <input className="p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none placeholder:text-gray-400" placeholder="Breed / Type" />
              <input className="p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none placeholder:text-gray-400" placeholder="Last Location" />
              <input className="md:col-span-2 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-orange outline-none placeholder:text-gray-400" placeholder="Description" />
              <div className="md:col-span-3" />
              <button className="md:col-span-3 bg-primary-orange text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all shadow-lg hover:shadow-xl w-full md:w-auto">
                🚨 Report Lost Pet
              </button>
            </div>
          </div>

          {/* My Pets List */}
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6 flex items-center">
              <span className="mr-3">🐾</span>
              My Pets ({dummyPets.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyPets.map((pet) => (
                <div key={pet.id} className="group hover:shadow-xl transition-all rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-6 border border-gray-200">
                  <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <span className="text-4xl">🐕</span>
                  </div>
                  <h3 className="font-bold text-xl text-text-dark mb-2">{pet.name}</h3>
                  <p className="text-text-dark/70 mb-2">{pet.breed}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pet.status === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {pet.status}
                  </span>
                  <p className="text-sm text-text-dark/50 mt-2">{pet.location}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Match Results */}
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6 flex items-center">
              <span className="mr-3">🤖</span>
              AI Match Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyMatches.map((match, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4">
                      {match.similarity}%
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark">{match.name}</h4>
                      <p className="text-sm text-text-dark/70">{match.breed}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-dark/60 mb-4">{match.location}</p>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl font-medium text-sm transition-all">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-6 px-8 rounded-2xl font-bold text-xl transition-all shadow-sm hover:shadow-md">
                🐈 Report Found Pet
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button className="w-full bg-primary-orange text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-orange-500 transition-all shadow-lg hover:shadow-xl">
                📞 Emergency Call
              </button>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Recent Notifications</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              <div className="flex items-start space-x-4 p-4 bg-primary-orange/10 border-l-4 border-primary-orange rounded-r-xl">
                <div className="w-12 h-12 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 mt-1">!</div>
                <div>
                  <p className="font-semibold text-text-dark">New match found for Max</p>
                  <p className="text-sm text-text-dark/70">95% similarity - Golden Retriever sighted 2km away</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 mt-1">📞</div>
                <div>
                  <p className="font-semibold text-text-dark">Volunteer contacted you</p>
                  <p className="text-sm text-text-dark/70">Sarah Wilson wants to help search for Luna</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    } else if (currentUser.role === 'ngo') {
      return (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h1 className="text-3xl font-bold text-text-dark mb-2">{roleTitle}</h1>
            <p className="text-lg text-text-dark/60">Manage rescue operations and adoptions</p>
          </div>

          {/* Nearby Lost Pets */}
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6 flex items-center">
              <span className="mr-3">🐕</span>
              Nearby Lost Pets (5)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyPets.slice(0, 3).map((pet) => (
                <div key={pet.id} className="group hover:shadow-xl transition-all rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-6 border border-gray-200">
                  <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <span className="text-4xl">🐕</span>
                  </div>
                  <h3 className="font-bold text-xl text-text-dark mb-2">{pet.name}</h3>
                  <p className="text-text-dark/70 mb-2">{pet.breed}</p>
                  <p className="text-sm text-text-dark/50">{pet.location}</p>
                  <button className="w-full mt-4 bg-primary-orange text-white py-2 px-4 rounded-xl font-medium hover:bg-orange-500 transition-all">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Requests Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rescue Requests */}
            <div className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-xl font-bold text-text-dark mb-6">Rescue Requests (3)</h3>
              <div className="space-y-4">
                {dummyRequests.slice(0,2).map((req) => (
                  <div key={req.id} className="p-4 bg-gray-50 rounded-xl border-l-4 border-orange-400 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{req.pet}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        req.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-dark/70">{req.applicant}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 bg-green-500 text-white text-sm py-1.5 px-3 rounded-lg hover:bg-green-600 font-medium">
                        Assign Volunteer
                      </button>
                      <button className="flex-1 bg-gray-500 text-white text-sm py-1.5 px-3 rounded-lg hover:bg-gray-600 font-medium">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Management */}
            <div className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-xl font-bold text-text-dark mb-6">Active Cases (2)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-text-dark/70">Lost Pets</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-text-dark/70">Rescued</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">4</div>
                  <div className="text-sm text-text-dark/70">Pending</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-text-dark/70">Reunited</div>
                </div>
              </div>
            </div>
          </div>

          {/* Adoption Requests */}
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6 flex items-center">
              <span className="mr-3">❤️</span>
              Adoption Requests ({dummyRequests.length})
            </h2>
            <div className="space-y-4">
              {dummyRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border shadow-sm hover:shadow-md transition-all">
                  <div className="flex-1">
                    <div className="font-bold text-lg text-text-dark">{req.pet}</div>
                    <div className="text-sm text-text-dark/70">{req.applicant}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600 text-sm">
                      Approve
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 text-sm">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    } else if (currentUser.role === 'volunteer') {
      return (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h1 className="text-3xl font-bold text-text-dark mb-2">{roleTitle}</h1>
            <p className="text-lg text-text-dark/60">Help find lost pets in your area</p>
          </div>

          {/* Nearby Pets */}
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6 flex items-center">
              <span className="mr-3">📍</span>
              Nearby Lost & Found Pets ({dummyPets.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyPets.map((pet) => (
                <div key={pet.id} className="relative group">
                  <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all overflow-hidden shadow-lg">
                    <span className="text-5xl drop-shadow-lg">{pet.status === 'Lost' ? '🐕' : '🐈'}</span>
                  </div>
                  <div className="p-4 bg-white rounded-b-2xl -mt-4 shadow-lg">
                    <h4 className="font-bold text-lg text-text-dark mb-1">{pet.name}</h4>
                    <p className="text-sm text-text-dark/70 mb-2">{pet.breed}</p>
                    <div className="flex gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        pet.status === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {pet.status}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded-full font-medium">1.2km</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-primary-orange text-white text-sm py-2 px-3 rounded-xl font-medium hover:bg-orange-500">
                        I Found It
                      </button>
                      <button className="flex-1 bg-blue-500 text-white text-sm py-2 px-3 rounded-xl font-medium hover:bg-blue-600">
                        Help Search
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Tasks */}
            <div className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-xl font-bold text-text-dark mb-6">Assigned Tasks ({dummyTasks.length})</h3>
              <div className="space-y-4">
                {dummyTasks.map((task) => (
                  <div key={task.id} className="p-5 bg-gradient-to-r from-emerald-50 to-green-100 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all">
                    <h4 className="font-bold text-lg text-text-dark mb-2">{task.title}</h4>
                    <p className="text-sm text-text-dark/70 mb-3">{task.location}</p>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-sm font-medium">
                        {task.status}
                      </span>
                      <button className="ml-auto bg-emerald-500 text-white px-4 py-1.5 rounded-xl font-medium text-sm hover:bg-emerald-600">
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 bg-primary-orange text-white py-3 px-6 rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all shadow-lg">
                + Accept New Request
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-xl font-bold text-text-dark mb-6">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
                  <div className="text-3xl font-bold text-orange-600">8</div>
                  <div className="text-text-dark/70 font-medium mt-1">Pets Found</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600">15</div>
                  <div className="text-text-dark/70 font-medium mt-1">Hours Helped</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600">4.9⭐</div>
                  <div className="text-text-dark/70 font-medium mt-1">Rating</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-600">12km</div>
                  <div className="text-text-dark/70 font-medium mt-1">Coverage</div>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-primary-orange to-orange-500 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all">
                Update Profile
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button className="w-full bg-green-500 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl">
                🗺️ Open Map
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button className="w-full bg-blue-500 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl">
                📞 Emergency Call
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
              <button className="w-full bg-primary-orange text-white py-6 px-8 rounded-2xl font-bold text-xl hover:bg-orange-500 transition-all shadow-lg hover:shadow-xl">
                Find Tasks
              </button>
            </div>
          </div>
        </div>
      );

    } else {
      return (
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-text-dark mb-4">Access Denied</h1>
          <p className="text-xl text-text-dark/60 mb-8">Role '{currentUser.role}' dashboard not available</p>
          <span className={`inline-block px-6 py-2 rounded-full text-lg font-bold ${getRoleColor(currentUser.role)}`}>
            {currentUser.role}
          </span>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-warm-beige">
      {/* Permanent desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 shrink-0">
        <DesktopSidebar />
      </div>

      {/* Content */}
        <div className="flex-1 min-h-screen">
          <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-4 z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl fixed top-4 left-4 mt-16"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="pt-24 lg:pt-4 p-6 lg:p-8">
            {renderDashboard()}
          </div>
        </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
        </>
      )}
    </div>
  );
};

export default Dashboard;

