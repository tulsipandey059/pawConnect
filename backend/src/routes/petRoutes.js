const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getPets, addPet } = require('../controllers/petController');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const router = express.Router();

router.get('/', getPets);
router.post('/', protect, upload.single('image'), addPet);

module.exports = router;

