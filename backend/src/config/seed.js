// Seed: buat akun bidan & admin untuk login web
// Jalankan: npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seed() {
  try {
    console.log('🔄 Menjalankan seeder...');

    // Cek & buat admin
    const [adminRows] = await pool.query('SELECT id FROM pengguna WHERE email = ?', ['admin@posyandu.com']);
    if (adminRows.length === 0) {
      const [res] = await pool.query(
        'INSERT INTO pengguna (nama, email, password, role, no_hp) VALUES (?, ?, ?, ?, ?)',
        ['Admin Posyandu', 'admin@posyandu.com', await bcrypt.hash('admin123', 10), 'admin', '08123456789']
      );
      console.log('✅ Admin: admin@posyandu.com / admin123');
    } else {
      console.log('ℹ️  Admin sudah ada.');
    }

    // Cek & buat bidan
    const [bidanRows] = await pool.query('SELECT id FROM pengguna WHERE email = ?', ['bidan@posyandu.com']);
    if (bidanRows.length === 0) {
      const [res] = await pool.query(
        'INSERT INTO pengguna (nama, email, password, role, no_hp) VALUES (?, ?, ?, ?, ?)',
        ['Bidan Sari', 'bidan@posyandu.com', await bcrypt.hash('bidan123', 10), 'bidan', '08987654321']
      );
      // Buat entry di tabel bidan
      await pool.query(
        'INSERT INTO bidan (pengguna_id, nomor_str, tempat_kerja) VALUES (?, ?, ?)',
        [res.insertId, 'STR-001-2024', 'Posyandu Melati']
      );
      console.log('✅ Bidan: bidan@posyandu.com / bidan123');
    } else {
      console.log('ℹ️  Bidan sudah ada.');
    }

    console.log('\n✅ Seeder selesai!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder gagal:', err.message);
    process.exit(1);
  }
}

seed();
