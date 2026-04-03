// AI Service for breed detection, disease prediction, pet matching
import { petsData } from '../data/pets.js';
import apiClient from './api.js';

export const aiService = {
  detectBreed: async (imageFile) => {
    // Mock AI response
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      breed: 'Golden Retriever (95%)',
      confidence: 0.95,
      similarBreeds: ['Labrador', 'German Shepherd']
    };
  },

  predictDisease: async (imageFile, symptoms = []) => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return {
      success: true,
      predictions: [
        { disease: 'Skin Allergy', confidence: 0.87 },
        { disease: 'Ear Infection', confidence: 0.65 }
      ],
      recommendation: 'Consult vet immediately for skin allergy treatment'
    };
  },

  chat: async (message) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      response: 'Based on your description, this sounds like a flea allergy. I recommend checking for fleas and consulting a vet.',
      sources: ['Veterinary Dermatology Journal']
    };
  },

  checkSimilarPets: async (imageFile, reportType = 'lost') => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Filter relevant pets for matching
    let candidates = petsData.filter(pet => {
      if (reportType === 'found') {
        // For found reports, match against LOST pets
        return pet.status === 'Lost';
      } else {
        // For lost reports, match against FOUND or Adoption pets
        return pet.status === 'Found' || pet.status === 'Adoption';
      }
    });

    // Mock similarity scores (in real app, use actual AI vision model)
    const matches = candidates.slice(0, 4).map((pet, index) => ({
      ...pet,
      similarity: 95 - (index * 5), // 95%, 90%, 85%, 80%
      matchReason: index === 0 ? 'High visual similarity - same breed and color pattern' :
                   index === 1 ? 'Similar breed and size' :
                   index === 2 ? 'Location proximity match' :
                   'General similarity detected'
    }));

    return {
      success: true,
      matches,
      message: `Found ${matches.length} potential matches. Review details to see if any belong to your pet!`
    };
  }
};

export default aiService;

