// Mock Auth Service - LocalStorage based simulation
// No backend dependency

export const authService = {
  login: async (credentials) => {
    try {
      // Simulate validation
      if (credentials.email === 'demo@pawconnect.com' && credentials.password === 'demo123') {
        const mockUser = { 
          id: 1, 
          name: 'Demo User', 
          email: credentials.email, 
          role: 'user' 
        };
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        return { success: true, user: mockUser, token: 'mock-jwt-token' };
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      // Simulate registration
      const mockUser = { 
        id: Date.now(), 
        ...userData,
        role: 'user'
      };
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      return { success: true, user: mockUser, token: 'mock-jwt-token' };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    return { success: true };
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
