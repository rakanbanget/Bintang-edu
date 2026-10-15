const pool = require('../config/db');

// Generate kode grup acak (contoh: SAINS123, BELAJAR456)
const generateGroupCode = () => {
  const prefix = 'SAINS';
  const randomNum = Math.floor(100 + Math.random() * 900); // 100-999
  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${randomNum}${randomStr}`;
};

// Buat grup baru (Guru/Orang Tua)
const createGroup = async (req, res) => {
  try {
    const { group_name } = req.body;
    const creator_id = req.user.id;

    if (!group_name || !group_name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama grup wajib diisi' });
    }

    // Cek role: hanya teacher/parent boleh buat grup
    if (!['teacher', 'parent'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Hanya guru atau orang tua yang dapat membuat grup' });
    }

    // Generate kode unik, retry jika collision
    let group_code;
    let attempts = 0;
    do {
      group_code = generateGroupCode();
      const check = await pool.query('SELECT id FROM groups WHERE group_code = $1', [group_code]);
      if (check.rows.length === 0) break;
      attempts++;
    } while (attempts < 5);

    const result = await pool.query(
      `INSERT INTO groups (creator_id, group_name, group_code)
       VALUES ($1, $2, $3) RETURNING *`,
      [creator_id, group_name.trim(), group_code]
    );

    res.status(201).json({
      success: true,
      message: `Grup "${group_name}" berhasil dibuat! Bagikan kode: ${group_code}`,
      group: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Create group error:', error);
    res.status(500).json({ success: false, message: 'Server error saat membuat grup' });
  }
};

// Siswa join grup via kode
const joinGroup = async (req, res) => {
  try {
    const { group_code } = req.body;
    const student_id = req.user.id;

    if (!group_code) {
      return res.status(400).json({ success: false, message: 'Kode grup wajib diisi' });
    }

    // Hanya student boleh join
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Hanya siswa yang dapat bergabung ke grup' });
    }

    // Cari grup berdasarkan kode
    const group = await pool.query('SELECT * FROM groups WHERE group_code = $1', [group_code.toUpperCase().trim()]);
    if (group.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kode grup tidak ditemukan' });
    }

    const group_id = group.rows[0].id;

    // Cek sudah join belum
    const already = await pool.query(
      'SELECT id FROM group_members WHERE group_id = $1 AND student_id = $2',
      [group_id, student_id]
    );
    if (already.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Kamu sudah bergabung di grup ini' });
    }

    await pool.query(
      'INSERT INTO group_members (group_id, student_id) VALUES ($1, $2)',
      [group_id, student_id]
    );

    res.json({
      success: true,
      message: `Berhasil bergabung ke grup "${group.rows[0].group_name}"!`,
      group: group.rows[0],
    });
  } catch (error) {
    console.error('❌ Join group error:', error);
    res.status(500).json({ success: false, message: 'Server error saat bergabung ke grup' });
  }
};

// Lihat progress anggota grup + rekap skor
const getGroupProgress = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Validasi grup ada
    const group = await pool.query('SELECT * FROM groups WHERE id = $1', [groupId]);
    if (group.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Grup tidak ditemukan' });
    }

    // Ambil daftar anggota + skor per modul
    const members = await pool.query(
      `SELECT 
         u.id AS student_id, u.name, u.email, u.learning_style,
         gm.joined_at,
         COALESCE(
           json_agg(
             json_build_object('module_id', ss.module_id, 'module_title', sm.title, 'score', ss.score, 'completed_at', ss.completed_at)
             ORDER BY ss.completed_at DESC
           ) FILTER (WHERE ss.id IS NOT NULL), '[]'
         ) AS scores,
         COALESCE(AVG(ss.score), 0)::int AS avg_score,
         COUNT(ss.id)::int AS modules_completed
       FROM group_members gm
       JOIN users u ON u.id = gm.student_id
       LEFT JOIN student_scores ss ON ss.student_id = u.id
       LEFT JOIN science_modules sm ON sm.id = ss.module_id
       WHERE gm.group_id = $1
       GROUP BY u.id, u.name, u.email, u.learning_style, gm.joined_at
       ORDER BY gm.joined_at ASC`,
      [groupId]
    );

    res.json({
      success: true,
      group: group.rows[0],
      members: members.rows,
      total_members: members.rows.length,
    });
  } catch (error) {
    console.error('❌ Get group progress error:', error);
    res.status(500).json({ success: false, message: 'Server error saat mengambil progress grup' });
  }
};

module.exports = { createGroup, joinGroup, getGroupProgress };
