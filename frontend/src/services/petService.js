// Mock Pet Service - Uses local data + localStorage
// No backend dependency

import { petsData } from '../data/pets.js';

let petsCache = JSON.parse(localStorage.getItem('pets')) || petsData;

export const petService = {
  getPets: async () => {
    // Load from localStorage or fallback to data
    const cached = JSON.parse(localStorage.getItem('pets') || '[]');
    if (cached.length > 0) {
      return cached;
    }
    return petsData;
  },

  createPet: async (petData) => {
    const petName = petData.name || petData.petName || `${petData.species || 'Pet'} report`;
    const newPet = { 
      id: Date.now(), 
      ...petData, 
      name: petName,
      image: petData.image ? URL.createObjectURL(petData.image) : 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(petName),
      createdAt: new Date().toISOString()
    };
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    petsCache = [newPet, ...petsCache.slice(0, 49)]; // Keep top 50
    localStorage.setItem('pets', JSON.stringify(petsCache));
    
    return newPet;
  },
};

export default petService;
