const cloudinary = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

// ─── 1. Configure Cloudinary SDK ─────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Check if Cloudinary is configured ──────────────────────────────────────
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// ─── 2. Fallback Storage (Memory) for offline mode ────────────────────────────
const memoryStorage = multer.memoryStorage();

// ─── 3. Cloudinary Storage Engine for Multer ─────────────────────────────────
const petImageStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => ({
        folder: "pawconnect/pets",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
          { width: 1200, height: 900, crop: "limit" },
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
        public_id: `pet_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
      }),
    })
  : memoryStorage;

// ─── 4. Multer upload instance ────────────────────────────────────────────────
const uploadPetImages = multer({
  storage: petImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
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

// ─── 5. Helper: delete an image from Cloudinary ──────────────────────────────
const deleteFromCloudinary = async (imageUrl) => {
  if (!isCloudinaryConfigured) {
    console.log("⚠️  Cloudinary not configured, skipping delete");
    return null;
  }

  try {
    const parts = imageUrl.split("/");
    const filenameWithExt = parts[parts.length - 1];
    const filename = filenameWithExt.split(".")[0];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${filename}`;

    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
    return null;
  }
};

// Log startup message
if (!isCloudinaryConfigured) {
  console.log("⚠️  Cloudinary not configured - using memory storage for image uploads");
  console.log("   Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env for production");
}

module.exports = { cloudinary, uploadPetImages, deleteFromCloudinary, isCloudinaryConfigured };
