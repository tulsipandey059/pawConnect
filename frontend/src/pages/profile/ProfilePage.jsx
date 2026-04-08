 import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePets } from '../../context/PetContext';
import PetCard from '../../components/pets/PetCard';
import { mockAdoptionRequests } from '../../utils/mockData';

const ProfilePage = () => {
  const { currentUser, login, logout } = useAuth();
  const navigate = useNavigate();
  const { pets } = usePets();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Mock user reports
  const myReports = [
    { id: 1, petName: 'Tommy the Labrador', status: 'Lost', date: '2024-01-15' },
    { id: 2, petName: 'Stray Kitten', status: 'Found', date: '2024-01-14' },
    { id: 3, petName: 'Bella', status: 'Lost', date: '2024-01-13' },
  ];

  const ownerId = currentUser?.id ?? currentUser?._id;
  const myPets = pets.filter((pet) => {
    if (ownerId && pet.ownerId?.toString() === ownerId.toString()) {
      return true;
    }

    if (currentUser?.email && pet.ownerEmail === currentUser.email) {
      return true;
    }

    return false;
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '',
        address: currentUser.address || '',
      });
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...currentUser, ...formData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    login(updatedUser);
    setEditMode(false);
  };

  if (!currentUser) {
    return <div className="text-center py-20">Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-warm-beige py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* LEFT - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-orange to-orange-500 mx-auto flex items-center justify-center overflow-hidden">
                  <span className="text-3xl text-white font-bold">{currentUser.name.charAt(0).toUpperCase()}</span>
                </div>
                <h1 className="text-lg font-semibold text-text-dark mt-3">{currentUser.name}</h1>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
                <span className="inline-block text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full mx-auto mt-2">
                  {currentUser.role === 'owner' ? 'Pet Owner' : currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </span>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {editMode && (
              <div className="mt-6 bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold text-text-dark mb-4">Edit Profile</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary-orange text-white py-3 px-6 rounded-lg font-bold hover:bg-orange-500 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT - Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Pets */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold text-text-dark mb-6">My Pets</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myPets.length > 0 ? (
                  myPets.map(pet => (
                    <PetCard key={pet.id} pet={pet} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <span className="text-6xl mb-4 block">🐕</span>
                    <p className="text-xl text-text-dark/50">No pets yet. <Link to="/add-pet" className="text-primary-orange hover:underline font-medium">Add your first pet</Link></p>
                  </div>
                )}
              </div>
            </div>

            {/* My Reports */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold text-text-dark mb-6">My Reports</h2>
              <div className="space-y-4">
                {myReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-text-dark">{report.petName}</h4>
                      <p className="text-sm text-gray-500">{report.status}</p>
                    </div>
                    <span className="text-sm text-gray-600">{report.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold text-text-dark mb-6">Account Settings</h2>
              <div className="space-y-4">
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Update Profile Information
                </button>
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-left p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all font-medium flex items-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Adoption Applications */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold text-text-dark mb-6">Adoption Applications</h2>
              <div className="space-y-4">
                {mockAdoptionRequests.map(app => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-text-dark">{app.petName}</h4>
                      <p className="text-sm text-gray-500">{app.status}</p>
                    </div>
                    <span className="text-sm font-medium">{app.applicant}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

