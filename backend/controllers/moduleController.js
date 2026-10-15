const pool = require('../config/db');

// Ambil semua modul sains
const getAllModules = async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT m.*, u.name AS teacher_name
      FROM science_modules m
      JOIN users u ON u.id = m.teacher_id
    `;
    const params = [];

    if (category) {
      query += ' WHERE m.category = $1';
      params.push(category);
    }

    query += ' ORDER BY m.created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      modules: result.rows,
    });
  } catch (error) {
    console.error('❌ Get modules error:', error);
    res.status(500).json({ success: false, message: 'Server error saat mengambil modul' });
  }
};

// Ambil detail modul — adaptif berdasarkan learning_style siswa
const getModuleById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT m.*, u.name AS teacher_name
       FROM science_modules m
       JOIN users u ON u.id = m.teacher_id
       WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Modul tidak ditemukan' });
    }

    const module = result.rows[0];

    // Jika user login sebagai student, adaptasi format berdasarkan learning_style
    let learningStyle = null;
    if (req.user) {
      const userRes = await pool.query('SELECT learning_style FROM users WHERE id = $1', [req.user.id]);
      learningStyle = userRes.rows[0]?.learning_style || null;
    }

    // Tambahkan hint adaptif
    let adaptive_hint = null;
    if (learningStyle === 'auditory') {
      adaptive_hint = '🎧 Modul ini disajikan dengan narasi audio & penjelasan lisan. Dengarkan dengan seksama!';
    } else if (learningStyle === 'reading') {
      adaptive_hint = '📖 Modul ini disajikan dengan teks & ilustrasi. Baca perlahan dan pahami setiap langkah!';
    }

    res.json({
      success: true,
      module,
      adaptive_hint,
      learning_style: learningStyle,
    });
  } catch (error) {
    console.error('❌ Get module detail error:', error);
    res.status(500).json({ success: false, message: 'Server error saat mengambil detail modul' });
  }
};

// Guru membuat modul baru
const createModule = async (req, res) => {
  try {
    const { title, category, content_data } = req.body;
    const teacher_id = req.user.id;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Judul modul wajib diisi' });
    }

    if (!['teacher', 'parent'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Hanya guru/orang tua yang dapat membuat modul' });
    }

    const result = await pool.query(
      `INSERT INTO science_modules (teacher_id, title, category, content_data)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [teacher_id, title.trim(), category || null, content_data ? JSON.stringify(content_data) : null]
    );

    res.status(201).json({
      success: true,
      message: `Modul "${title}" berhasil dibuat!`,
      module: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Create module error:', error);
    res.status(500).json({ success: false, message: 'Server error saat membuat modul' });
  }
};

// Simpan skor siswa setelah menyelesaikan modul
const submitScore = async (req, res) => {
  try {
    const { module_id, score } = req.body;
    const student_id = req.user.id;

    if (!module_id || score === undefined || score === null) {
      return res.status(400).json({ success: false, message: 'module_id dan score wajib diisi' });
    }

    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ success: false, message: 'Score harus angka 0-100' });
    }

    // Validasi modul ada
    const mod = await pool.query('SELECT id FROM science_modules WHERE id = $1', [module_id]);
    if (mod.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Modul tidak ditemukan' });
    }

    // Upsert: jika sudah ada, update skor terbaru
    const result = await pool.query(
      `INSERT INTO student_scores (student_id, module_id, score)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, module_id)
       DO UPDATE SET score = EXCLUDED.score, completed_at = NOW()
       RETURNING *`,
      [student_id, module_id, score]
    );

    res.status(201).json({
      success: true,
      message: `Skor ${score} berhasil disimpan! ${score >= 80 ? '🌟 Luar biasa!' : score >= 60 ? '👍 Bagus!' : '💪 Terus semangat!'}`,
      score: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Submit score error:', error);
    res.status(500).json({ success: false, message: 'Server error saat menyimpan skor' });
  }
};

// Ambil rekap skor siswa (untuk dashboard)
const getMyScores = async (req, res) => {
  try {
    const student_id = req.user.id;

    const result = await pool.query(
      `SELECT ss.*, sm.title, sm.category
       FROM student_scores ss
       JOIN science_modules sm ON sm.id = ss.module_id
       WHERE ss.student_id = $1
       ORDER BY ss.completed_at DESC`,
      [student_id]
    );

    const avgResult = await pool.query(
      'SELECT COALESCE(AVG(score), 0)::int AS avg_score, COUNT(*)::int AS total FROM student_scores WHERE student_id = $1',
      [student_id]
    );

    res.json({
      success: true,
      scores: result.rows,
      summary: avgResult.rows[0],
    });
  } catch (error) {
    console.error('❌ Get scores error:', error);
    res.status(500).json({ success: false, message: 'Server error saat mengambil skor' });
  }
};

module.exports = { getAllModules, getModuleById, createModule, submitScore, getMyScores };
