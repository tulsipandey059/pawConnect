const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// ─── 1. Configure Cloudinary SDK ─────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── 2. Cloudinary Storage Engine for Multer ─────────────────────────────────
//  - Images land directly in Cloudinary (never touch disk)
//  - Organised by feature folder inside your cloud account
//  - Auto-converted to webp for faster delivery
const petImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "pawconnect/pets",          // logical folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 1200, height: 900, crop: "limit" }, // cap resolution
      { quality: "auto:good" },                    // smart compression
      { fetch_format: "auto" },                    // serve webp where supported
    ],
    public_id: `pet_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
  }),
});

// ─── 3. Multer upload instance ────────────────────────────────────────────────
const uploadPetImages = multer({
  storage: petImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,   // 5 MB per image
    files: 5,                     // max 5 images per request
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG, and WEBP images are allowed"),
        false
      );
    }
    cb(null, true);
  },
});

// ─── 4. Helper: delete an image from Cloudinary ──────────────────────────────
//  Use this when a pet post is deleted so orphan images are cleaned up
const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public_id from the full URL
    // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/pawconnect/pets/pet_xyz.jpg
    const parts = imageUrl.split("/");
    const filenameWithExt = parts[parts.length - 1];
    const filename = filenameWithExt.split(".")[0];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${filename}`;

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
    return null;
  }
};

module.exports = { cloudinary, uploadPetImages, deleteFromCloudinary };