const express = require('express');
const { registerUser, loginUser, getMeUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { errorHandler } = require('../middleware/errorMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, getMeUser);

module.exports = router;

