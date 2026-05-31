// ===================== PEMERIKSAAN GIZI =====================

function getPemeriksaanHTML() {
    return `
    <div>
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-headline-lg font-bold">Pemeriksaan Gizi</h2>
                <p class="text-on-surface-variant">Riwayat dan input pemeriksaan seluruh anak</p>
            </div>
            <button onclick="openNewCheckupModal()" class="bg-primary text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-green-800 cursor-pointer">
                <span class="material-symbols-outlined">add</span> Input Pemeriksaan
            </button>
        </div>
        <div class="bg-surface-container-lowest rounded-xl border overflow-hidden">
            <div id="perikWrap">
                <div class="p-8 text-center text-on-surface-variant">Memuat...</div>
            </div>
        </div>
    </div>`;
}

function badgeGizi(s) {
    if (!s) return '<span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">—</span>';
    const m = { normal: 'bg-primary/20 text-primary', kurang: 'bg-yellow-100 text-yellow-800', buruk: 'bg-error-container text-error', lebih: 'bg-blue-100 text-blue-800' };
    return `<span class="${m[s] || 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded-full text-xs font-semibold">${s.charAt(0).toUpperCase() + s.slice(1)}</span>`;
}

async function loadPemeriksaan() {
    const token = localStorage.getItem('pos_token');
    const wrap = document.getElementById('perikWrap');
    if (!wrap) return;

    const anakRes = await fetch(BASE_URL + '/anak?limit=100', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()).catch(() => null);
    const anakList = anakRes?.data || [];

    const rows = [];
    for (const a of anakList.slice(0, 20)) {
        const det = await fetch(BASE_URL + '/anak/' + a.id, { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()).catch(() => null);
        (det?.data?.pemeriksaan || []).forEach(p => rows.push({ anak: a.nama, ...p }));
    }
    rows.sort((a, b) => new Date(b.tanggal_pemeriksaan) - new Date(a.tanggal_pemeriksaan));

    if (rows.length === 0) {
        wrap.innerHTML = '<div class="p-8 text-center text-on-surface-variant">Belum ada data pemeriksaan.</div>';
        return;
    }

    wrap.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead class="bg-surface-container-low">
                    <tr>
                        <th class="p-4 text-left text-sm">Nama Anak</th>
                        <th class="p-4 text-left text-sm">Tgl Periksa</th>
                        <th class="p-4 text-left text-sm">BB (kg)</th>
                        <th class="p-4 text-left text-sm">TB (cm)</th>
                        <th class="p-4 text-left text-sm">Lingkar Kepala</th>
                        <th class="p-4 text-left text-sm">Status Gizi</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(r => `
                    <tr class="border-b hover:bg-surface-container-low/50">
                        <td class="p-4 font-medium">${r.anak}</td>
                        <td class="p-4 text-sm">${formatDate(r.tanggal_pemeriksaan)}</td>
                        <td class="p-4 text-sm">${r.berat_badan || '—'}</td>
                        <td class="p-4 text-sm">${r.tinggi_badan || '—'}</td>
                        <td class="p-4 text-sm">${r.lingkar_kepala || '—'}</td>
                        <td class="p-4">${badgeGizi(r.status_gizi)}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
}
