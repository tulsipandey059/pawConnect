// Utility helpers
export const formatDistance = (meters) => {
  return `${(meters / 1000).toFixed(1)} km`;
};

export const truncate = (str, length) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export default { formatDistance, truncate };

