const pool = require('../config/db');

// GET /api/ibu
async function listIbu(req, res, next) {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params = [];
    let where = 'WHERE 1=1';

    if (search) {
      where += ' AND (p.nama LIKE ? OR i.nik LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM ibu i JOIN pengguna p ON p.id = i.pengguna_id ${where}`, params
    );

    const [rows] = await pool.query(
      `SELECT i.id, i.nik, i.alamat, i.tanggal_lahir,
              p.nama, p.email, p.no_hp,
              (SELECT COUNT(*) FROM anak a WHERE a.ibu_id = i.id) AS jumlah_anak
       FROM ibu i
       JOIN pengguna p ON p.id = i.pengguna_id
       ${where}
       ORDER BY i.id DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    return res.json({
      success: true,
      data: rows,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
    });
  } catch (err) { return next(err); }
}

// GET /api/ibu/:id
async function getIbu(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT i.id, i.nik, i.alamat, i.tanggal_lahir,
              p.nama, p.email, p.no_hp
       FROM ibu i JOIN pengguna p ON p.id = i.pengguna_id
       WHERE i.id = ? LIMIT 1`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Data ibu tidak ditemukan.' });

    const [anak] = await pool.query('SELECT id, nama, tanggal_lahir, jenis_kelamin FROM anak WHERE ibu_id = ?', [req.params.id]);
    return res.json({ success: true, data: { ...rows[0], anak } });
  } catch (err) { return next(err); }
}

// PUT /api/ibu/:id (bidan hanya bisa edit NIK & alamat)
async function updateIbu(req, res, next) {
  try {
    const { nik, alamat, tanggal_lahir } = req.body;
    await pool.query('UPDATE ibu SET nik=?, alamat=?, tanggal_lahir=? WHERE id=?',
      [nik, alamat || null, tanggal_lahir || null, req.params.id]);
    return res.json({ success: true, message: 'Data ibu berhasil diupdate.' });
  } catch (err) { return next(err); }
}

module.exports = { listIbu, getIbu, updateIbu };
