const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔑 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret123", {
    expiresIn: "7d",
  });
};

// =========================
// ✅ REGISTER USER
// =========================
exports.register = asyncHandler(async (req, res) => {
  console.log('📝 Register attempt:', req.body); // DEBUG

  const { name, email, password, role = 'user', phone = '', city = '' } = req.body;

  // Validate required fields
  if (!name?.trim()) {
    const error = new Error("Name is required");
    error.statusCode = 400;
    throw error;
  }
  if (!email?.trim()) {
    const error = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }
  if (!password || password.length < 6) {
    const error = new Error("Password must be at least 6 characters");
    error.statusCode = 400;
    throw error;
  }

  // Check existing user
  const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
  if (existingUser) {
    const error = new Error("User already exists with this email");
    error.statusCode = 409;
    throw error;
  }

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role,
    phone: phone.trim(),
    city: city.trim(),
  });

  console.log('✅ User created:', user._id); // DEBUG

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
    },
  });
});

// =========================
// ✅ LOGIN USER
// =========================
exports.login = asyncHandler(async (req, res) => {
  console.log('🔐 Login attempt:', req.body.email); // DEBUG

  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    const error = new Error("Email and password required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  console.log('✅ Login success:', user._id); // DEBUG

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// =========================
// ✅ GET CURRENT USER
// =========================
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.status(200).json({
    success: true,
    user,
  });
});

// =========================
// (OPTIONAL PLACEHOLDERS)
// =========================
exports.updateProfile = asyncHandler(async (req, res) => {
  res.json({ message: "Update profile (not implemented yet)" });
});

exports.changePassword = asyncHandler(async (req, res) => {
  res.json({ message: "Change password (not implemented yet)" });
});

exports.googleCallback = asyncHandler(async (req, res) => {
  res.json({ message: "Google auth success (implement redirect later)" });
});