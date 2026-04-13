require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const morgan  = require("morgan");
const path    = require("path");

const connectDB    = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes     = require("./routes/authRoutes");
const petRoutes      = require("./routes/petRoutes");
const emergencyRoutes  = require("./routes/emergencyRoutes");
const adoptionRoutes   = require("./routes/adoptionRoutes");
const petHealthRoutes  = require("./routes/petHealthRoutes");

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000', 
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session for passport
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport
const passport = require('passport');
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🐾 PawConnect API is running",
    version: "2.0.0",
    features: ["JWT Auth", "Pet CRUD", "Cloudinary Image Upload", "Emergencies", "Adoption Requests"],
    endpoints: {
      auth:             "/api/auth",
      pets:             "/api/pets",
      addPet:           "POST /api/pets/add-pet  (multipart/form-data)",
      similaritySearch: "POST /api/pets/similarity-search",
      emergencies:      "/api/emergencies",
      adoptionRequests: "/api/adoption-requests",
      petHealth:        "/api/pet-health",
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth",              authRoutes);
app.use("/api/pets",              petRoutes);
app.use("/api/emergencies",       emergencyRoutes);
app.use("/api/adoption-requests", adoptionRoutes);
app.use("/api/pet-health",        petHealthRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🐾  PawConnect API v2`);
      console.log(`🚀  Server  → http://localhost:${PORT}  [${process.env.NODE_ENV || "development"}]`);
      console.log(`☁️   Cloudinary folder → pawconnect/pets\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

