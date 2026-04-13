// AI Service for breed detection, disease prediction, pet matching
import apiClient from './api.js';

const convertFileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
  });

const normalizeImageInput = async (imageInput) => {
  if (!imageInput) {
    return null;
  }

  if (typeof imageInput === 'string') {
    return imageInput;
  }

  return convertFileToBase64(imageInput);
};

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

  checkSimilarPets: async (imageInput, reportType = 'all', filters = {}) => {
    if (!imageInput) {
      return {
        success: true,
        matches: [],
        message: 'No image provided for similarity search.',
      };
    }

    const image = await normalizeImageInput(imageInput);

    return apiClient.post('/pets/similarity-search', {
      image,
      reportType: reportType || 'all',
      location: filters.location || '',
      type: filters.type || '',
      breed: filters.breed || '',
    });
  }
};

export default aiService;

