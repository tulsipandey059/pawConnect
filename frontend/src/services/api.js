const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },

  post: async (endpoint, data) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorResponse;
    try {
      errorResponse = await response.json();
    } catch (parseErr) {
      // Backend returned non-JSON (HTML error page, plain text, etc.)
      errorResponse = { message: `Server error ${response.status}: ${response.statusText}` };
    }
    throw new Error(errorResponse?.message || errorResponse?.error || `Server error ${response.status}`);
  }

  return response.json();
},

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
};

export default apiClient;
