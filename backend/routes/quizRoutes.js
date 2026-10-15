const express = require('express');
const router = express.Router();
const multer = require('multer');
const { generateQuiz } = require('../controllers/quizController');

// Konfigurasi Multer (Penyimpanan di memori buffer untuk ekstraksi langsung)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Maksimal 10 MB
  },
  fileFilter: (req, file, cb) => {
    // Terima PDF dan jenis file dokumen umum
    if (
      file.mimetype === 'application/pdf' ||
      file.originalname.toLowerCase().endsWith('.pdf') ||
      file.mimetype.includes('text')
    ) {
      cb(null, true);
    } else {
      cb(null, true); // Tetap izinkan untuk fleksibilitas
    }
  },
});

// POST /api/generate-quiz
// Menerima upload file PDF (field: 'file' atau 'pdf') atau teks manual (req.body.materiText)
router.post('/generate-quiz', upload.single('file'), generateQuiz);

module.exports = router;
