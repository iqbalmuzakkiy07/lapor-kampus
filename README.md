# LaporKampus — Aplikasi Layanan Pengaduan & Aspirasi Kampus

**LaporKampus** adalah platform pengaduan dan aspirasi kampus modern yang responsif (desktop, tablet, dan smartphone) dengan arsitektur modular yang siap mendukung pengembangan aplikasi mobile terpisah.

Aplikasi dibangun berdasarkan panduan fungsional [`PRD.md`](./PRD.md) dan panduan visual [`design.md`](./design.md) dengan mengusung tema **Modern Forest Green** (`#051F20`, `#0B2B26`, `#163832`, `#235347`, `#8EB69B`, `#DAF1DE`).

---

## 🌟 Fitur Utama

### 1. Portal Mahasiswa
- **Beranda Interaktif:** Sapaan nama, metrik status pengaduan, panduan alur laporan, dan pengaduan terbaru.
- **Formulir Pengaduan 5 Langkah:**
  1. Pemilihan Kategori (dengan proteksi penanganan khusus untuk kategori sensitif).
  2. Judul dan Deskripsi permasalahan secara detail.
  3. Lokasi spesifik dan waktu kejadian.
  4. Unggah foto bukti (preview, batas ukuran 5MB, format gambar) & opsi laporan anonim.
  5. Tinjau ringkasan sebelum pengiriman.
- **Konfirmasi Tiket Unik:** Pembuatan nomor tiket otomatis berformat `LPK-YYYYMMDD-XXXX`.
- **Pengaduan Saya:** Pencarian tiket/judul, filter status komprehensif, dan filter kategori.
- **Detail Pengaduan & Timeline:** Kronologi perubahan status dengan catatan resmi dari petugas.
- **Form Tanggapan Pelapor:** Kemudahan melengkapi keterangan saat status meminta informasi tambahan.
- **Penilaian (Rating 1-5 Bintang):** Formulir feedback aktif otomatis saat laporan berstatus **Selesai**.
- **Notifikasi In-App:** Indikator belum dibaca, tombol tandai telah dibaca, dan klik langsung ke detail laporan.
- **Profil & FAQ:** Panduan tanya jawab seputar layanan pengaduan dan kebijakan privasi kampus.

### 2. Konsol Admin & Petugas (Admin Console)
- **Dashboard Statistik Riil:** Metrik agregasi dinamis (Total Laporan, Menunggu Verifikasi, Sedang Diproses, Selesai, Ditolak).
- **Verifikasi Laporan:**
  - Penerimaan dan penerusan laporan ke unit kerja/petugas terkait (Sarpras, IT, dll).
  - Penetapan prioritas penanganan (Rendah, Sedang, Tinggi, Darurat).
  - Permintaan informasi tambahan kepada pelapor.
  - Penolakan laporan dengan **kewajiban mencantumkan alasan penolakan**.
- **Fitur Khusus Petugas ("Tugas Saya"):**
  - Melihat laporan yang secara khusus ditugaskan kepada petugas bersangkutan.
  - Pemisahan tegas antara **Catatan Internal** (hanya dibaca admin/petugas) dan **Tanggapan Publik** (dibaca mahasiswa).
  - Penutupan laporan dengan **kewajiban mengisi ringkasan tindakan penanganan**.
- **Manajemen Kategori:** Konfigurasi kategori pengaduan, penandaan kategori sensitif, dan pengaktifan/penonaktifan.
- **Statistik & Evaluasi:** Visualisasi persentase penyelesaian, rating kepuasan pelapor, dan sebaran per kategori.

---

## 🛠️ Stack Teknologi

- **Frontend Framework:** Next.js 14 (App Router)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables Design Tokens
- **Ikonografi:** `lucide-react`
- **Database & Storage:** PostgreSQL / Supabase (9 Tabel Relasional Lengkap + RLS)
- **Adapter Resilien:** Dual-mode adapter (berjalan otomatis dengan Live Supabase jika kredensial diisi, atau Interactive Persistent Mock Engine yang langsung berfungsi tanpa konfigurasi rumit).

---

## 👥 Akun Simulasi & Akses Role (Demo Switcher)

Aplikasi dilengkapi dengan bilah **Role Switcher** di bagian paling atas untuk pengujian cepat tanpa repot mengetik ulang kata sandi:

