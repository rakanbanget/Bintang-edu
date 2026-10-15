const express = require('express');
const { createGroup, joinGroup, getGroupProgress } = require('../controllers/groupController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Semua endpoint grup butuh autentikasi
router.use(authenticate);

// POST /api/groups — buat grup baru (teacher/parent)
router.post('/', createGroup);

// POST /api/groups/join — siswa join via kode
router.post('/join', joinGroup);

// GET /api/groups/:groupId/progress — lihat progress anggota + skor
router.get('/:groupId/progress', getGroupProgress);

module.exports = router;
