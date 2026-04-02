const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
// TODO: implement adoption and emergency routes
// app.use('/api/adoptions', require('./routes/adoptionRoutes'));
// app.use('/api/emergency', require('./routes/emergencyRoutes'));


// Error Handler
app.use(errorMiddleware);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'PawConnect Backend is running!' });
});

module.exports = app;

