-- ============================================
-- BINTANG EDU - Database Schema
-- Platform Edukasi Sains Interaktif Anak SD
-- ============================================

-- Drop tables jika sudah ada (untuk development)
DROP TABLE IF EXISTS student_scores CASCADE;
DROP TABLE IF EXISTS science_modules CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. TABEL USERS
-- Menyimpan data pengguna (guru, orang tua, siswa)
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'parent', 'student')),
  learning_style VARCHAR(20) CHECK (learning_style IN ('auditory', 'reading')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index untuk pencarian email
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 2. TABEL GROUPS
-- Fitur Kelas/Grup untuk guru & orang tua
-- ============================================
CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  creator_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_name VARCHAR(100) NOT NULL,
  group_code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index untuk pencarian group_code
CREATE INDEX idx_groups_code ON groups(group_code);

-- ============================================
-- 3. TABEL GROUP_MEMBERS
-- Relasi siswa ke grup
-- ============================================
CREATE TABLE group_members (
  id SERIAL PRIMARY KEY,
  group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, student_id) -- Siswa tidak bisa join grup yang sama 2x
);

-- Index untuk query progress siswa per grup
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_student ON group_members(student_id);

-- ============================================
-- 4. TABEL SCIENCE_MODULES
-- Modul Sains Interaktif (ala Scratch)
-- ============================================
CREATE TABLE science_modules (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  content_data JSONB, -- Menyimpan konfigurasi materi interaktif
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index untuk filter kategori
CREATE INDEX idx_modules_category ON science_modules(category);
CREATE INDEX idx_modules_teacher ON science_modules(teacher_id);

-- ============================================
-- 5. TABEL STUDENT_SCORES
-- Rekap Nilai Siswa
-- ============================================
CREATE TABLE student_scores (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id INT NOT NULL REFERENCES science_modules(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 0 AND score <= 100),
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, module_id) -- Satu skor per modul per siswa
);

-- Index untuk query progress siswa
CREATE INDEX idx_scores_student ON student_scores(student_id);
CREATE INDEX idx_scores_module ON student_scores(module_id);

-- ============================================
-- SAMPLE DATA UNTUK TESTING
-- ============================================

-- Insert sample teacher (password: 'teacher123' - sudah di-hash)
INSERT INTO users (name, email, password_hash, role) VALUES
('Guru Sains', 'guru@bintangedu.id', '$2b$10$DummyHashForTestingPurposesOnly', 'teacher');

-- Insert sample student (password: 'student123')
INSERT INTO users (name, email, password_hash, role, learning_style) VALUES
('Ahmad Ilmuwan', 'ahmad@bintangedu.id', '$2b$10$DummyHashForTestingPurposesOnly', 'student', 'reading');

-- Insert sample modules
INSERT INTO science_modules (teacher_id, title, category, content_data) VALUES
(1, 'Sistem Tata Surya', 'Astronomi', '{"description": "Pelajari planet-planet di tata surya kita", "difficulty": "easy"}'),
(1, 'Siklus Air', 'Geografi', '{"description": "Bagaimana air beredar di bumi", "difficulty": "medium"}'),
(1, 'Rantai Makanan', 'Biologi', '{"description": "Hubungan antar makhluk hidup", "difficulty": "easy"}');

-- ============================================
-- SELESAI
-- ============================================
SELECT '✅ Database schema created successfully!' AS status;
