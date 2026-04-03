import React from 'react';
import { usePets } from '../../context/PetContext';
import { mockAdoptionRequests, mockVolunteers } from '../../utils/mockData';
import PetCard from '../../components/pets/PetCard';

const NGODashboard = () => {
  const { pets } = usePets();

  const adoptionPets = pets.filter(p => p.status === 'Adoption');

  return (
    <div className="space-y-8">
      {/* Manage Adoption Pets */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-text-dark">Adoption Pets ({adoptionPets.length})</h3>
          <button className="bg-primary-orange text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-400 transition-all">
            + Add New Pet
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adoptionPets.slice(0, 6).map(pet => (
            <div key={pet.id} className="relative group">
              <PetCard pet={pet} />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all bg-white/90 rounded-full p-2 shadow-lg">
                <span className="text-green-600">Edit</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adoption Requests & Volunteers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-soft p-8">
          <h3 className="text-2xl font-bold text-text-dark mb-6">New Adoption Requests</h3>
          <div className="space-y-4">
            {mockAdoptionRequests.map(req => (
              <div key={req.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">{req.petName}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    req.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <div className="text-sm text-text-dark/70">{req.applicant} • {req.date}</div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-green-100 text-green-800 py-1.5 px-3 rounded-lg text-sm hover:bg-green-200">
                    Approve
                  </button>
                  <button className="flex-1 bg-red-100 text-red-800 py-1.5 px-3 rounded-lg text-sm hover:bg-red-200">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-8">
          <h3 className="text-2xl font-bold text-text-dark mb-6">Available Volunteers</h3>
          <div className="space-y-3">
            {mockVolunteers.map(vol => (
              <div key={vol.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-primary-orange/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-orange">👤</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-text-dark">{vol.name}</div>
                  <div className="text-sm text-text-dark/70">{vol.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-text-dark">{vol.rating}</div>
                  <div className={`text-xs ${vol.available ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {vol.available ? 'Available' : 'Busy'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;

