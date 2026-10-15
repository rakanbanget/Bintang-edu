const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Helper: Validasi kekuatan password
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);

  if (password.length < minLength || !hasUppercase || !hasLowercase || !hasDigit) {
    return { 
      valid: false, 
      message: 'Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, serta angka.' 
    };
  }

  return { valid: true, message: 'Password kuat!' };
};

// Register user baru
const register = async (req, res) => {
  try {
    const { name, email, password, role, learning_style } = req.body;

    // Validasi input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nama, email, password, dan role wajib diisi' 
      });
    }

    if (!['teacher', 'parent', 'student'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Role harus salah satu: teacher, parent, atau student' 
      });
    }

    // Validasi kekuatan password
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ 
        success: false, 
        message: passwordCheck.message 
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email ini sudah terdaftar. Silakan gunakan email lain atau login.' 
      });
    }

    // Hash password dengan bcrypt
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user baru
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, learning_style)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role`,
      [name, email, password_hash, role, learning_style || null]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.rows[0].id, role: result.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Silakan login.',
      user: result.rows[0],
      token
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error saat registrasi' 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email dan password wajib diisi' 
      });
    }

    // Cek user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password yang kamu masukkan salah.' 
      });
    }

    const user = result.rows[0];

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password yang kamu masukkan salah.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login berhasil! Selamat datang, ' + user.name,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        learning_style: user.learning_style
      },
      token
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error saat login' 
    });
  }
};

// Update learning style siswa (Survey)
const updateLearningStyle = async (req, res) => {
  try {
    // Terima userId dari body (frontend kirim) atau dari token
    const { learning_style, userId } = req.body;
    const studentId = (req.user && req.user.id) || userId;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'userId wajib diisi'
      });
    }

    // Validasi input
    if (!['auditory', 'reading'].includes(learning_style)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Gaya belajar harus auditory atau reading' 
      });
    }

    // Update learning style
    const result = await pool.query(
      'UPDATE users SET learning_style = $1 WHERE id = $2 RETURNING id, name, email, role, learning_style',
      [learning_style, studentId]
    );

    res.json({
      success: true,
      message: 'Gaya belajar berhasil diperbarui!',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Update learning style error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error saat mengupdate gaya belajar' 
    });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, learning_style FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  updateLearningStyle,
  getMe
};
