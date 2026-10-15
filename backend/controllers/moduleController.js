const pool = require('../config/db');

// Bank Modul Baku (Anatomi, Tumbuhan/Ekosistem, Siklus Air, Tata Surya)
const DEFAULT_MODULES = [
  {
    id: 1,
    title: 'Anatomi Tubuh & Panca Indra Manusia 👁️',
    category: 'Biologi Manusia',
    teacher_name: 'Guru Sains Bintang Edu',
    content_data: {
      subtitle: 'Mengenal Fungsi Mata, Telinga, Kulit, Lidah & Saraf Manusia',
      points: 100,
      xp: 60,
      grade: 'Kelas 4–5 SD',
      mission_objective: 'Pahami cara kerja pupil mata mengatur intensitas cahaya, resonansi gendang telinga, papila rasa lidah, dan serabut saraf perasa kulit.',
      lab_station_id: 'human-anatomy',
      organs: [
        { name: 'Mata (Penglihatan)', function: 'Menangkap berkas cahaya melalui kornea dan pupil, difokuskan lensa ke retina lalu dikirim ke otak via saraf optik.' },
        { name: 'Telinga (Pendengaran)', function: 'Menangkap getaran gelombang suara melalui gendang telinga dan koklea menuju saraf pendengaran.' },
        { name: 'Lidah (Pengecap)', function: 'Mendeteksi rasa manis, asam, asin, pahit, dan umami melalui ribuan papila perasa.' },
        { name: 'Kulit (Peraba)', function: 'Meraba tekstur, suhu panas-dingin, dan tekanan melalui reseptor saraf taktil.' },
        { name: 'Sistem Saraf', function: 'Mengalirkan impuls sinyal listrik dari panca indra ke otak dan memicu respons refleks kilat.' }
      ],
      interactive_features: ['Simulasi Dilatasi/Konstriksi Pupil', 'Uji Gelombang Frekuensi Akustik Telinga', 'Peta Rasa Lidah', 'Sensor Reseptor Kulit Taktil']
    }
  },
  {
    id: 2,
    title: 'Dunia Tumbuhan & Ekosistem Hewan 🌿',
    category: 'Botani & Ekologi',
    teacher_name: 'Guru Sains Bintang Edu',
    content_data: {
      subtitle: 'Fotosintesis Klorofil Daun, Siklus Energi & Rantai Makanan',
      points: 100,
      xp: 70,
      grade: 'Kelas 4–6 SD',
      mission_objective: 'Buktikan peran klorofil dan sinar matahari dalam fotosintesis untuk memproduksi glukosa & O2, serta pelajari aliran energi trofik rantai makanan ekosistem.',
      lab_station_id: 'photosynthesis',
      ecosystem: [
        { trophic: 'Produsen (Tingkat 1)', name: 'Tumbuhan Hijau & Rumput 🌿', energy: '1000 kkal', role: 'Fotosintesis menghasilkan glukosa & O₂' },
        { trophic: 'Konsumen Primer (Tingkat 2)', name: 'Belalang & Kelinci 🦗🐇', energy: '100 kkal', role: 'Herbivora pemakan produsen' },
        { trophic: 'Konsumen Sekunder (Tingkat 3)', name: 'Katak & Ular 🐸🐍', energy: '10 kkal', role: 'Karnivora memangsa herbivora' },
        { trophic: 'Predator Puncak (Tingkat 4)', name: 'Burung Elang 🦅', energy: '1 kkal', role: 'Karnivora puncak pengendali ekosistem' },
        { trophic: 'Pengurai (Dekomposer)', name: 'Jamur & Bakteri 🍄', energy: 'Mineral tanah', role: 'Mengurai materi mati menjadi unsur hara' }
      ],
      interactive_features: ['Laboratorium Fotosintesis Interaktif', 'Simulasi Aliran Energi Rantai Makanan', 'Uji Keseimbangan Ekosistem Predator-Mangsa']
    }
  },
  {
    id: 3,
    title: 'Siklus Air & Perubahan Wujud Benda 🌧️',
    category: 'Hidrologi Aktif',
    teacher_name: 'Guru Sains Bintang Edu',
    content_data: {
      subtitle: 'Evaporasi Air Laut, Kondensasi Awan & Presipitasi Hujan',
      points: 100,
      xp: 80,
      grade: 'Kelas 3–5 SD',
      mission_objective: 'Uji perubahan molekul air dari es padat (0°C), cair (50°C), hingga uap gas mendidih (100°C).',
      lab_station_id: 'water-cycle'
    }
  },
  {
    id: 4,
    title: 'Sistem Tata Surya & Gravitasi Planet 🪐',
    category: 'Astronomi',
    teacher_name: 'Guru Sains Bintang Edu',
    content_data: {
      subtitle: 'Matahari, Orbit Planet & Tarikan Gravitasi Kosmik',
      points: 100,
      xp: 85,
      grade: 'Kelas 5–6 SD',
      mission_objective: 'Simulasi orbit dan gaya gravitasi planet Bumi, Mars, dan Jupiter mengitari Matahari.',
      lab_station_id: 'solar-system'
    }
  }
];

