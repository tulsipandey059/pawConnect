const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const {
  findOfflineUserByEmail,
  upsertOfflineUser,
} = require("../data/mockUsers");

const isDatabaseUnavailableError = (error) => {
  const message = String(error?.message || "").toLowerCase();

  return [
    "buffering timed out",
    "connection timeout",
    "server selection timed out",
    "topology was destroyed",
    "mongo",
    "econnrefused",
    "enotfound",
  ].some((snippet) => message.includes(snippet));
};

const toSafeUser = (user) => ({
  id: user._id || user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  city: user.city || "",
});

const syncOfflineUser = (user, passwordOverride) => {
  if (!user) {
    return null;
  }

  return upsertOfflineUser({
    _id: String(user._id || user.id),
    name: user.name,
    email: user.email,
    password: passwordOverride || user.password,
    role: user.role || "owner",
    phone: user.phone || "",
    city: user.city || "",
    avatar: user.avatar || "",
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

exports.register = asyncHandler(async (req, res) => {
  console.log("Register attempt:", req.body);

  const {
    name,
    email,
    password,
    role = "owner",
    phone = "",
    city = "",
  } = req.body;

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

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      const error = new Error(
        "Account already exists for this email. Please login or use different email."
      );
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      phone: phone.trim(),
      city: city.trim(),
    });

    syncOfflineUser(user);

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: toSafeUser(user),
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    console.warn("Registration error:", error.message);

    if (isDatabaseUnavailableError(error)) {
      const normalizedEmail = email.trim().toLowerCase();
      const existingOfflineUser = findOfflineUserByEmail(normalizedEmail);

      if (existingOfflineUser) {
        return res.status(409).json({
          success: false,
          message: "Account already exists for this email. Please login.",
        });
      }

      const mockUser = syncOfflineUser({
        _id: `mock_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
        phone: phone.trim(),
        city: city.trim(),
        createdAt: new Date().toISOString(),
        avatar: "",
      }, password);

      return res.status(201).json({
        success: true,
        message: "Registered in offline mode",
        token: generateToken(mockUser._id),
        user: toSafeUser(mockUser),
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed. Please try again.",
    });
  }
});

exports.login = asyncHandler(async (req, res) => {
  console.log("Login attempt:", req.body.email);

  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    const error = new Error("Email and password required");
    error.statusCode = 400;
    throw error;
  }

  try {
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

    syncOfflineUser(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: toSafeUser(user),
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    console.warn("Authentication error:", error.message);

    if (isDatabaseUnavailableError(error)) {
      const normalizedEmail = email.trim().toLowerCase();
      const offlineUser = findOfflineUserByEmail(normalizedEmail);

      if (!offlineUser) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const storedPassword = offlineUser.password || "";
      const passwordMatches = storedPassword.startsWith("$2")
        ? await bcrypt.compare(password, storedPassword)
        : storedPassword === password;

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful (offline mode)",
        token: generateToken(offlineUser._id),
        user: toSafeUser(offlineUser),
      });
    }

    const statusCode = String(error.message || "").includes("credentials")
      ? 401
      : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Authentication failed. Please try again.",
    });
  }
});

exports.getMe = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (user) {
      syncOfflineUser(user);

      return res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    console.warn("Database lookup failed for getMe");
  }

  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id || req.user.id,
      ...toSafeUser(req.user),
    },
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  res.json({ message: "Update profile (not implemented yet)" });
});

exports.changePassword = asyncHandler(async (req, res) => {
  res.json({ message: "Change password (not implemented yet)" });
});

exports.googleCallback = asyncHandler(async (req, res) => {
  res.json({ message: "Google auth success (implement redirect later)" });
});
