import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';
import PetCard from '../../components/pets/PetCard';

const ProfilePage = () => {
  const { currentUser, login } = useAuth();
  const { pets } = usePets();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

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
    // Update localStorage and context
    const updatedUser = { ...currentUser, ...formData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    login(updatedUser);
    setEditMode(false);
  };

  const myPets = pets.filter(p => p.ownerId === (currentUser?.id || 2)); // mock ownerId 2 for petOwner

  return (
    <div className="min-h-screen bg-warm-beige py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-soft p-10 text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-primary-orange rounded-full mb-6 mx-auto shadow-2xl">
            <span className="text-5xl text-white font-bold">{currentUser?.name?.charAt(0) || 'U'}</span>
          </div>
          <h1 className="text-4xl font-bold text-text-dark mb-2">{currentUser?.name}</h1>
          <p className="text-xl text-text-dark/70 mb-1">{currentUser?.role}</p>
          <p className="text-lg text-text-dark/60">{currentUser?.email}</p>
          <button
            onClick={() => setEditMode(!editMode)}
            className="mt-6 bg-primary-orange text-white px-8 py-3 rounded-2xl font-semibold hover:bg-orange-400 transition-all"
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editMode && (
          <div className="bg-white rounded-3xl shadow-soft p-10">
            <h2 className="text-2xl font-bold text-text-dark mb-8">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-3">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-3">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-3">Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-3">Address</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all text-lg"
                  placeholder="e.g. Andheri, Mumbai"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-orange to-orange-500 text-white py-4 px-8 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Pets & Reports */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-text-dark mb-6">My Pets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myPets.map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))}
              {myPets.length === 0 && (
                <div className="text-center py-12 col-span-full">
                  <span className="text-6xl mb-4 block">🐶</span>
                  <p className="text-xl text-text-dark/50">No pets added yet. <a href="/add-pet" className="text-primary-orange font-semibold hover:underline">Add your pet</a></p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-dark mb-6">Recent Reports</h2>
            <div className="space-y-4">
              {/* Mock reports */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="font-semibold text-text-dark mb-1">Lost: Tommy the Labrador</div>
                <div className="text-sm text-text-dark/70">Reported 2 days ago</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="font-semibold text-text-dark mb-1">Found: Stray kitten</div>
                <div className="text-sm text-text-dark/70">Reported yesterday</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl shadow-soft p-10">
          <h2 className="text-2xl font-bold text-text-dark mb-8">Settings</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-5 h-5 text-primary-orange rounded" />
                <span className="text-text-dark font-medium">Email notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-5 h-5 text-primary-orange rounded" checked />
                <span className="text-text-dark font-medium">SMS alerts for matches</span>
              </label>
            </div>
            <div className="space-y-4">
              <button className="w-full bg-red-100 text-red-700 py-3 px-6 rounded-xl font-medium hover:bg-red-200 transition-all">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

