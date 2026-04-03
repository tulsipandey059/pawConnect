// Mock Auth Service - LocalStorage based simulation
// No backend dependency

import api from './api.js';

export const authService = {
  login: async (credentials) => {
    const result = await api.post('/auth/login', credentials);
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
    }
    return result;
  },

  register: async (userData) => {
    const result = await api.post('/auth/register', userData);
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
    }
    return result;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    return { success: true };
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  getMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const response = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) return null;
    const data = await response.json();
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    return data.user;
  }
};

export default authService;
