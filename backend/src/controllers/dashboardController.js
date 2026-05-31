const pool = require('../config/db');

// GET /api/dashboard
async function dashboard(req, res, next) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bulanStart = today.slice(0, 8) + '01';
    const bulanEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
    const tiga_bulan_lalu = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Total anak & ibu
    const [[{ total_anak }]] = await pool.query('SELECT COUNT(*) AS total_anak FROM anak');
    const [[{ total_ibu }]] = await pool.query('SELECT COUNT(*) AS total_ibu FROM ibu');

    // Imunisasi hari ini (pending)
    const [[{ imunisasi_hari_ini }]] = await pool.query(
      `SELECT COUNT(*) AS imunisasi_hari_ini FROM imunisasi WHERE status = 'pending' AND tanggal_jadwal = ?`,
      [today]
    );

    // Imunisasi bulan ini
    const [[{ total_imu }]] = await pool.query(
      `SELECT COUNT(*) AS total_imu FROM imunisasi WHERE tanggal_jadwal BETWEEN ? AND ?`,
      [bulanStart, bulanEnd]
    );
    const [[{ selesai_imu }]] = await pool.query(
      `SELECT COUNT(*) AS selesai_imu FROM imunisasi WHERE status = 'selesai' AND tanggal_jadwal BETWEEN ? AND ?`,
      [bulanStart, bulanEnd]
    );

    // Status gizi 3 bulan terakhir
    const [giziRows] = await pool.query(
      `SELECT status_gizi, COUNT(*) AS jumlah FROM pemeriksaan
       WHERE tanggal_pemeriksaan >= ? AND status_gizi IS NOT NULL
       GROUP BY status_gizi`,
      [tiga_bulan_lalu]
    );
    const status_gizi = { normal: 0, kurang: 0, buruk: 0, lainnya: 0 };
    giziRows.forEach(r => {
      const k = r.status_gizi?.toLowerCase();
      if (status_gizi[k] !== undefined) status_gizi[k] += r.jumlah;
      else status_gizi.lainnya += r.jumlah;
    });

    return res.json({
      success: true,
      data: {
        total_anak,
        total_ibu,
        imunisasi_hari_ini,
        imunisasi_bulan_ini: {
          total: total_imu,
          selesai: selesai_imu,
          pending: total_imu - selesai_imu,
        },
        status_gizi,
      },
    });
  } catch (err) { return next(err); }
}

module.exports = { dashboard };
