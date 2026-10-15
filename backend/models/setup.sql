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

-- Insert sample modules lengkap
INSERT INTO science_modules (teacher_id, title, category, content_data) VALUES
(1, 'Anatomi Tubuh & Panca Indra Manusia 👁️', 'Biologi Manusia', '{
  "subtitle": "Mengenal Fungsi Mata, Telinga, Kulit, Lidah & Saraf Manusia",
  "grade": "Kelas 4–5 SD",
  "points": 100,
  "xp": 60,
  "mission_objective": "Pahami cara kerja pupil mata mengatur intensitas cahaya, resonansi gendang telinga, papila rasa lidah, dan serabut saraf perasa kulit.",
  "lab_station_id": "human-anatomy",
  "organs": [
    {"name": "Mata (Penglihatan)", "function": "Menangkap berkas cahaya melalui kornea dan pupil, difokuskan lensa ke retina lalu dikirim ke otak via saraf optik."},
    {"name": "Telinga (Pendengaran)", "function": "Menangkap getaran gelombang suara melalui gendang telinga dan koklea menuju saraf pendengaran."},
    {"name": "Lidah (Pengecap)", "function": "Mendeteksi rasa manis, asam, asin, pahit, dan umami melalui ribuan papila perasa."},
    {"name": "Kulit (Peraba)", "function": "Meraba tekstur, suhu panas-dingin, dan tekanan melalui reseptor saraf taktil."},
    {"name": "Sistem Saraf", "function": "Mengalirkan impuls sinyal listrik dari panca indra ke otak dan memicu respons refleks."}
  ]
}'),
(1, 'Dunia Tumbuhan & Ekosistem Hewan 🌿', 'Botani & Ekologi', '{
  "subtitle": "Fotosintesis Klorofil Daun, Siklus Energi & Rantai Makanan",
  "grade": "Kelas 4–6 SD",
  "points": 100,
  "xp": 70,
  "mission_objective": "Buktikan peran klorofil dan sinar matahari dalam fotosintesis untuk memproduksi glukosa & O2, serta pelajari aliran energi trofik rantai makanan ekosistem.",
  "lab_station_id": "photosynthesis",
  "ecosystem": [
    {"trophic": "Produsen (Tingkat 1)", "name": "Tumbuhan Hijau & Rumput 🌿", "energy": "1000 kkal", "role": "Fotosintesis menghasilkan glukosa & O₂"},
    {"trophic": "Konsumen Primer (Tingkat 2)", "name": "Belalang & Kelinci 🦗🐇", "energy": "100 kkal", "role": "Herbivora pemakan produsen"},
    {"trophic": "Konsumen Sekunder (Tingkat 3)", "name": "Katak & Ular 🐸🐍", "energy": "10 kkal", "role": "Karnivora memangsa herbivora"},
    {"trophic": "Predator Puncak (Tingkat 4)", "name": "Burung Elang 🦅", "energy": "1 kkal", "role": "Karnivora puncak pengendali ekosistem"},
    {"trophic": "Pengurai (Dekomposer)", "name": "Jamur & Bakteri 🍄", "energy": "Mineral tanah", "role": "Mengurai materi mati menjadi unsur hara"}
  ]
}'),
(1, 'Siklus Air & Perubahan Wujud Benda 🌧️', 'Hidrologi Aktif', '{
  "subtitle": "Evaporasi Air Laut, Kondensasi Awan & Presipitasi Hujan",
  "grade": "Kelas 3–5 SD",
  "points": 100,
  "xp": 80,
  "mission_objective": "Uji perubahan molekul air dari es padat (0°C), cair (50°C), hingga uap gas mendidih (100°C).",
  "lab_station_id": "water-cycle"
}'),
(1, 'Sistem Tata Surya & Gravitasi Planet 🪐', 'Astronomi', '{
  "subtitle": "Matahari, Orbit Planet & Tarikan Gravitasi Kosmik",
  "grade": "Kelas 5–6 SD",
  "points": 100,
  "xp": 85,
  "mission_objective": "Simulasi orbit dan gaya gravitasi planet Bumi, Mars, dan Jupiter mengitari Matahari.",
  "lab_station_id": "solar-system"
}');

-- ============================================
-- SELESAI
-- ============================================
SELECT '✅ Database schema created successfully!' AS status;
