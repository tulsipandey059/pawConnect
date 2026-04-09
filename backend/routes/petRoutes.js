const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  getAllPets,
  getPet,
  createPet,
  searchSimilarPets,
  updatePet,
  updatePetImages,
  deletePet,
  resolvePet,
  getMyPets,
} = require("../controllers/petController");

const { protect, attachUserIfPresent } = require("../middleware/auth");
const validate           = require("../middleware/validate");
const uploadMiddleware    = require("../middleware/upload");

// ─── Validation rules ─────────────────────────────────────────────────────────
const petRules = [
  body("type")
    .isIn(["dog", "cat", "bird", "rabbit", "other"])
    .withMessage("type must be dog | cat | bird | rabbit | other"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("description is required"),
  body("status")
    .isIn(["lost", "found", "adoption"])
    .withMessage("status must be lost | found | adoption"),
];

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/", getAllPets);
router.post("/similarity-search", searchSimilarPets);
router.get("/:id", getPet);

// ─── Private routes ───────────────────────────────────────────────────────────

// My posts — must come before /:id so it isn't swallowed by the param route
router.get("/user/my-posts", protect, getMyPets);

// POST /api/pets         — create with optional image upload
// POST /api/pets/add-pet — canonical alias requested in brief
router.post(
  "/",
  attachUserIfPresent,
  uploadMiddleware,   // ← multer uploads files to Cloudinary BEFORE controller runs
  petRules,
  validate,
  createPet
);

router.post(
  "/add-pet",
  attachUserIfPresent,
  uploadMiddleware,
  petRules,
  validate,
  createPet
);

// PUT /api/pets/:id          — update text fields
router.put("/:id",          protect, updatePet);

// PUT /api/pets/:id/images   — replace all images
router.put(
  "/:id/images",
  protect,
  uploadMiddleware,
  updatePetImages
);

router.delete("/:id",       protect, deletePet);
router.patch("/:id/resolve", protect, resolvePet);

module.exports = router;
