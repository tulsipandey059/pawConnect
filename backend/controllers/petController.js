const Pet = require("../models/Pet");
const { deleteFromCloudinary } = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const { getEmbedding } = require("../services/imageSimilarityService");
const {
  getMockPets,
  addMockPet,
  getUserMockPets,
} = require("../data/mockPets");

// ─── Helper: parse uploaded files → [{url, publicId}] ────────────────────────
// For Cloudinary: files have .path (URL) and .filename (public_id)
// For Memory storage: files have .buffer and .originalname (we create data URLs)
const formatUploadedImages = (files = []) => {
  return files.map((f) => {
    // Cloudinary upload
    if (f.path && f.filename) {
      return {
        url: f.path,
        publicId: f.filename,
      };
    }

    // Memory storage upload (offline mode)
    if (f.buffer) {
      const base64 = f.buffer.toString("base64");
      const mimetype = f.mimetype || "image/jpeg";
      return {
        url: `data:${mimetype};base64,${base64}`,
        publicId: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
    }

    return null;
  }).filter(Boolean);
};

const normalizeValue = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const LOCATION_COORDS_MAP = {
  "andheri, mumbai": { lat: 19.1133, lng: 72.8398 },
  "koramangala, bangalore": { lat: 12.9279, lng: 77.6285 },
  "lodhi gardens, delhi": { lat: 28.587, lng: 77.2253 },
  "t nagar, chennai": { lat: 13.0429, lng: 80.261 },
  "salt lake, kolkata": { lat: 22.5764, lng: 88.419 },
  "banjara hills, hyderabad": { lat: 17.4182, lng: 78.4102 },
  "koregaon park, pune": { lat: 18.5404, lng: 73.9013 },
  "mg road, gurgaon": { lat: 28.435, lng: 77.0217 },
  "jubilee hills, hyderabad": { lat: 17.4216, lng: 78.3877 },
  "cubbon park, bangalore": { lat: 12.9759, lng: 77.5923 },
  "vasant kunj, delhi": { lat: 28.5267, lng: 77.1404 },
  "powai, mumbai": { lat: 19.1238, lng: 72.9078 },
  "bandra west, mumbai": { lat: 19.0675, lng: 72.8344 },
  "juhu beach, mumbai": { lat: 19.0965, lng: 72.8243 },
  "versova, mumbai": { lat: 19.145, lng: 72.7995 },
  "malad west, mumbai": { lat: 19.1875, lng: 72.8375 },
  "goregaon east, mumbai": { lat: 19.1667, lng: 72.8611 },
  "juhu, mumbai": { lat: 19.1051, lng: 72.8255 },
  "powder nagar, delhi": { lat: 28.5355, lng: 77.2333 },
  "whitefield, bangalore": { lat: 12.9698, lng: 77.763 },
  "anna nagar, chennai": { lat: 13.0833, lng: 80.2 },
  "sector 18, noida": { lat: 28.5355, lng: 77.391 },
  "satellite, ahmedabad": { lat: 23.02, lng: 72.548 },
  "hinjewadi, pune": { lat: 18.599, lng: 73.715 },
  "kalyan nagar, bangalore": { lat: 12.9995, lng: 77.6692 },
  "indiranagar, bangalore": { lat: 12.9784, lng: 77.6408 },
};

const MAX_SEARCH_RADIUS_KM = 5;

const toNumericCoordinate = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const hasCoordinates = (coordinates = {}) =>
  toNumericCoordinate(coordinates?.lat) !== null &&
  toNumericCoordinate(coordinates?.lng) !== null;

const inferCoordinatesFromLocation = (location) => {
  if (!location) {
    return null;
  }

  if (typeof location === "object" && hasCoordinates(location.coordinates)) {
    return {
      lat: toNumericCoordinate(location.coordinates.lat),
      lng: toNumericCoordinate(location.coordinates.lng),
    };
  }

  const address =
    typeof location === "string" ? location : [location.address, location.city].filter(Boolean).join(", ");
  const city = typeof location === "object" ? location.city : "";

  const candidates = [
    address,
    [typeof location === "object" ? location.address : "", city].filter(Boolean).join(", "),
    typeof location === "object" ? location.address : "",
    city,
  ]
    .map((value) => normalizeValue(value))
    .filter(Boolean);

  for (const candidate of candidates) {
    if (LOCATION_COORDS_MAP[candidate]) {
      return LOCATION_COORDS_MAP[candidate];
    }
  }

  return null;
};

const toRadians = (value) => (value * Math.PI) / 180;

const calculateDistanceKm = (left, right) => {
  if (!left || !right) {
    return null;
  }

  const leftLat = toNumericCoordinate(left.lat);
  const leftLng = toNumericCoordinate(left.lng);
  const rightLat = toNumericCoordinate(right.lat);
  const rightLng = toNumericCoordinate(right.lng);

  if ([leftLat, leftLng, rightLat, rightLng].some((value) => value === null)) {
    return null;
  }

  const earthRadiusKm = 6371;
  const dLat = toRadians(rightLat - leftLat);
  const dLng = toRadians(rightLng - leftLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(leftLat)) *
      Math.cos(toRadians(rightLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const buildSearchFilters = ({ location, type, breed, reportType }) => {
  const filters = {
    isResolved: false,
  };

  if (type && normalizeValue(type)) {
    filters.type = normalizeValue(type);
  }

  if (breed && breed.trim()) {
    filters.breed = {
      $regex: escapeRegex(breed.trim()),
      $options: "i",
    };
  }

  if (reportType === "found") {
    filters.status = "lost";
  } else if (reportType === "lost") {
    filters.status = { $in: ["found", "adoption"] };
  }

  return filters;
};

const getPrimaryImageUrl = (pet) => pet.images?.[0]?.url || null;

const formatLocationLabel = (location = {}) => {
  if (typeof location === "string") {
    return location;
  }

  return [location.address, location.city, location.state]
    .filter(Boolean)
    .join(", ");
};

const sortByNewest = (pets = []) =>
  [...pets].sort(
    (left, right) =>
      new Date(right?.createdAt || 0).getTime() -
      new Date(left?.createdAt || 0).getTime()
  );

const buildPetStats = (pets = []) => ({
  total: pets.length,
  lost: pets.filter((pet) => pet.status === "lost").length,
  found: pets.filter((pet) => pet.status === "found").length,
  adoption: pets.filter((pet) => pet.status === "adoption").length,
  resolved: pets.filter((pet) => pet.isResolved).length,
});

const matchesMockFilters = (pet, filters = {}) => {
  if (filters.isResolved !== undefined && pet.isResolved !== filters.isResolved) {
    return false;
  }

  if (filters.type && normalizeValue(pet.type) !== normalizeValue(filters.type)) {
    return false;
  }

  if (filters.status) {
    if (typeof filters.status === "string" && pet.status !== filters.status) {
      return false;
    }

    if (filters.status?.$in && !filters.status.$in.includes(pet.status)) {
      return false;
    }
  }

  if (filters.breed?.$regex) {
    const breedRegex = new RegExp(filters.breed.$regex, filters.breed.$options || "");
    if (!breedRegex.test(pet.breed || "")) {
      return false;
    }
  }

  if (filters.$or?.length) {
    const locationLabel = formatLocationLabel(pet.location).toLowerCase();
    const matchesLocation = filters.$or.some((candidate) => {
      const value = Object.values(candidate)[0];
      return value?.$regex
        ? new RegExp(value.$regex, value.$options || "").test(locationLabel)
        : false;
    });

    if (!matchesLocation) {
      return false;
    }
  }

  return true;
};

const getDistanceLabel = (pet, searchLocation) => {
  const queryCoordinates = inferCoordinatesFromLocation(searchLocation);
  const petCoordinates = inferCoordinatesFromLocation(pet.location);
  const distanceKm = calculateDistanceKm(queryCoordinates, petCoordinates);

  if (distanceKm === null) {
    return null;
  }

  return `${distanceKm < 1 ? distanceKm.toFixed(1) : Math.round(distanceKm)} km away`;
};

const filterPetsByLocation = (pets = [], searchLocation = "") => {
  const normalizedSearchLocation = normalizeValue(searchLocation);

  if (!normalizedSearchLocation) {
    return pets;
  }

  const queryCoordinates = inferCoordinatesFromLocation(searchLocation);

  return pets.filter((pet) => {
    if (queryCoordinates) {
      const petCoordinates = inferCoordinatesFromLocation(pet.location);
      const distanceKm = calculateDistanceKm(queryCoordinates, petCoordinates);

      if (distanceKm !== null) {
        return distanceKm <= MAX_SEARCH_RADIUS_KM;
      }
    }

    return formatLocationLabel(pet.location)
      .toLowerCase()
      .includes(normalizedSearchLocation);
  });
};

const mapPetMatch = (pet, score, index, searchLocation) => ({
  ...pet,
  id: String(pet._id),
  image: getPrimaryImageUrl(pet),
  images: (pet.images || []).map((entry) => entry.url),
  location: formatLocationLabel(pet.location),
  distance: getDistanceLabel(pet, searchLocation),
  similarity:
    typeof score === "number"
      ? Math.round(Math.max(0, Math.min(1, score)) * 100)
      : Math.max(40, 90 - index * 7),
  matchReason:
    typeof score === "number"
      ? score >= 0.9
        ? "Very strong visual match for the uploaded pet photo."
        : score >= 0.82
          ? "Strong appearance match with similar pet features."
          : "Possible visual match based on image similarity."
      : index === 0
        ? "High visual similarity based on the uploaded pet image."
        : index === 1
          ? "Strong appearance match with similar pet features."
          : "Potential image similarity match from the AI service.",
});

const SIMILARITY_MATCH_THRESHOLD = 0.72;
const RELAXED_SIMILARITY_MATCH_THRESHOLD = 0.64;
const MAX_SIMILARITY_CANDIDATES = 24;

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const normalizeEmbeddingScore = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return clamp01((numericValue + 1) / 2);
};

const cosineSimilarity = (left = [], right = []) => {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
    return 0;
  }

  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    const leftValue = Number(left[index]) || 0;
    const rightValue = Number(right[index]) || 0;

    dot += leftValue * rightValue;
    leftMagnitude += leftValue * leftValue;
    rightMagnitude += rightValue * rightValue;
  }

  if (!leftMagnitude || !rightMagnitude) {
    return 0;
  }

  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
};

const dedupePetsById = (pets = []) => {
  const uniquePets = new Map();

  pets.forEach((pet) => {
    const petId = String(pet?._id || "");

    if (petId && !uniquePets.has(petId)) {
      uniquePets.set(petId, pet);
    }
  });

  return Array.from(uniquePets.values());
};

const fetchPetsForSimilarity = async (activeFilters) => {
  let dbPets = [];

  try {
    dbPets = await withMongoTimeout(
      Pet.find(activeFilters)
        .sort({ createdAt: -1 })
        .limit(MAX_SIMILARITY_CANDIDATES)
        .lean(),
      3000,
      "MongoDB similarity candidate lookup timeout"
    );
  } catch (error) {
    console.warn("MongoDB lookup failed during similarity search:", error.message);
  }

  const mockPets = getMockPets()
    .filter((pet) => matchesMockFilters(pet, activeFilters))
    .slice(0, MAX_SIMILARITY_CANDIDATES);

  return dedupePetsById([...dbPets, ...mockPets]).filter((pet) => getPrimaryImageUrl(pet));
};

const rankPetsBySimilarity = async ({
  pets,
  queryEmbedding,
  minimumScore,
  searchLocation,
}) => {
  const scoredPets = await Promise.allSettled(
    pets.map(async (pet) => {
      const primaryImageUrl = getPrimaryImageUrl(pet);

      if (!primaryImageUrl) {
        return null;
      }

      const embeddingResponse = await getEmbedding({ imageUrl: primaryImageUrl });
      const score = normalizeEmbeddingScore(
        cosineSimilarity(queryEmbedding, embeddingResponse.embedding)
      );

      if (score < minimumScore) {
        return null;
      }

      return {
        pet,
        score,
      };
    })
  );

  return scoredPets
    .filter((result) => result.status === "fulfilled" && result.value)
    .map((result) => result.value)
    .sort((left, right) => right.score - left.score)
    .map((result, index) => mapPetMatch(result.pet, result.score, index, searchLocation));
};

const isAiServiceUnavailable = (error) =>
  error.code === "ECONNREFUSED" ||
  error.code === "ECONNRESET" ||
  error.code === "ETIMEDOUT" ||
  error.code === "ENOTFOUND";

const withMongoTimeout = (promise, timeoutMs = 3500, label = "MongoDB query timeout") =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(label)), timeoutMs)
    ),
  ]);

