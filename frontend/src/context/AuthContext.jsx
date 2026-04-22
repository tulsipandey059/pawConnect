import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from "../services/authService";
import {
  AUTH_EXPIRED_EVENT,
  clearStoredToken,
  getStoredToken,
} from '../utils/authStorage';

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
        const token = getStoredToken();

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
        clearStoredToken();
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      clearStoredToken();
      setCurrentUser(null);
      setLoading(false);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
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

  const updateCurrentUser = (userData) => {
    setCurrentUser(userData);
    window.dispatchEvent(new CustomEvent('login', { detail: userData }));
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateCurrentUser,
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
