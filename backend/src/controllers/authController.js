const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

function createToken(user) {
  // Format token IDENTIK dengan temenmu agar saling kompatibel
  return jwt.sign(
    { id: user.id, role: user.role, ibuId: user.ibu_id || null, bidanId: user.bidan_id || null },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  );
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });

    const [rows] = await pool.query(
      `SELECT p.id, p.nama, p.email, p.password, p.role, p.no_hp,
              i.id AS ibu_id,
              b.id AS bidan_id, b.nomor_str, b.tempat_kerja
       FROM pengguna p
       LEFT JOIN ibu i ON i.pengguna_id = p.id
       LEFT JOIN bidan b ON b.pengguna_id = p.id
       WHERE p.email = ? LIMIT 1`,
      [email]
    );

    const user = rows[0];
    if (!user) return res.status(401).json({ success: false, message: 'Email atau password salah.' });

    // Hanya admin & bidan boleh login web
    if (!['admin', 'bidan'].includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Gunakan aplikasi mobile.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Email atau password salah.' });

    const token = createToken(user);
    delete user.password;

    return res.json({
      success: true,
      message: 'Login berhasil.',
      data: { token, user },
    });
  } catch (err) { return next(err); }
}

// GET /api/auth/me
async function me(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.nama, p.email, p.role, p.no_hp,
              b.id AS bidan_id, b.nomor_str, b.tempat_kerja
       FROM pengguna p
       LEFT JOIN bidan b ON b.pengguna_id = p.id
       WHERE p.id = ? LIMIT 1`,
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    return res.json({ success: true, data: rows[0] });
  } catch (err) { return next(err); }
}

// PUT /api/auth/change-password
async function changePassword(req, res, next) {
  try {
    const { password_lama, password_baru } = req.body;
    if (!password_lama || !password_baru)
      return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi.' });
    if (password_baru.length < 6)
      return res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter.' });

    const [rows] = await pool.query('SELECT password FROM pengguna WHERE id = ?', [req.user.id]);
    const valid = await bcrypt.compare(password_lama, rows[0].password);
    if (!valid) return res.status(400).json({ success: false, message: 'Password lama salah.' });

    await pool.query('UPDATE pengguna SET password = ? WHERE id = ?', [await bcrypt.hash(password_baru, 10), req.user.id]);
    return res.json({ success: true, message: 'Password berhasil diubah.' });
  } catch (err) { return next(err); }
}

// GET /api/auth/users (admin only)
async function listUsers(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.nama, p.email, p.role, p.no_hp,
              b.nomor_str, b.tempat_kerja
       FROM pengguna p
       LEFT JOIN bidan b ON b.pengguna_id = p.id
       ORDER BY p.id DESC`
    );
    return res.json({ success: true, data: rows });
  } catch (err) { return next(err); }
}

// POST /api/auth/users (admin only - tambah bidan)
async function createUser(req, res, next) {
  try {
    const { nama, email, password, role, no_hp, nomor_str, tempat_kerja } = req.body;
    if (!nama || !email || !password)
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });

    const [existing] = await pool.query('SELECT id FROM pengguna WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });

    const [result] = await pool.query(
      'INSERT INTO pengguna (nama, email, password, role, no_hp) VALUES (?, ?, ?, ?, ?)',
      [nama, email, await bcrypt.hash(password, 10), role || 'bidan', no_hp || null]
    );

    if ((role || 'bidan') === 'bidan') {
      await pool.query('INSERT INTO bidan (pengguna_id, nomor_str, tempat_kerja) VALUES (?, ?, ?)',
        [result.insertId, nomor_str || null, tempat_kerja || null]);
    }

    return res.status(201).json({ success: true, message: 'User berhasil dibuat.', data: { id: result.insertId, nama, email, role: role || 'bidan' } });
  } catch (err) { return next(err); }
}

module.exports = { login, me, changePassword, listUsers, createUser };
