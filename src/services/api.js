// Mock API client for frontend-only mode
// Returns static mock data to simulate backend responses

const mockApiClient = {
  get: async (endpoint) => {
    console.log(`Mock GET ${endpoint}`);
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    if (endpoint === '/pets') {
      const { petsData } = await import('../data/pets.js');
      return { pets: petsData };
    }
    if (endpoint.includes('/auth')) {
      return { user: { id: 1, name: 'Mock User', email: 'user@example.com', role: 'user' }, token: 'mock-token' };
    }
    return { data: [] };
  },
  
  post: async (endpoint, data) => {
    console.log(`Mock POST ${endpoint}`, data);
    await new Promise(resolve => setTimeout(resolve, 800));
    if (endpoint.includes('/pets')) {
      const { petsData } = await import('../data/pets.js');
      const newPet = { id: Date.now(), ...data, image: 'https://via.placeholder.com/400x300?text=New+Pet' };
      localStorage.setItem('pets', JSON.stringify([newPet, ...petsData]));
      return newPet;
    }
    if (endpoint.includes('/auth')) {
      return { success: true, user: { id: 1, name: data.name || 'Mock User', email: data.email }, token: 'mock-token' };
    }
    return { success: true };
  },
};

export default mockApiClient;
