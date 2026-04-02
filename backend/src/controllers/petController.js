const Pet = require('../models/Pet');
const ErrorResponse = require('../utils/errorResponse');
const { cloudinary, storage } = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage });

// @desc    Add new pet
// @route   POST /api/pets
// @access  Private
const addPet = async (req, res, next) => {
  try {
    const petData = { ...req.body, user: req.user.id };
    if (req.file) {
      petData.images = [req.file.path];
    }
    const pet = await Pet.create(petData);
    res.status(201).json(pet);
  } catch (error) {
    next(error);
  }
};


// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
const getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find().populate('user', 'name');
    res.json(pets);
  } catch (error) {
    next(error);
  }
};

module.exports = { addPet, getPets };


