const TOKEN_KEY = 'token';
export const AUTH_EXPIRED_EVENT = 'auth:expired';

const readStorageValue = (storage, key) => {
  try {
    return storage.getItem(key) || '';
  } catch {
    return '';
  }
};

const writeStorageValue = (storage, key, value) => {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage failures so auth logic can decide how to recover.
  }
};

const removeStorageValue = (storage, key) => {
  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage failures during cleanup.
  }
};

export const getStoredToken = () =>
  readStorageValue(sessionStorage, TOKEN_KEY) ||
  readStorageValue(localStorage, TOKEN_KEY) ||
  '';

export const setStoredToken = (token) => {
  if (!token) {
    return;
  }

  writeStorageValue(sessionStorage, TOKEN_KEY, token);
  writeStorageValue(localStorage, TOKEN_KEY, token);
};

export const clearStoredToken = () => {
  removeStorageValue(sessionStorage, TOKEN_KEY);
  removeStorageValue(localStorage, TOKEN_KEY);
};

export const notifyAuthExpired = (message = 'Your session has expired. Please log in again.') => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(AUTH_EXPIRED_EVENT, {
      detail: { message },
    })
  );
};
