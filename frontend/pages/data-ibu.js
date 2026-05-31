// ===================== DATA IBU =====================

let ibuPage = 1, ibuSearch = '';
let searchTimerIbu;

function getDataIbuHTML() {
    return `
    <div>
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-headline-lg font-bold">Data Ibu</h2>
                <p class="text-on-surface-variant">Data ibu terdaftar dari aplikasi mobile</p>
            </div>
        </div>
        <div class="bg-surface-container-lowest rounded-xl border overflow-hidden">
            <div class="p-4 border-b flex justify-between flex-wrap gap-3">
                <input type="text" id="ibuSearchInput" placeholder="Cari nama atau NIK..."
                    oninput="searchIbu(this.value)"
                    class="border rounded-lg px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-primary/20 text-sm">
            </div>
            <div id="ibuTableWrap">
                <div class="p-8 text-center text-on-surface-variant">Memuat data...</div>
            </div>
        </div>
    </div>`;
}

async function loadIbuTable() {
    const token = localStorage.getItem('pos_token');
    const wrap = document.getElementById('ibuTableWrap');
    if (!wrap) return;
    wrap.innerHTML = '<div class="p-8 text-center text-on-surface-variant">Memuat...</div>';

    const res = await fetch(`${BASE_URL}/ibu?page=${ibuPage}&limit=10&search=${encodeURIComponent(ibuSearch)}`, {
        headers: { Authorization: 'Bearer ' + token }
    }).then(r => r.json()).catch(() => null);

    if (!res) { wrap.innerHTML = '<div class="p-8 text-center text-error">Gagal memuat data.</div>'; return; }
    const list = res.data || [];
    const p = res.pagination || {};

    if (list.length === 0) {
        wrap.innerHTML = '<div class="p-8 text-center text-on-surface-variant">Belum ada data ibu terdaftar.</div>';
        return;
    }

    wrap.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead class="bg-surface-container-low">
                    <tr>
                        <th class="p-4 text-left text-sm">Nama</th>
                        <th class="p-4 text-left text-sm">NIK</th>
                        <th class="p-4 text-left text-sm">No. HP</th>
                        <th class="p-4 text-left text-sm">Alamat</th>
                        <th class="p-4 text-left text-sm">Jumlah Anak</th>
                    </tr>
                </thead>
                <tbody>
                    ${list.map(i => `
                    <tr class="border-b hover:bg-surface-container-low/50">
                        <td class="p-4 font-medium">${i.pengguna?.nama || '—'}
                            <div class="text-xs text-on-surface-variant">${i.pengguna?.email || ''}</div>
                        </td>
                        <td class="p-4 text-sm">${i.nik || '—'}</td>
                        <td class="p-4 text-sm">${i.pengguna?.no_hp || '—'}</td>
                        <td class="p-4 text-sm" style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i.alamat || '—'}</td>
                        <td class="p-4">
                            <span class="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold">${i.anak?.length || 0} anak</span>
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
        <div class="flex justify-between items-center p-4 border-t flex-wrap gap-2">
            <span class="text-sm text-on-surface-variant">Hal ${p.page} dari ${p.totalPages || 1} · ${p.total || 0} data</span>
            <div class="flex gap-2">
                <button onclick="ibuChangePage(${ibuPage - 1})" ${ibuPage <= 1 ? 'disabled' : ''}
                    class="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 hover:bg-surface-container-low">‹ Prev</button>
                <button onclick="ibuChangePage(${ibuPage + 1})" ${ibuPage >= (p.totalPages || 1) ? 'disabled' : ''}
                    class="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 hover:bg-surface-container-low">Next ›</button>
            </div>
        </div>`;
}

window.searchIbu = function (v) {
    ibuSearch = v; ibuPage = 1;
    clearTimeout(searchTimerIbu);
    searchTimerIbu = setTimeout(loadIbuTable, 400);
};
window.ibuChangePage = function (p) { ibuPage = p; loadIbuTable(); };
