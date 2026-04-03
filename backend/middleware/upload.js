const { uploadPetImages } = require("../config/cloudinary");

// ─── Wraps multer so its errors get forwarded to Express error handler ────────
// Usage in routes: router.post("/", protect, uploadMiddleware, controller)

const uploadMiddleware = (req, res, next) => {
  // Accept up to 5 images under the field name "images"
  const upload = uploadPetImages.array("images", 5);

  upload(req, res, (err) => {
    if (!err) return next();

    // Multer-specific errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Each image must be under 5 MB",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 5 images",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: 'Use the field name "images" for all image files',
      });
    }

    // fileFilter rejection or any other error
    return res.status(400).json({
      success: false,
      message: err.message || "Image upload failed",
    });
  });
};

module.exports = uploadMiddleware;