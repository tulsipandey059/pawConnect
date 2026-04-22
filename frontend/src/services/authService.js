import apiClient, { API_BASE } from "./api";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../utils/authStorage";

const extractToken = (response) => response?.token || response?.data?.token || "";

const authService = {
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);

    const token = extractToken(response);
    if (token) {
      setStoredToken(token);
    } else if (response?.success) {
      throw new Error("Authentication succeeded, but no token was returned.");
    }

    return response;
  },

  login: async (userData) => {
    const response = await apiClient.post("/auth/login", userData);

    const token = extractToken(response);
    if (token) {
      setStoredToken(token);
    } else if (response?.success) {
      throw new Error("Authentication succeeded, but no token was returned.");
    }

    return response;
  },

  logout: () => {
    clearStoredToken();
  },

  getMe: async () => {
    if (!getStoredToken()) {
      throw new Error("No active session found.");
    }

    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${getStoredToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  },
};

export default authService;
