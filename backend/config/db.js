const { Pool } = require('pg');
require('dotenv').config();

// Konfigurasi koneksi PostgreSQL Pool (Mendukung Neon PostgreSQL & DATABASE_URL)
const isSslRequired =
  process.env.DB_SSL === 'true' ||
  (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require')) ||
  (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon.tech'));

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isSslRequired ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'bintang_edu',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool({
  ...poolConfig,
  max: 20, // maksimum koneksi di pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test koneksi saat startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

module.exports = pool;
