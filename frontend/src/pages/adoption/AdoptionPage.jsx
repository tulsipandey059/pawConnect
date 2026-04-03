import React from 'react';
import PetCard from '../../components/pets/PetCard';
import { usePets } from '../../context/PetContext';

const AdoptionPage = () => {
  const { pets } = usePets();
  const adoptionPets = pets.filter(pet => pet.status === 'adoption');

  return (
    <div className="min-h-screen bg-warm-beige py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-orange to-orange-500 bg-clip-text text-transparent mb-6">
            Pet Adoption
          </h1>
          <p className="text-xl text-text-dark/70 max-w-2xl mx-auto mb-12">
            Find your perfect companion. Every pet deserves a loving home.
          </p>
        </div>

        {adoptionPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {adoptionPets.map((pet) => (
              <div key={pet.id} className="group relative">
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">No pets available for adoption</h3>
            <p className="text-text-dark/60 mb-8">Check back soon for new arrivals.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionPage;

