# 🏥 Web Telemedicine Posyandu

Aplikasi web admin untuk manajemen data posyandu, mencakup data ibu, anak, imunisasi, pemeriksaan gizi, dan rekam medis. Digunakan oleh bidan dan admin posyandu.

---

## 📁 Struktur Proyek

```
web_telemedicine/
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js         # Koneksi MySQL (Cloud SQL / IP)
│   │   │   └── seed.js       # Data awal database
│   │   ├── controllers/      # Logic tiap fitur
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT middleware & role guard
│   │   ├── routes/
│   │   │   └── index.js      # Definisi semua endpoint API
│   │   └── server.js         # Entry point Express
│   ├── uploads/              # File upload lokal (foto, dll)
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # Vanilla JS + Tailwind CSS
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js            # Inisialisasi & router SPA
│   │   ├── ui.js             # Komponen UI reusable
│   │   └── tailwind-config.js
│   ├── pages/                # Halaman-halaman aplikasi
│   │   ├── login.js
│   │   ├── dashboard.js
│   │   ├── data-anak.js
│   │   ├── data-ibu.js
│   │   ├── jadwal-imunisasi.js
│   │   ├── pemeriksaan-gizi.js
│   │   ├── growth-tracking.js
│   │   ├── rekam-medis.js
│   │   ├── laporan.js
│   │   └── settings.js
│   └── index.html
├── package.json
└── .gitignore
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js v18+
- MySQL 8+ (atau Google Cloud SQL)
- npm

### 1. Clone Repository
```bash
git clone https://github.com/xxsyahna/web_telemedicine.git
cd web_telemedicine
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/` 

Jalankan seed data awal (opsional):
```bash
npm run seed
```

Jalankan backend:
```bash
npm run dev      # development (auto-reload)
npm start        # production
```

Backend berjalan di `http://localhost:8080`

### 3. Setup Frontend
Frontend adalah static HTML/JS murni, cukup buka dengan live server atau serve statis:

```bash
# Menggunakan VS Code Live Server, atau:
cd frontend
npx serve .
```

Buka browser ke `http://localhost:3000` (atau port yang tersedia).

---

## 🔌 API Endpoints

Base URL: `http://localhost:8080/api`

Total: **29 endpoint**

### Auth
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| POST | `/auth/login` | Public | Login user |
| GET | `/auth/me` | Auth | Info user login |
| PUT | `/auth/profile` | Auth | Update profil |
| PUT | `/auth/change-password` | Auth | Ganti password |
| GET | `/auth/users` | Admin | Daftar semua user |
| POST | `/auth/users` | Admin | Buat user baru |
| PUT | `/auth/avatar` | Auth | Upload foto profil |
| DELETE | `/auth/avatar` | Auth | Hapus foto profil |

### Dashboard
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| GET | `/dashboard` | Bidan/Admin | Statistik ringkasan |

### Data Anak
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| GET | `/anak` | Bidan/Admin | Daftar anak |
| GET | `/anak/:id` | Bidan/Admin | Detail anak |
| POST | `/anak` | Bidan/Admin | Tambah anak |
| PUT | `/anak/:id` | Bidan/Admin | Update data anak |
| DELETE | `/anak/:id` | Bidan/Admin | Hapus anak |
| POST | `/anak/:id/pemeriksaan` | Bidan/Admin | Tambah pemeriksaan |
| GET | `/anak/:id/grafik` | Bidan/Admin | Grafik pertumbuhan |

### Pemeriksaan
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| PUT | `/pemeriksaan/:id` | Bidan/Admin | Edit pemeriksaan |
| DELETE | `/pemeriksaan/:id` | Bidan/Admin | Hapus pemeriksaan |

### Data Ibu
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| GET | `/ibu` | Bidan/Admin | Daftar ibu |
| GET | `/ibu/:id` | Bidan/Admin | Detail ibu |
| PUT | `/ibu/:id` | Bidan/Admin | Update data ibu |

### Imunisasi
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| GET | `/imunisasi` | Bidan/Admin | Daftar jadwal imunisasi |
| GET | `/imunisasi/:id` | Bidan/Admin | Detail imunisasi |
| POST | `/imunisasi` | Bidan/Admin | Tambah jadwal |
| PUT | `/imunisasi/:id` | Bidan/Admin | Update jadwal |
| PATCH | `/imunisasi/:id/status` | Bidan/Admin | Update status imunisasi |
| PUT | `/imunisasi/:id/selesai` | Bidan/Admin | Tandai imunisasi selesai |
| DELETE | `/imunisasi/:id` | Bidan/Admin | Hapus jadwal |

### Laporan
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| GET | `/laporan/rekap-bulanan` | Bidan/Admin | Rekap laporan bulanan |

---

## 🛡️ Autentikasi & Role

Aplikasi menggunakan **JWT (JSON Web Token)** dengan 2 role:

- **Admin** — akses penuh termasuk manajemen user
- **Bidan** — akses data posyandu (anak, ibu, imunisasi, laporan)

Token dikirim via header:
```
Authorization: Bearer <token>
```

---

## ☁️ Deploy (Google Cloud Run)

Backend sudah dilengkapi `Dockerfile` dan siap di-deploy ke Cloud Run:

```bash
cd backend
gcloud run deploy telemedicine-backend \
  --source . \
  --region asia-southeast2 \
  --set-env-vars DB_SOCKET_PATH=/cloudsql/...,JWT_SECRET=...,GCS_BUCKET_NAME=...
```

Frontend bisa di-deploy ke **Firebase Hosting**, **Netlify**, atau **Cloud Storage static website**.

---

## 🔒 Keamanan

- Password di-hash menggunakan **bcryptjs**
- HTTP headers diamankan dengan **helmet**
- CORS dibatasi via `FRONTEND_URL` environment variable
- Semua credentials disimpan di `.env` (tidak di-push ke Git)
- Upload file dibatasi ukuran (maks 2MB) dan tipe file (JPG/PNG/WebP)

---

## 📦 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MySQL 8 / Google Cloud SQL |
| Auth | JWT + bcryptjs |
| Storage | Google Cloud Storage |
| Frontend | Vanilla JS, Tailwind CSS |
| Deploy | Google Cloud Run, Docker |

---

## 📝 Lisensi

Proyek ini dibuat untuk keperluan akademik.