| Peran | Nama | Email | NIM / NIP | Deskripsi Akses |
|---|---|---|---|---|
| **Mahasiswa** | Ahmad Fauzi | `mahasiswa@kampus.ac.id` | `2201010045` | Akses portal mahasiswa, kirim laporan, rating, riwayat sendiri |
| **Mahasiswa** | Siti Nurhaliza | `siti.nurhaliza@kampus.ac.id` | `2201010088` | Akun mahasiswa kedua (pengujian isolasi data antar pengguna) |
| **Admin** | Budi Santoso, M.Kom | `admin@kampus.ac.id` | `198501152010121001` | Akses penuh dashboard admin, verifikasi, penugasan, kategori |
| **Petugas** | Agus Prasetyo | `petugas.sarpras@kampus.ac.id` | `199003202015041002` | Unit Sarpras: menu Tugas Saya, tanggapan teknisi, penyelesaian |
| **Petugas** | Rian Hidayat | `petugas.it@kampus.ac.id` | `199207102018011003` | Unit IT & Jaringan: penanganan kendala WiFi & portal akademik |

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
Pastikan komputer memiliki **Node.js** (versi 18.x atau 20.x) dan **npm**.

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (Opsional)
Salin berkas contoh lingkungan:
```bash
cp .env.example .env.local
```
> **Catatan:** Jika variabel Supabase di `.env.local` dikosongkan, LaporKampus akan secara cerdas menjalankan mode **Interactive Engine** yang menyimpan perubahan ke penyimpanan lokal browser secara penuh.

### 4. Menjalankan Mode Pengembangan
```bash
npm run dev
```
Buka browser dan akses: `http://localhost:3000`

### 5. Membangun untuk Produksi
```bash
npm run build
npm start
```

### 6. Menjalankan Suite Pengujian Otomatis
```bash
npm test
```
Suite pengujian menguji secara otomatis:
- Format nomor tiket unik (`LPK-YYYYMMDD-XXXX`).
- Isolasi data mahasiswa (mahasiswa dilarang membuka pengaduan mahasiswa lain).
- Kerahasiaan catatan internal petugas (catatan internal tidak pernah dikirim ke mahasiswa).
- Pencegahan tindakan administratif oleh mahasiswa.
- Aturan transisi status (penolakan wajib alasan, penyelesaian wajib ringkasan).
- Batasan penilaian hanya untuk laporan selesai dan hanya oleh pemilik.
- Pencegahan eskalasi hak akses saat pendaftaran mandiri mahasiswa.

---

## 🗄️ Struktur Database (PostgreSQL / Supabase)

Skema database lengkap tersedia pada berkas:
- Skema & RLS: [`supabase/migrations/0001_initial_schema.sql`](./supabase/migrations/0001_initial_schema.sql)
- Data Awal (Seed): [`supabase/seed.sql`](./supabase/seed.sql)

Terdiri dari 9 tabel:
1. `users`: Data pengguna, peran (`mahasiswa`, `admin`, `petugas`), identitas NIM/NIP.
2. `categories`: Klasifikasi pengaduan, status aktif, penandaan kategori sensitif.
3. `complaints`: Data induk pengaduan, nomor tiket unik `LPK-YYYYMMDD-XXXX`, status, prioritas, privasi identitas.
4. `complaint_attachments`: Lampiran berkas dan foto bukti.
5. `complaint_status_history`: Audit trail perubahan status, pelaku, waktu, dan catatan resmi.
6. `complaint_responses`: Tanggapan penanganan dan pemisahan catatan internal petugas (`is_internal = true`).
7. `complaint_assignments`: Penugasan laporan ke petugas/unit kerja terkait.
8. `notifications`: Pemberitahuan in-app terkait perubahan status laporan.
9. `complaint_ratings`: Penilaian bintang 1-5 dan ulasan kepuasan pelapor.

---

## 📱 Responsivitas Mobile & Aksesibilitas

- **Desktop (≥ 1024px):** Top navigation untuk mahasiswa, full sidebar untuk admin, tampilan tabel data dengan filter.
- **Mobile (≤ 768px):** Bottom navigation bar untuk mahasiswa dengan tombol *floating* "Lapor", drawer sidebar untuk admin, daftar pengaduan berbentuk kartu ringkas satu kolom.
- **Target Sentuh:** Seluruh tombol dan kontrol form memiliki tinggi minimal **44px**.
- **WCAG AA:** Penandaan status selalu menyertakan label teks baku di samping warna fungsional.

