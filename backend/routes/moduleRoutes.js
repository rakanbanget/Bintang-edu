const express = require('express');
const { getAllModules, getModuleById, createModule } = require('../controllers/moduleController');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/modules — daftar modul (+ filter ?category=)
router.get('/', optionalAuth, getAllModules);

// GET /api/modules/:id — detail modul adaptif learning_style
router.get('/:id', optionalAuth, getModuleById);

// POST /api/modules — buat modul baru (teacher/parent)
router.post('/', authenticate, createModule);

module.exports = router;
