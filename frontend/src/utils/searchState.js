const SEARCH_STORAGE_KEY = 'pawconnect_search_payload';

export const saveSearchPayload = (payload) => {
  sessionStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(payload));
};

export const loadSearchPayload = () => {
  const value = sessionStorage.getItem(SEARCH_STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Failed to parse stored search payload', error);
    return null;
  }
};
