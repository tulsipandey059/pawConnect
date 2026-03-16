import React from 'react';
import MapComponent from '../../components/maps/MapComponent';
import SearchBar from '../../components/search/SearchBar';
import PetCard from '../../components/pets/PetCard';
import { petsData } from '../../data/pets';

const MapPage = () => {
  const nearbyPets = petsData.slice(0, 6);

  const handleSearch = (query) => {
    console.log('Map search:', query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Pet Map
          </h1>
          <p className="text-xl text-text-dark/70 max-w-3xl mx-auto">
            See pets and sightings near you in real-time
          </p>
          <SearchBar onSearch={handleSearch} placeholder="Search by location or pet name..." />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-3">
            <MapComponent pets={petsData} height="600px" />
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-soft sticky top-6">
              <h3 className="text-xl font-bold text-text-dark mb-6">Nearby Alerts ({nearbyPets.length})</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {nearbyPets.map((pet) => (
                  <div key={pet.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <PetCard pet={pet} className="h-auto" />
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

export default MapPage;

