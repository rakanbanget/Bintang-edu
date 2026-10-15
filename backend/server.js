const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const quizRoutes = require('./routes/quizRoutes');
const { authenticate } = require('./middleware/auth');
const { updateLearningStyle } = require('./controllers/authController');
const { submitScore, getMyScores } = require('./controllers/moduleController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: '🚀 Bintang Edu API is running!', version: '1.0.0' });
});

// Routes sesuai spec
app.use('/api/auth', authRoutes);          // POST /api/auth/register, POST /api/auth/login
app.post('/api/students/survey', authenticate, updateLearningStyle); // POST /api/students/survey
app.use('/api/groups', groupRoutes);       // POST /api/groups, POST /api/groups/join, GET /api/groups/:groupId/progress
app.use('/api/modules', moduleRoutes);     // GET /api/modules, GET /api/modules/:id
app.post('/api/scores', authenticate, submitScore);   // POST /api/scores
app.get('/api/scores/my', authenticate, getMyScores); // GET rekap skor (bonus)
app.use('/api', quizRoutes);                 // POST /api/generate-quiz

// Endpoint kuis interaktif Bintang Edu
app.get('/api/quiz/:id', (req, res) => {
  const quizId = parseInt(req.params.id, 10);
  res.json({
    success: true,
    quizId,
    message: `Data kuis #${quizId} berhasil diambil dari server Express.js Bintang Edu (Port 5001)`,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌟 Bintang Edu Backend running on port ${PORT} (0.0.0.0)`);
  console.log(`   Auth   : POST /api/auth/register | POST /api/auth/login`);
  console.log(`   Survey : POST /api/students/survey`);
  console.log(`   Groups : POST /api/groups | POST /api/groups/join | GET /api/groups/:id/progress`);
  console.log(`   Modules: GET /api/modules | GET /api/modules/:id`);
  console.log(`   Scores : POST /api/scores`);
  console.log(`   Quiz AI: POST /api/generate-quiz\n`);
});

module.exports = app;
