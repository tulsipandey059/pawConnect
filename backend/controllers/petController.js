const Pet = require("../models/Pet");
const { deleteFromCloudinary } = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");

// ─── Helper: parse uploaded files → [{url, publicId}] ────────────────────────
// multer-storage-cloudinary attaches .path (secure URL) and .filename (public_id)
// to every file in req.files after a successful upload.
const formatUploadedImages = (files = []) =>
  files.map((f) => ({
    url: f.path,        // secure Cloudinary URL  e.g. https://res.cloudinary.com/...
    publicId: f.filename, // Cloudinary public_id  e.g. pawconnect/pets/pet_17...
  }));

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
  // Build the images array from whatever multer uploaded to Cloudinary.
  // If no files were attached the pet is saved with an empty images array.
  const images = formatUploadedImages(req.files);

  const pet = await Pet.create({
    ...req.body,
    images,
    postedBy: req.user._id,
    // Nested location object: multer sends "location[city]" as flat keys,
    // so we normalise them here if needed.
    location:
      req.body.location ||
      {
        address: req.body["location[address]"],
        city:    req.body["location[city]"],
        state:   req.body["location[state]"],
      },
  });

  res.status(201).json({
    success: true,
    message: "Pet post created",
    data: pet,
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