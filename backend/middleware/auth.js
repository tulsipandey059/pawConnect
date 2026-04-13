const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getJwtSecret } = require("../utils/generateToken");
const { findOfflineUserById } = require("../data/mockUsers");

// Protect routes — must be logged in
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    // Try MongoDB first with a short timeout
    try {
      req.user = await Promise.race([
        User.findById(decoded.id).select("-password"),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 2000))
      ]);
      if (req.user) {
        return next();
      }
    } catch (dbError) {
      console.warn("Database lookup timeout/failed, using mock users");
    }

    // Fallback to mock users
    const mockUser = findOfflineUserById(decoded.id);
    if (mockUser) {
      req.user = {
        _id: mockUser._id,
        id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        phone: mockUser.phone,
        city: mockUser.city,
      };
      return next();
    }

    return res.status(401).json({ success: false, message: "User no longer exists." });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

// Grant access to specific roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized for this action`
      });
    }
    next();
  };
};

// Admin only
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};

exports.attachUserIfPresent = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    // Try MongoDB first
    try {
      req.user = await User.findById(decoded.id).select("-password");
      if (req.user) {
        return next();
      }
    } catch (dbError) {
      console.warn("⚠️  Database lookup failed, checking mock users");
    }

    // Fallback to mock users
    const mockUser = findOfflineUserById(decoded.id);
    if (mockUser) {
      req.user = {
        _id: mockUser._id,
        id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        phone: mockUser.phone,
        city: mockUser.city,
      };
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }

  return next();
};
