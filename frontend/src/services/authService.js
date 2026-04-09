import apiClient, { API_BASE } from "./api";

// AUTH SERVICE
const authService = {
  // REGISTER
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    return response;
  },

  // LOGIN
  login: async (userData) => {
    const response = await apiClient.post("/auth/login", userData);

    // ✅ store token if backend sends it
    if (response.token) {
      localStorage.setItem("token", response.token);
    }

    return response;
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem("token");
  },

  // GET CURRENT USER
  getMe: async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });

    if (!response.ok) throw new Error("Failed to fetch user");

    return response.json();
  },
};

export default authService;
