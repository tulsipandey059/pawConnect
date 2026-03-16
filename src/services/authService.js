// Auth Service
import apiClient from './api.js';

export const authService = {
  login: async (credentials) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, user: { id: 1, name: 'Test User', role: 'petOwner' } };
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, user: { ...userData, id: Date.now() } };
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  getCurrentUser: async () => {
    return localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
  }
};

export default authService;

