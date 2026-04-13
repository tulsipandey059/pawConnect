import { getStoredToken } from '../utils/authStorage';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const buildHeaders = (headers = {}, auth = false) => {
  const nextHeaders = { ...headers };

  if (auth) {
    const token = getStoredToken();
    if (token) {
      nextHeaders.Authorization = `Bearer ${token}`;
    }
  }

  return nextHeaders;
};

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const request = async (endpoint, options = {}) => {
  const { auth = false, headers, ...fetchOptions } = options;
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers: buildHeaders(headers, auth),
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        `Server error ${response.status}: ${response.statusText}`
    );
  }

  return payload;
};

const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, options),

  post: (endpoint, data, options = {}) =>
    request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(data),
      ...options,
    }),

  put: (endpoint, data, options = {}) =>
    request(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(data),
      ...options,
    }),
};

export default apiClient;