// Helper auto-seed jika tabel modul masih kosong di PostgreSQL Neon
let hasSeeded = false;
const autoSeedDefaultModules = async () => {
  if (hasSeeded) return;
  try {
    const check = await pool.query('SELECT COUNT(*) FROM science_modules');
    const count = parseInt(check.rows[0]?.count || '0', 10);
    if (count === 0) {
      // Pastikan ada minimal 1 user guru
      const teacherRes = await pool.query("SELECT id FROM users WHERE role = 'teacher' LIMIT 1");
      let teacherId = teacherRes.rows[0]?.id;
      if (!teacherId) {
        const newTeacher = await pool.query(
          "INSERT INTO users (name, email, password_hash, role) VALUES ('Guru Sains Bintang Edu', 'guru@bintangedu.id', '$2b$10$DummyHashForTestingOnly', 'teacher') RETURNING id"
        );
        teacherId = newTeacher.rows[0].id;
      }
      for (const mod of DEFAULT_MODULES) {
        await pool.query(
          `INSERT INTO science_modules (teacher_id, title, category, content_data)
           VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
          [teacherId, mod.title, mod.category, JSON.stringify(mod.content_data)]
        );
      }
      console.log('🌱 Berhasil auto-seed 4 modul utama ke database Neon!');
    }
    hasSeeded = true;
  } catch (seedErr) {
    // Database mungkin belum siap, lanjutkan dengan fallback
    console.warn('ℹ️ Database seeding info:', seedErr.message);
  }
};

// Ambil semua modul sains
const getAllModules = async (req, res) => {
  try {
    await autoSeedDefaultModules();
    const { category } = req.query;

    let query = `
      SELECT m.*, COALESCE(u.name, 'Guru Sains Bintang Edu') AS teacher_name
      FROM science_modules m
      LEFT JOIN users u ON u.id = m.teacher_id
    `;
    const params = [];

    if (category) {
      query += ' WHERE m.category = $1';
      params.push(category);
    }

    query += ' ORDER BY m.id ASC';

    const result = await pool.query(query, params);

    // Jika tabel ada data, kembalikan
    if (result.rows.length > 0) {
      return res.json({
        success: true,
        count: result.rows.length,
        modules: result.rows,
      });
    }

    // Fallback jika query kosong
    const filtered = category
      ? DEFAULT_MODULES.filter((m) => m.category === category)
      : DEFAULT_MODULES;

    return res.json({
      success: true,
      count: filtered.length,
      modules: filtered,
    });
  } catch (error) {
    console.warn('⚠️ Gagal query database, mengembalikan bank modul baku:', error.message);
    const { category } = req.query;
    const filtered = category
      ? DEFAULT_MODULES.filter((m) => m.category === category)
      : DEFAULT_MODULES;
    return res.json({
      success: true,
      count: filtered.length,
      modules: filtered,
    });
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

    let module = null;
    if (result.rows.length > 0) {
      module = result.rows[0];
    } else {
      const found = DEFAULT_MODULES.find((m) => String(m.id) === String(id));
      if (found) {
        module = found;
      } else {
        return res.status(404).json({ success: false, message: 'Modul tidak ditemukan' });
      }
    }

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
    } else {
      adaptive_hint = '✨ Pelajari materi sains interaktif berikut dan coba langsung simulasi di Lab Virtual!';
    }

    res.json({
      success: true,
      module,
      adaptive_hint,
      learning_style: learningStyle,
    });
  } catch (error) {
    console.warn('⚠️ Detail modul database error, beralih ke bank modul baku:', error.message);
    const found = DEFAULT_MODULES.find((m) => String(m.id) === String(req.params.id));
    if (found) {
      return res.json({
        success: true,
        module: found,
        adaptive_hint: '📖 Modul ini disajikan dengan teks & ilustrasi. Baca perlahan dan pahami setiap langkah!',
        learning_style: 'reading',
      });
    }
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
