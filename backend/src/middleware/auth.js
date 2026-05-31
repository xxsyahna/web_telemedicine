// Middleware JWT identik dengan temenmu
// Supaya token yang dibuat mobile bisa dibaca web dan sebaliknya
// PENTING: JWT_SECRET di .env harus SAMA dengan temenmu
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan. Silakan login.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau kadaluarsa.' });
  }
}

// Middleware cek role (admin atau bidan saja yang boleh akses web)
function requireBidanOrAdmin(req, res, next) {
  if (!['admin', 'bidan'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya admin/bidan yang bisa mengakses portal web.' });
  }
  return next();
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya admin.' });
  }
  return next();
}

module.exports = { auth, requireBidanOrAdmin, requireAdmin };
