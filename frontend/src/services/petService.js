import { API_BASE } from './api';
import { petsData } from '../data/pets';
import { getStoredToken } from '../utils/authStorage';

const normalizeStatus = (status = '') => String(status).trim().toLowerCase();

const toTitleCase = (value = '') =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

const formatLocation = (location) => {
  if (!location) {
    return '';
  }

  if (typeof location === 'string') {
    return location;
  }

  return [location.address, location.city, location.state]
    .filter(Boolean)
    .join(', ');
};

const normalizeTags = (pet, type, breed) => {
  if (Array.isArray(pet.tags) && pet.tags.length > 0) {
    return pet.tags;
  }

  return [toTitleCase(type), breed].filter(Boolean);
};

const normalizePet = (pet) => {
  const id = String(pet._id || pet.id);
  const type = normalizeStatus(pet.type || pet.species);
  const status = normalizeStatus(pet.status);
  const images = Array.isArray(pet.images)
    ? pet.images
        .map((image) => (typeof image === 'string' ? image : image?.url))
        .filter(Boolean)
    : [];
  const image = pet.image || images[0] || '';
  const postedBy =
    typeof pet.postedBy === 'object' && pet.postedBy !== null ? pet.postedBy : null;
  const postedById =
    typeof pet.postedBy === 'string'
      ? pet.postedBy
      : postedBy?._id || postedBy?.id || '';

  return {
    ...pet,
    id,
    _id: pet._id || id,
    type,
    status,
    image,
    images,
    location: formatLocation(pet.location),
    tags: normalizeTags(pet, type, pet.breed),
    ownerId: pet.ownerId || postedById || '',
    ownerEmail: pet.ownerEmail || postedBy?.email || '',
    contact: pet.contact || postedBy?.phone || pet.contactDetails || '',
  };
};

const normalizePets = (pets = []) => pets.map(normalizePet);

const parseLocation = (locationText = '') => {
  const normalized = locationText.trim();
  const parts = normalized.split(',').map((part) => part.trim()).filter(Boolean);

  return {
    address: normalized,
    city: parts.length > 1 ? parts[parts.length - 1] : normalized,
    state: parts.length > 2 ? parts[parts.length - 2] : '',
  };
};

const buildCreatePayload = (petData) => {
  const formData = new FormData();
  const type = normalizeStatus(petData.type || petData.species);
  const status = normalizeStatus(petData.status);
  const location = parseLocation(petData.location || '');
  const description =
    petData.description ||
    `${toTitleCase(status)} ${petData.breed || type || 'pet'} near ${location.address}.`;

  formData.append('name', petData.name || petData.petName || `${toTitleCase(type)} report`);
  formData.append('type', type);
  formData.append('breed', petData.breed || '');
  formData.append('age', petData.age || '');
  formData.append('status', status);
  formData.append('description', description);
  formData.append('contact', petData.contact || petData.contactPhone || petData.contactDetails || '');
  formData.append('location[address]', location.address);
  formData.append('location[city]', location.city);

  if (location.state) {
    formData.append('location[state]', location.state);
  }

  if (petData.image instanceof File) {
    formData.append('images', petData.image);
  }

  if (petData.imageFile instanceof File) {
    formData.append('images', petData.imageFile);
  }

  return formData;
};

const getAuthHeader = () => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const petService = {
  getPets: async () => {
    try {
      const response = await fetch(`${API_BASE}/pets?limit=100`);

      if (!response.ok) {
        throw new Error(`Failed to fetch pets: ${response.status}`);
      }

      const data = await response.json();
      return normalizePets(data.data || []);
    } catch (error) {
      const cached = JSON.parse(localStorage.getItem('pets') || '[]');
      return normalizePets(cached.length > 0 ? cached : petsData);
    }
  },

  createPet: async (petData) => {
    const response = await fetch(`${API_BASE}/pets`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: buildCreatePayload(petData),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        payload?.message || `Could not submit the report (${response.status}).`
      );
    }

    return normalizePet(payload?.data || {});
  },

  getMyPets: async () => {
    const response = await fetch(`${API_BASE}/pets/user/my-posts`, {
      headers: getAuthHeader(),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        payload?.message || `Could not load your pet reports (${response.status}).`
      );
    }

    return {
      pets: normalizePets(payload?.data || []),
      stats: payload?.stats || {},
      note: payload?._note || '',
    };
  },
};

export default petService;
