// ===================== SETTINGS =====================

const settingsPageHTML = `
<div>
    <div class="flex flex-wrap justify-between items-center mb-5">
        <div>
            <h2 class="text-headline-lg font-bold">Pengaturan</h2>
            <p class="text-on-surface-variant">Kelola akun, notifikasi, keamanan, dan preferensi sistem</p>
        </div>
    </div>
    <div id="settingsToast" class="settings-toast">
        <span class="material-symbols-outlined text-[18px]" style="color:#166534">check_circle</span>
        Perubahan berhasil disimpan!
    </div>
    <div class="settings-tabs-mobile mb-4">
        <button class="settings-tab-btn active whitespace-nowrap" data-tab="profil" onclick="switchSettingsTab('profil',this)">
            <span class="material-symbols-outlined text-[16px]">person</span> Profil
        </button>
        <button class="settings-tab-btn whitespace-nowrap" data-tab="notifikasi" onclick="switchSettingsTab('notifikasi',this)">
            <span class="material-symbols-outlined text-[16px]">notifications</span> Notifikasi
        </button>
        <button class="settings-tab-btn whitespace-nowrap" data-tab="keamanan" onclick="switchSettingsTab('keamanan',this)">
            <span class="material-symbols-outlined text-[16px]">lock</span> Keamanan
        </button>
        <button class="settings-tab-btn whitespace-nowrap" data-tab="preferensi" onclick="switchSettingsTab('preferensi',this)">
            <span class="material-symbols-outlined text-[16px]">tune</span> Preferensi
        </button>
    </div>
    <div class="settings-layout">
        <nav class="settings-tabs-desktop">
            <button class="settings-tab-btn active" data-tab="profil" onclick="switchSettingsTab('profil',this)">
                <span class="material-symbols-outlined text-[18px]">person</span> Profil
            </button>
            <button class="settings-tab-btn" data-tab="notifikasi" onclick="switchSettingsTab('notifikasi',this)">
                <span class="material-symbols-outlined text-[18px]">notifications</span> Notifikasi
            </button>
            <button class="settings-tab-btn" data-tab="keamanan" onclick="switchSettingsTab('keamanan',this)">
                <span class="material-symbols-outlined text-[18px]">lock</span> Keamanan
            </button>
            <button class="settings-tab-btn" data-tab="preferensi" onclick="switchSettingsTab('preferensi',this)">
                <span class="material-symbols-outlined text-[18px]">tune</span> Preferensi
            </button>
        </nav>
        <div>
            <div id="settings-panel-profil" class="settings-panel active">
                <div class="settings-card">
                    <h3>Foto Profil</h3>
                    <div style="display:flex;align-items:center;gap:16px;margin-bottom:4px">
                        <div class="avatar-circle-settings" id="settingsAvatar">BA</div>
                        <div style="display:flex;flex-direction:column;gap:8px">
                            <button style="font-size:13px;color:#006e2f;border:1px solid #86efac;padding:7px 16px;border-radius:8px;background:transparent;cursor:pointer;font-family:inherit">
                                <span class="material-symbols-outlined text-[14px]">upload</span> Ganti Foto
                            </button>
                        </div>
                    </div>
                </div>
                <div class="settings-card">
                    <h3>Informasi Pribadi</h3>
                    <div class="settings-form-row">
                        <div class="settings-form-group">
                            <label>Nama Lengkap</label>
                            <input type="text" id="settingsNama">
                        </div>
                        <div class="settings-form-group">
                            <label>Role</label>
                            <input type="text" id="settingsRole" readonly style="background:#f9fafb">
                        </div>
                    </div>
                    <div class="settings-form-group">
                        <label>Alamat Email</label>
                        <input type="email" id="settingsEmail">
                    </div>
                    <div class="settings-form-group">
                        <label>No. Telepon</label>
                        <input type="text" id="settingsHp">
                    </div>
                    <div class="settings-save-row">
                        <button class="settings-btn-cancel">Batal</button>
                        <button class="settings-btn-save" onclick="showSettingsToast()">Simpan Perubahan</button>
                    </div>
                </div>
            </div>
            <div id="settings-panel-notifikasi" class="settings-panel">
                <div class="settings-card">
                    <h3>Notifikasi Aplikasi</h3>
                    <div class="toggle-row">
                        <div style="flex:1"><strong style="font-size:14px;font-weight:600;color:#111827;display:block">Jadwal Imunisasi</strong><span style="font-size:12px;color:#6b7280">Pengingat 1 hari sebelum jadwal</span></div>
                        <label class="settings-toggle"><input type="checkbox" checked><span class="settings-toggle-track"></span></label>
                    </div>
                    <div class="toggle-row">
                        <div style="flex:1"><strong style="font-size:14px;font-weight:600;color:#111827;display:block">Status Gizi Kritis</strong><span style="font-size:12px;color:#6b7280">Alert jika ada balita dengan gizi buruk</span></div>
                        <label class="settings-toggle"><input type="checkbox" checked><span class="settings-toggle-track"></span></label>
                    </div>
                    <div class="toggle-row">
                        <div style="flex:1"><strong style="font-size:14px;font-weight:600;color:#111827;display:block">Laporan Mingguan</strong><span style="font-size:12px;color:#6b7280">Ringkasan otomatis setiap Senin pagi</span></div>
                        <label class="settings-toggle"><input type="checkbox" checked><span class="settings-toggle-track"></span></label>
                    </div>
                </div>
                <div class="settings-save-row">
                    <button class="settings-btn-save" onclick="showSettingsToast()">Simpan Preferensi</button>
                </div>
            </div>
            <div id="settings-panel-keamanan" class="settings-panel">
                <div class="settings-card">
                    <h3>Ubah Kata Sandi</h3>
                    <div class="settings-form-group">
                        <label>Kata Sandi Saat Ini</label>
                        <input type="password" id="pwLama" placeholder="••••••••">
                    </div>
                    <div class="settings-form-row">
                        <div class="settings-form-group">
                            <label>Kata Sandi Baru</label>
                            <input type="password" id="pwBaru" placeholder="Min. 6 karakter">
                        </div>
                        <div class="settings-form-group">
                            <label>Konfirmasi</label>
                            <input type="password" id="pwKonfirm" placeholder="Ulangi kata sandi">
                        </div>
                    </div>
                    <div class="settings-save-row">
                        <button class="settings-btn-cancel">Batal</button>
                        <button class="settings-btn-save" onclick="doChangePassword()">Ubah Kata Sandi</button>
                    </div>
                </div>
                <div class="settings-card">
                    <h3>Keamanan Akun</h3>
                    <div class="security-action-row">
                        <div>
                            <div style="font-size:14px;font-weight:600;color:#111827;display:flex;align-items:center">
                                <span class="settings-status-dot"></span> Autentikasi Dua Faktor (2FA)
                            </div>
                            <div style="font-size:12px;color:#6b7280;margin-top:2px">Aktif — menggunakan aplikasi autentikator</div>
                        </div>
                        <button class="settings-btn-outline">Kelola</button>
                    </div>
                    <div class="security-action-row">
                        <div>
                            <div style="font-size:14px;font-weight:600;color:#dc2626">Logout Semua Perangkat</div>
                            <div style="font-size:12px;color:#6b7280;margin-top:2px">Keluar dari semua sesi aktif</div>
                        </div>
                        <button class="settings-btn-danger" onclick="doLogout()">Logout</button>
                    </div>
                </div>
            </div>
            <div id="settings-panel-preferensi" class="settings-panel">
                <div class="settings-card">
                    <h3>Tampilan & Bahasa</h3>
                    <div class="pref-row">
                        <div><strong style="font-size:14px;font-weight:600;color:#111827;display:block">Bahasa</strong><span style="font-size:12px;color:#6b7280">Bahasa antarmuka aplikasi</span></div>
                        <select><option selected>Bahasa Indonesia</option><option>English</option></select>
                    </div>
                    <div class="pref-row">
                        <div><strong style="font-size:14px;font-weight:600;color:#111827;display:block">Format Tanggal</strong><span style="font-size:12px;color:#6b7280">Cara penulisan tanggal</span></div>
                        <select><option selected>DD/MM/YYYY</option><option>YYYY-MM-DD</option></select>
                    </div>
                    <div class="pref-row">
                        <div><strong style="font-size:14px;font-weight:600;color:#111827;display:block">Zona Waktu</strong></div>
                        <select><option selected>WIB (UTC+7)</option><option>WITA (UTC+8)</option><option>WIT (UTC+9)</option></select>
                    </div>
                </div>
                <div class="settings-card">
                    <h3>Sistem & Data</h3>
                    <div class="pref-row">
                        <div><strong style="font-size:14px;font-weight:600;color:#111827;display:block">Standar Grafik Tumbuh Kembang</strong><span style="font-size:12px;color:#6b7280">Referensi kurva pertumbuhan anak</span></div>
                        <select><option selected>WHO (2006)</option><option>CDC (2000)</option><option>Kemenkes RI</option></select>
                    </div>
                    <div class="pref-row">
                        <div><strong style="font-size:14px;font-weight:600;color:#111827;display:block">Auto-simpan Form</strong></div>
                        <label class="settings-toggle"><input type="checkbox" checked><span class="settings-toggle-track"></span></label>
                    </div>
                </div>
                <div class="settings-save-row">
                    <button class="settings-btn-cancel">Reset ke Default</button>
                    <button class="settings-btn-save" onclick="showSettingsToast()">Simpan Preferensi</button>
                </div>
            </div>
        </div>
    </div>
</div>`;

