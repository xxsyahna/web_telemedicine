const PDFDocument = require('pdfkit');
const pool = require('../config/db');

// GET /api/laporan/rekap-bulanan
async function rekapBulanan(req, res, next) {
  try {
    const b = req.query.bulan || (new Date().getMonth() + 1);
    const t = req.query.tahun || new Date().getFullYear();

    const [[{ total_pemeriksaan }]] = await pool.query(
      `SELECT COUNT(*) AS total_pemeriksaan FROM pemeriksaan
       WHERE MONTH(tanggal_pemeriksaan)=? AND YEAR(tanggal_pemeriksaan)=?`, [b, t]
    );

    const [giziRows] = await pool.query(
      `SELECT status_gizi, COUNT(*) AS jumlah FROM pemeriksaan
       WHERE MONTH(tanggal_pemeriksaan)=? AND YEAR(tanggal_pemeriksaan)=?
       GROUP BY status_gizi`, [b, t]
    );
    const status_gizi = { normal: 0, kurang: 0, buruk: 0 };
    giziRows.forEach(r => { if (status_gizi[r.status_gizi] !== undefined) status_gizi[r.status_gizi] = r.jumlah; });

    const [[{ total_imu }]] = await pool.query(
      `SELECT COUNT(*) AS total_imu FROM imunisasi
       WHERE MONTH(tanggal_jadwal)=? AND YEAR(tanggal_jadwal)=?`, [b, t]
    );
    const [[{ selesai_imu }]] = await pool.query(
      `SELECT COUNT(*) AS selesai_imu FROM imunisasi
       WHERE status='selesai' AND MONTH(tanggal_jadwal)=? AND YEAR(tanggal_jadwal)=?`, [b, t]
    );

    const bulanNama = ['','Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

    return res.json({
      success: true,
      data: {
        periode: `${bulanNama[b]} ${t}`,
        total_pemeriksaan,
        status_gizi,
        imunisasi: { total: total_imu, selesai: selesai_imu, pending: total_imu - selesai_imu },
      }
    });
  } catch (err) { return next(err); }
}

// POST /api/laporan/simpan
async function simpanLaporan(req, res, next) {
  try {
    const b = req.body.bulan || (new Date().getMonth() + 1);
    const t = req.body.tahun || new Date().getFullYear();
    const bulanNama = ['','Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

    const [[{ total_anak }]] = await pool.query('SELECT COUNT(*) AS total_anak FROM anak');
    const [[{ total_stunting }]] = await pool.query(
      `SELECT COUNT(*) AS total_stunting FROM pemeriksaan
       WHERE status_gizi IN ('kurang','buruk') AND MONTH(tanggal_pemeriksaan)=? AND YEAR(tanggal_pemeriksaan)=?`, [b, t]
    );
    const [[{ total_imunisasi }]] = await pool.query(
      `SELECT COUNT(*) AS total_imunisasi FROM imunisasi
       WHERE status='selesai' AND MONTH(tanggal_jadwal)=? AND YEAR(tanggal_jadwal)=?`, [b, t]
    );

    await pool.query(
      `INSERT INTO laporan_posyandu (bulan_laporan, total_anak, total_stunting, total_imunisasi, dibuat_oleh)
       VALUES (?,?,?,?,?)`,
      [`${bulanNama[b]} ${t}`, total_anak, total_stunting, total_imunisasi, req.user.id]
    );

    return res.json({ success: true, message: 'Laporan berhasil disimpan.' });
  } catch (err) { return next(err); }
}

// GET /api/laporan/export-pdf
async function exportPDF(req, res, next) {
  try {
    const b = req.query.bulan || (new Date().getMonth() + 1);
    const t = req.query.tahun || new Date().getFullYear();
    const bulanNama = ['','Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const periode = `${bulanNama[b]} ${t}`;

    const [pemeriksaan] = await pool.query(
      `SELECT a.nama AS nama_anak, pi.nama AS nama_ibu,
              pm.tanggal_pemeriksaan, pm.berat_badan, pm.tinggi_badan, pm.status_gizi
       FROM pemeriksaan pm
       JOIN anak a ON a.id = pm.anak_id
       JOIN ibu i ON i.id = a.ibu_id
       JOIN pengguna pi ON pi.id = i.pengguna_id
       WHERE MONTH(pm.tanggal_pemeriksaan)=? AND YEAR(pm.tanggal_pemeriksaan)=?
       ORDER BY pm.tanggal_pemeriksaan DESC`, [b, t]
    );

    const status_gizi = { normal: 0, kurang: 0, buruk: 0 };
    pemeriksaan.forEach(p => { if (status_gizi[p.status_gizi] !== undefined) status_gizi[p.status_gizi]++; });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=laporan-posyandu-${t}-${b}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).font('Helvetica-Bold').text('LAPORAN POSYANDU', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text(`Periode: ${periode}`, { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    doc.fontSize(13).font('Helvetica-Bold').text('Ringkasan');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total Pemeriksaan : ${pemeriksaan.length}`);
    doc.text(`Gizi Normal        : ${status_gizi.normal}`);
    doc.text(`Gizi Kurang        : ${status_gizi.kurang}`);
    doc.text(`Gizi Buruk         : ${status_gizi.buruk}`);
    doc.moveDown();

    doc.fontSize(13).font('Helvetica-Bold').text('Detail Pemeriksaan');
    doc.moveDown(0.4);
    const cols = [50, 165, 280, 340, 400, 460];
    doc.fontSize(9).font('Helvetica-Bold');
    ['Nama Anak','Nama Ibu','Tgl Periksa','BB (kg)','TB (cm)','Gizi'].forEach((h, i) => doc.text(h, cols[i], doc.y, { width: 110 }));
    doc.moveDown(0.4);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

    doc.fontSize(9).font('Helvetica');
    pemeriksaan.forEach(p => {
      if (doc.y > 700) doc.addPage();
      doc.text(p.nama_anak || '-', cols[0], doc.y, { width: 110 });
      doc.text(p.nama_ibu || '-', cols[1], doc.y, { width: 110 });
      doc.text(p.tanggal_pemeriksaan || '-', cols[2], doc.y, { width: 60 });
      doc.text(String(p.berat_badan || '-'), cols[3], doc.y, { width: 55 });
      doc.text(String(p.tinggi_badan || '-'), cols[4], doc.y, { width: 55 });
      doc.text(p.status_gizi || '-', cols[5], doc.y, { width: 80 });
      doc.moveDown(0.4);
    });

    doc.moveDown();
    doc.fontSize(9).text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, { align: 'right' });
    doc.end();
  } catch (err) { return next(err); }
}

module.exports = { rekapBulanan, simpanLaporan, exportPDF };
