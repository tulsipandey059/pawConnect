import React, { createContext, useContext, useState } from 'react';
import { petsData } from '../data/pets';

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

  React.useEffect(() => {
    setPets(petsData);
  }, []);

  const addPet = (petData) => {
    const newPet = {
      id: pets.length + 1,
      ...petData,
      // Set default values for missing fields
      gender: petData.gender || 'Unknown',
      distance: '0 km',
      tags: petData.tags || [],
      contact: petData.contact || '+91 98765 43210',
      // Ensure status is properly capitalized for filtering
      status: petData.status === 'adoption' ? 'Adoption' : 
              petData.status === 'lost' ? 'Lost' : 
              petData.status === 'found' ? 'Found' : petData.status
    };

    setPets(prevPets => [newPet, ...prevPets]);
    return newPet;
  };

  const getPetById = (id) => {
    return pets.find(pet => pet.id === parseInt(id));
  };

  const value = {
    pets,
    addPet,
    getPetById
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
};

export default PetContext;

