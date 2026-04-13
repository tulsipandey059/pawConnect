import apiClient, { API_BASE } from "./api";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../utils/authStorage";

const authService = {
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    if (response.token) {
      setStoredToken(response.token);
    }
    return response;
  },

  login: async (userData) => {
    const response = await apiClient.post("/auth/login", userData);
    if (response.token) {
      setStoredToken(response.token);
    }
    return response;
  },

  logout: () => {
    clearStoredToken();
  },

  getMe: async () => {
    const token = getStoredToken();

    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  },
};

export default authService;
