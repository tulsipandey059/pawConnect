const Pet = require("../models/Pet");
const { cloudinary, deleteFromCloudinary } = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const {
  getEmbedding,
  searchEmbedding,
} = require("../services/imageSimilarityService");

// ─── Helper: parse uploaded files → [{url, publicId}] ────────────────────────
// multer-storage-cloudinary attaches .path (secure URL) and .filename (public_id)
// to every file in req.files after a successful upload.
const formatUploadedImages = (files = []) =>
  files.map((f) => ({
    url: f.path,        // secure Cloudinary URL  e.g. https://res.cloudinary.com/...
    publicId: f.filename, // Cloudinary public_id  e.g. pawconnect/pets/pet_17...
  }));

const normalizeValue = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSearchFilters = ({ location, type, breed, reportType }) => {
  const filters = {
    isResolved: false,
  };

  if (type && normalizeValue(type)) {
    filters.type = normalizeValue(type);
  }

  if (breed && breed.trim()) {
    filters.breed = {
      $regex: `^${escapeRegex(breed.trim())}$`,
      $options: "i",
    };
  }

  if (location && location.trim()) {
    const pattern = escapeRegex(location.trim());
    filters.$or = [
      { "location.address": { $regex: pattern, $options: "i" } },
      { "location.city": { $regex: pattern, $options: "i" } },
      { "location.state": { $regex: pattern, $options: "i" } },
    ];
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

const mapPetMatch = (pet, score, index) => ({
  ...pet,
  id: String(pet._id),
  image: getPrimaryImageUrl(pet),
  images: (pet.images || []).map((entry) => entry.url),
  location: formatLocationLabel(pet.location),
  similarity:
    typeof score === "number"
      ? Math.round(Math.max(0, Math.min(1, score)) * 100)
      : Math.max(40, 90 - index * 7),
  matchReason:
    index === 0
      ? "High visual similarity based on the uploaded pet image."
      : index === 1
        ? "Strong appearance match with similar pet features."
        : "Potential image similarity match from the AI service.",
});

const isAiServiceUnavailable = (error) =>
  error.code === "ECONNREFUSED" ||
  error.code === "ECONNRESET" ||
  error.code === "ETIMEDOUT" ||
  error.code === "ENOTFOUND";

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all pets (with filters + pagination)
// @route   GET /api/pets
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllPets = asyncHandler(async (req, res) => {
  const { status, type, city, isResolved, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (status)      filter.status = status;
  if (type)        filter.type = type;
  if (city)        filter["location.city"] = new RegExp(city, "i");
  if (isResolved !== undefined) filter.isResolved = isResolved === "true";

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [pets, total] = await Promise.all([
    Pet.find(filter)
      .populate("postedBy", "name phone city")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Pet.countDocuments(filter),
  ]);

  res.json({
    success: true,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: pets,
  });
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

  const petPayload = {
    ...req.body,
    images,
    // Nested location object: multer sends "location[city]" as flat keys,
    // so we normalise them here if needed.
    location:
      req.body.location ||
        {
          address: req.body["location[address]"],
          city:    req.body["location[city]"],
          state:   req.body["location[state]"],
        },
  };

  if (req.user?._id) {
    petPayload.postedBy = req.user._id;
  }

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
});

exports.searchSimilarPets = asyncHandler(async (req, res) => {
  const { image, location, type, breed, reportType = "lost" } = req.body;

  if (!image) {
    return res
      .status(400)
      .json({ success: false, message: "Image is required" });
  }

  let uploadedSearchImage;

  try {
    uploadedSearchImage = await cloudinary.uploader.upload(image, {
      folder: "pawconnect/similarity-searches",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Could not process the uploaded image for similarity search.",
    });
  }

  let embedding;

  try {
    const embeddingResponse = await getEmbedding({
      imageUrl: uploadedSearchImage.secure_url,
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

  let rawMatches = [];

  try {
    const searchResponse = await searchEmbedding({
      embedding,
      topK: 20,
    });
    rawMatches = searchResponse.matches || [];
  } catch (error) {
    console.error("Similarity search error:", error.message);
    return res.status(isAiServiceUnavailable(error) ? 503 : 500).json({
      success: false,
      message: isAiServiceUnavailable(error)
        ? "The AI similarity service is not running. Start the AI service and try again."
        : "AI similarity search failed.",
    });
  }

  if (uploadedSearchImage?.public_id) {
    cloudinary.uploader.destroy(uploadedSearchImage.public_id).catch(() => {});
  }

  const matchedIds = rawMatches
    .map((match) => (typeof match === "string" ? match : match.pet_id))
    .filter(Boolean);

  if (matchedIds.length === 0) {
    return res.json({
      success: true,
      matches: [],
      message: "No AI matches found yet.",
    });
  }

  const filters = buildSearchFilters({
    location,
    type,
    breed,
    reportType,
  });

  const pets = await Pet.find({
    _id: { $in: matchedIds },
    ...filters,
  }).lean();

  const petMap = new Map(pets.map((pet) => [String(pet._id), pet]));
  const matches = rawMatches
    .map((match, index) => {
      const petId = typeof match === "string" ? match : match.pet_id;
      const pet = petMap.get(String(petId));

      if (!pet) {
        return null;
      }

      return mapPetMatch(
        pet,
        typeof match === "object" ? match.score : null,
        index
      );
    })
    .filter(Boolean);

  return res.json({
    success: true,
    matches,
    message: `Found ${matches.length} potential AI match${
      matches.length === 1 ? "" : "es"
    }.`,
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
exports.getMyPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find({ postedBy: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ success: true, count: pets.length, data: pets });
});
