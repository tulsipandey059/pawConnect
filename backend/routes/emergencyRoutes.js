const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  getAllEmergencies,
  getEmergency,
  createEmergency,
  updateEmergency,
  deleteEmergency,
  offerHelp,
  updateStatus,
} = require("../controllers/emergencyController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

// Validation rules
const emergencyRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("type")
    .isIn(["injured", "abuse", "stray_colony", "rescue_needed", "other"])
    .withMessage("Invalid emergency type"),
  body("location.address").trim().notEmpty().withMessage("Location address is required"),
  body("location.city").trim().notEmpty().withMessage("City is required"),
];

const statusRules = [
  body("status")
    .isIn(["active", "in_progress", "resolved"])
    .withMessage("Status must be active, in_progress, or resolved"),
];

// Public routes
router.get("/", getAllEmergencies);
router.get("/:id", getEmergency);

// Private routes
router.post("/", protect, emergencyRules, validate, createEmergency);
router.put("/:id", protect, updateEmergency);
router.delete("/:id", protect, deleteEmergency);
router.patch("/:id/help", protect, offerHelp);
router.patch("/:id/status", protect, statusRules, validate, updateStatus);

module.exports = router;