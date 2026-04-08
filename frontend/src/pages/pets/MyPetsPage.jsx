import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';
import PetCard from '../../components/pets/PetCard';

const MyPetsPage = () => {
  const { currentUser } = useAuth();
  const { pets } = usePets();

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

  return (
    <div className="min-h-screen bg-warm-beige py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-dark mb-4">My Pets</h1>
          <p className="text-lg text-text-dark/60 max-w-2xl mx-auto">
            All pets and reports connected to your account live here.
          </p>
        </div>

        {myPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-soft p-12 text-center">
            <div className="text-5xl mb-4">Pet</div>
            <h2 className="text-2xl font-bold text-text-dark mb-3">No pets added yet</h2>
            <p className="text-text-dark/60 mb-8">
              Once you report or add a pet, it will appear here instead of the general browse page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/report-lost"
                className="bg-primary-orange text-white px-6 py-3 rounded-2xl font-semibold hover:bg-orange-500 transition-all"
              >
                Report Lost Pet
              </Link>
              <Link
                to="/add-pet"
                className="bg-white text-text-dark border border-gray-200 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
              >
                Add a Pet
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPetsPage;
