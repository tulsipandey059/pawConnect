const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createRequest,
  getReceivedRequests,
  getSentRequests,
  getRequest,
  respondToRequest,
  withdrawRequest,
} = require("../controllers/adoptionController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

// Validation rules
const requestRules = [
  body("petId").notEmpty().withMessage("Pet ID is required"),
  body("message")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Message must be at least 20 characters"),
  body("livingSituation")
    .isIn(["house_with_yard", "apartment", "house_no_yard", "farm", "other"])
    .withMessage("Invalid living situation"),
];

// All routes are private
router.use(protect);

router.post("/", requestRules, validate, createRequest);
router.get("/received", getReceivedRequests);
router.get("/sent", getSentRequests);
router.get("/:id", getRequest);
router.patch("/:id/respond", respondToRequest);
router.patch("/:id/withdraw", withdrawRequest);

module.exports = router;