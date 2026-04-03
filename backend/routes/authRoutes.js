const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  googleCallback,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const passport = require("passport");

// Validation rules
const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback", 
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: '/login' 
  }), 
  googleCallback
);

router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;