window.switchSettingsTab = function (tabId, btn) {
    document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('settings-panel-' + tabId)?.classList.add('active');
    document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(b => b.classList.add('active'));
};

window.showSettingsToast = function () {
    const t = document.getElementById('settingsToast');
    if (!t) return;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
};

window.doChangePassword = async function () {
    const token = localStorage.getItem('pos_token');
    const pwLama = document.getElementById('pwLama')?.value;
    const pwBaru = document.getElementById('pwBaru')?.value;
    const pwKonfirm = document.getElementById('pwKonfirm')?.value;
    if (!pwLama || !pwBaru) { showGlobalToast('Isi semua field password!', true); return; }
    if (pwBaru !== pwKonfirm) { showGlobalToast('Konfirmasi password tidak cocok!', true); return; }
    const res = await fetch(BASE_URL + '/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ password_lama: pwLama, password_baru: pwBaru })
    }).then(r => r.json()).catch(() => null);
    if (res?.success) showGlobalToast('Password berhasil diubah!');
    else showGlobalToast(res?.message || 'Gagal mengubah password', true);
};

function fillSettingsProfile() {
    const user = JSON.parse(localStorage.getItem('pos_user') || '{}');
    const n = document.getElementById('settingsNama');
    const r = document.getElementById('settingsRole');
    const e = document.getElementById('settingsEmail');
    const h = document.getElementById('settingsHp');
    const av = document.getElementById('settingsAvatar');
    if (n) n.value = user.nama || '';
    if (r) r.value = user.role === 'admin' ? 'Administrator' : 'Bidan';
    if (e) e.value = user.email || '';
    if (h) h.value = user.no_hp || '';
    if (av) av.textContent = (user.nama || 'BA').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}