exports.getMyPets = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    const userId = String(req.user._id || req.user.id);
    let dbPets = [];
    let dbUnavailable = false;

    try {
      dbPets = await withMongoTimeout(
        Pet.find({ postedBy: req.user._id || req.user.id })
          .populate("postedBy", "name phone city email")
          .sort({ createdAt: -1 })
          .lean(),
        3500,
        "MongoDB getMyPets timeout"
      );
    } catch (error) {
      dbUnavailable = true;
      console.warn("MongoDB unavailable for getMyPets, using mock data:", error.message);
    }

    const mockPets = getUserMockPets(userId);
    const seenIds = new Set();
    const pets = sortByNewest(
      [...dbPets, ...mockPets].filter((pet) => {
        const petId = String(pet?._id || "");
        if (!petId || seenIds.has(petId)) {
          return false;
        }
        seenIds.add(petId);
        return true;
      })
    );

    res.json({
      success: true,
      stats: buildPetStats(pets),
      data: pets,
      ...(dbUnavailable ? { _note: "Using mock data because MongoDB is unavailable" } : {}),
    });
  } catch (error) {
    console.error("Error in getMyPets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your pet reports",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/pets
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllPets = asyncHandler(async (req, res) => {
  const { status, type, city, isResolved, page = 1, limit = 10 } = req.query;

  try {
    const filter = {};
    if (status)      filter.status = status;
    if (type)        filter.type = type;
    if (city)        filter["location.city"] = new RegExp(city, "i");
    if (isResolved !== undefined) filter.isResolved = isResolved === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [pets, total] = await withMongoTimeout(
      Promise.all([
        Pet.find(filter)
          .populate("postedBy", "name phone city")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Pet.countDocuments(filter),
      ]),
      3500,
      "MongoDB getAllPets timeout"
    );

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: pets,
    });
  } catch (error) {
    console.warn("⚠️  MongoDB unavailable, using mock data:", error.message);

    // Fallback to mock data
    let filteredPets = getMockPets();

    if (status) filteredPets = filteredPets.filter(p => p.status === status);
    if (type) filteredPets = filteredPets.filter(p => p.type === type);
    if (city) filteredPets = filteredPets.filter(p => p.location.city.toLowerCase().includes(city.toLowerCase()));
    if (isResolved !== undefined) filteredPets = filteredPets.filter(p => p.isResolved === (isResolved === "true"));

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = filteredPets.length;
    const pets = filteredPets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: pets,
      _note: "Using mock data - MongoDB is currently unavailable"
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.getPet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id).populate(
    "postedBy",
    "name phone city email"
  );

  if (!pet) {
    return res.status(404).json({ success: false, message: "Pet not found" });
  }

  res.json({ success: true, data: pet });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Add a pet with image upload  ← PRIMARY NEW ENDPOINT
// @route   POST /api/pets  (also aliased as POST /api/pets/add-pet)
// @access  Private
// Expects: multipart/form-data
//   - images      : file(s) — up to 5, each ≤ 5 MB
//   - All other pet fields as text fields in the same form
// ─────────────────────────────────────────────────────────────────────────────
exports.createPet = asyncHandler(async (req, res) => {
  if (req.body.status === "adoption" && !req.user) {
    return res.status(401).json({
      success: false,
      message: "Please log in before creating an adoption listing.",
    });
  }

  // Build the images array from whatever multer uploaded to Cloudinary.
  // If no files were attached the pet is saved with an empty images array.
  const images = formatUploadedImages(req.files);

  const normalizedLocation =
    req.body.location || {
      address: req.body["location[address]"],
      city: req.body["location[city]"],
      state: req.body["location[state]"],
      coordinates: {
        lat: req.body["location[coordinates][lat]"],
        lng: req.body["location[coordinates][lng]"],
      },
    };

  const inferredCoordinates = inferCoordinatesFromLocation(normalizedLocation);
  if (inferredCoordinates) {
    normalizedLocation.coordinates = inferredCoordinates;
  }

  const petPayload = {
    ...req.body,
    images,
    location: normalizedLocation,
  };

  if (req.user?._id) {
    petPayload.postedBy = req.user._id;
  }

  try {
    const pet = await Pet.create(petPayload);

    let embeddingWarning = null;
    const primaryImageUrl = getPrimaryImageUrl(pet);

    if (primaryImageUrl) {
      try {
        await getEmbedding({
          imageUrl: primaryImageUrl,
          petId: pet._id.toString(),
        });
      } catch (error) {
        console.error("Pet indexing error:", error.message);
        embeddingWarning = isAiServiceUnavailable(error)
          ? "Pet post created, but the image similarity service is not running yet."
          : "Pet post created, but AI indexing could not be completed.";
      }
    }

    res.status(201).json({
      success: true,
      message: embeddingWarning || "Pet post created",
      embeddingWarning,
      data: pet,
    });
  } catch (error) {
    console.warn("⚠️  MongoDB create pet error:", error.message);

    // Fallback: Create mock pet for offline mode
    const mockPetId = "mock_" + Date.now();
    const mockPet = {
      _id: mockPetId,
      ...petPayload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to mock pets store
    addMockPet(mockPet);

    let embeddingWarning = null;
    const primaryImageUrl = getPrimaryImageUrl(mockPet);

    if (primaryImageUrl) {
      try {
        await getEmbedding({
          imageUrl: primaryImageUrl,
          petId: mockPetId,
        });
      } catch (embeddingError) {
        console.error("Mock pet indexing error:", embeddingError.message);
        embeddingWarning = isAiServiceUnavailable(embeddingError)
          ? "Pet post created in offline mode, but the image similarity service is not running yet."
          : "Pet post created in offline mode, but AI indexing could not be completed.";
      }
    }

    console.log("✅ Mock pet created:", mockPetId);

    res.status(201).json({
      success: true,
      message: embeddingWarning || "Pet post created (offline mode)",
      embeddingWarning,
      data: mockPet,
    });
  }
});

exports.searchSimilarPets = asyncHandler(async (req, res) => {
  const { image, location, type, breed, reportType = "lost" } = req.body;

  const searchImage = typeof image === "string" ? image.trim() : "";

  if (!searchImage) {
    return res
      .status(400)
      .json({ success: false, message: "Image is required" });
  }

  let embedding;

  try {
    const embeddingResponse = await getEmbedding({
      imageUrl: searchImage,
    });
    embedding = embeddingResponse.embedding;
  } catch (error) {
    console.error("Similarity embedding error:", error.message);
    return res.status(isAiServiceUnavailable(error) ? 503 : 500).json({
      success: false,
      message: isAiServiceUnavailable(error)
        ? "The AI similarity service is not running. Start the AI service and try again."
        : "Failed to generate an image embedding for similarity search.",
    });
  }

  const filters = buildSearchFilters({
    location,
    type,
    breed,
    reportType,
  });

  const strictCandidates = filterPetsByLocation(
    await fetchPetsForSimilarity(filters),
    location
  );
  let matches = await rankPetsBySimilarity({
    pets: strictCandidates,
    queryEmbedding: embedding,
    minimumScore: SIMILARITY_MATCH_THRESHOLD,
    searchLocation: location,
  });
  let responseMessage = `Found ${matches.length} potential AI match${
    matches.length === 1 ? "" : "es"
  }.`;

  if (matches.length === 0) {
    const relaxedFilters = { ...filters };
    delete relaxedFilters.breed;

    const relaxedCandidates = filterPetsByLocation(
      await fetchPetsForSimilarity(relaxedFilters),
      location
    );
    matches = await rankPetsBySimilarity({
      pets: relaxedCandidates,
      queryEmbedding: embedding,
      minimumScore: RELAXED_SIMILARITY_MATCH_THRESHOLD,
      searchLocation: location,
    });

    if (matches.length > 0) {
      responseMessage =
        "No exact breed match was found within 5 km, so showing the closest visual matches in that area instead.";
    } else if (strictCandidates.length === 0) {
      responseMessage =
        "No active pet reports matched the selected type within 5 km yet.";
    } else {
      responseMessage =
        "No strong image matches were found within 5 km. Try a clearer photo or adjust the breed filter.";
    }
  }

  return res.json({
    success: true,
    matches,
    message: responseMessage,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update pet post (text fields only — use /images to swap images)
// @route   PUT /api/pets/:id
// @access  Private (owner or admin)
// ─────────────────────────────────────────────────────────────────────────────
exports.updatePet = asyncHandler(async (req, res) => {
  let pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({ success: false, message: "Pet not found" });
  }

  if (
    pet.postedBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ success: false, message: "Not authorized to update this post" });
  }

  pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, message: "Pet post updated", data: pet });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Replace all images on a pet post (upload new, delete old from Cloudinary)
// @route   PUT /api/pets/:id/images
// @access  Private (owner or admin)
// Expects: multipart/form-data with field "images"
// ─────────────────────────────────────────────────────────────────────────────
exports.updatePetImages = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({ success: false, message: "Pet not found" });
  }

  if (
    pet.postedBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No images provided" });
  }

  // Delete old images from Cloudinary first
  await Promise.allSettled(
    pet.images.map((img) => deleteFromCloudinary(img.url))
  );

  // Save new image references
  pet.images = formatUploadedImages(req.files);
  await pet.save();

  res.json({
    success: true,
    message: `${pet.images.length} image(s) uploaded successfully`,
    images: pet.images,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete pet post (also removes images from Cloudinary)
// @route   DELETE /api/pets/:id
// @access  Private (owner or admin)
// ─────────────────────────────────────────────────────────────────────────────
exports.deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({ success: false, message: "Pet not found" });
  }

  if (
    pet.postedBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ success: false, message: "Not authorized to delete this post" });
  }

  // Clean up Cloudinary — run deletions in parallel, ignore individual failures
  if (pet.images.length > 0) {
    await Promise.allSettled(
      pet.images.map((img) => deleteFromCloudinary(img.url))
    );
  }

  await pet.deleteOne();
  res.json({ success: true, message: "Pet post and all images deleted" });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mark pet post as resolved
// @route   PATCH /api/pets/:id/resolve
// @access  Private (owner only)
// ─────────────────────────────────────────────────────────────────────────────
exports.resolvePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({ success: false, message: "Pet not found" });
  }

  if (pet.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  pet.isResolved = true;
  await pet.save();

  res.json({ success: true, message: "Post marked as resolved", data: pet });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get pets posted by the logged-in user
// @route   GET /api/pets/user/my-posts
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
