import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Proper async user fetch
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await authService.getMe();

        if (res.success) {
          setCurrentUser(res.user);
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("token");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);

      if (result.success) {
        setCurrentUser(result.user);
        window.dispatchEvent(new CustomEvent('login', { detail: result.user }));
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);

      if (result.success) {
        setCurrentUser(result.user);
        window.dispatchEvent(new CustomEvent('login', { detail: result.user }));
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    authService.logout();
    setCurrentUser(null);
    window.dispatchEvent(new CustomEvent('logout'));
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;