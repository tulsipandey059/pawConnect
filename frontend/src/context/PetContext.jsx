import React, { createContext, useContext, useState, useEffect } from 'react';
import petService from '../services/petService.js';

const PetContext = createContext();

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const fetchedPets = await petService.getPets();
        setPets(fetchedPets);
        setError(null);
      } catch (err) {
        console.error('Failed to load pets:', err);
        setError('Using mock fallback data');
        // Fallback to static data
        const { petsData } = await import('../data/pets.js');
        setPets(petsData);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const addPet = async (petData) => {
    try {
      const newPet = await petService.createPet(petData);
      setPets(prevPets => [newPet, ...prevPets]);
      return newPet;
    } catch (err) {
      console.error('Failed to add pet:', err);
      throw err;
    }
  };

  const getPetById = (id) => {
    return pets.find(
      (pet) =>
        String(pet.id) === String(id) || String(pet._id || '') === String(id)
    );
  };

  const value = {
    pets,
    loading,
    error,
    addPet,
    getPetById,
    refetchPets: () => {/* implement if needed */}
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
};

export default PetContext;
