const express = require('express');
const { register, login, updateLearningStyle, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/auth/me — cek user login
router.get('/me', authenticate, getMe);

// POST /api/auth/register — daftar user baru
router.post('/register', register);

// POST /api/auth/login — login & dapatkan JWT
router.post('/login', login);

// POST /api/students/survey — update learning_style (butuh login)
router.post('/students/survey', authenticate, updateLearningStyle);

module.exports = router;
