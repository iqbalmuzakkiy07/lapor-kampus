# PRD — LaporKampus
**Versi:** 1.0  
**Tanggal:** 27 Oktober 2026  
**Platform:** Web responsif dan Mobile  
**Status:** Draft untuk pengembangan proyek kelompok

## 1. Ringkasan Produk

LaporKampus adalah aplikasi layanan pengaduan dan aspirasi kampus yang memungkinkan mahasiswa melaporkan masalah, melampirkan bukti, menentukan lokasi kejadian, serta memantau tindak lanjut secara digital. Admin kampus dapat memverifikasi, mengklasifikasikan, meneruskan, dan memantau laporan. Petugas/unit terkait dapat memperbarui perkembangan penanganan.

Produk dirancang untuk berjalan pada:
- **Web desktop/laptop:** dashboard admin/petugas dan portal mahasiswa.
- **Web mobile:** tampilan responsif melalui browser ponsel.
- **Mobile app:** antarmuka yang dioptimalkan untuk layar ponsel. Implementasi dapat memakai satu backend/API yang sama dengan web.

> Keputusan implementasi mobile native atau cross-platform belum ditetapkan. Untuk MVP, web responsif dapat dikembangkan terlebih dahulu; aplikasi mobile dapat memakai backend yang sama.

## 2. Latar Belakang dan Masalah

Pengaduan kampus dapat tersebar melalui percakapan langsung, grup pesan, atau kanal yang berbeda. Akibatnya, pelapor mungkin kesulitan mengetahui kanal yang tepat, status laporan, dan tindak lanjutnya. Petugas juga membutuhkan cara terpusat untuk mengelola laporan dan membuat rekap.

LaporKampus menyediakan alur terstruktur dari pengiriman sampai penyelesaian laporan.

## 3. Tujuan Produk

1. Memudahkan mahasiswa membuat pengaduan atau mengirim aspirasi.
2. Menyediakan nomor laporan dan pelacakan status.
3. Memusatkan pengelolaan laporan bagi admin dan petugas.
4. Memperjelas penanggung jawab dan riwayat penanganan.
5. Menyediakan statistik dasar untuk evaluasi layanan.

## 4. Sasaran Pengguna dan Peran

### 4.1 Mahasiswa
- Membuat, mengirim, dan melihat pengaduan miliknya.
- Melihat status, timeline, dan tanggapan.
- Menambahkan informasi jika diminta.
- Memberi penilaian setelah laporan selesai.

### 4.2 Admin
- Melihat laporan masuk.
- Memverifikasi kelengkapan dan kelayakan laporan.
- Mengatur kategori, prioritas, serta penugasan.
- Memperbarui status atau memantau tindak lanjut.
- Mengelola kategori dan akun sesuai hak akses.
- Melihat statistik dan riwayat aktivitas.

### 4.3 Petugas/Unit Terkait
- Melihat laporan yang ditugaskan kepadanya.
- Menambahkan catatan tindak lanjut.
- Meminta informasi tambahan melalui alur yang disediakan.
- Memperbarui progres dan menandai penanganan selesai.

Untuk MVP, peran admin dan petugas boleh digabung agar lingkup pengerjaan lebih sederhana. Jika digabung, hak akses tetap perlu dirancang agar tindakan penting tercatat.

## 5. Ruang Lingkup

### 5.1 Dalam MVP
- Login dan logout.
- Hak akses berdasarkan peran.
- Beranda mahasiswa.
- Pembuatan pengaduan dan aspirasi.
- Kategori, judul, deskripsi, lokasi kejadian, waktu kejadian opsional, dan lampiran foto.
- Pilihan privasi identitas sesuai kebijakan kampus.
- Nomor laporan unik.
- Riwayat dan detail pengaduan.
- Status serta timeline perubahan status.
- Verifikasi oleh admin.
- Penugasan ke petugas/unit (dapat disederhanakan pada MVP).
- Tanggapan/catatan tindak lanjut.
- Notifikasi dalam aplikasi.
- Dashboard admin dan filter daftar laporan.
- Penilaian setelah laporan selesai (disarankan jika waktu cukup).

### 5.2 Di Luar MVP / Tahap Berikutnya
- Integrasi Single Sign-On (SSO) kampus.
- Push notification native.
- Peta interaktif dan geolokasi otomatis.
- Integrasi WhatsApp/email/SMS.
- Analitik lanjutan dan ekspor PDF/Excel.
- SLA otomatis dan eskalasi.
- Multi-kampus.
- Chat real-time.
- AI untuk klasifikasi atau peringkasan laporan.

## 6. Kategori Pengaduan

Kategori awal yang dapat dikonfigurasi admin:
1. Fasilitas kampus.
2. Jaringan dan teknologi.
3. Kebersihan dan lingkungan.
4. Pelayanan administrasi.
5. Akademik.
6. Keamanan dan ketertiban.
7. Perundungan/pelecehan atau laporan sensitif.
8. Saran dan aspirasi.
9. Lainnya.

Kategori sensitif wajib memiliki akses terbatas dan prosedur penanganan khusus. Jangan menampilkan laporan sensitif di halaman publik atau statistik yang dapat mengidentifikasi pelapor.

## 7. Alur Status Pengaduan

Status utama:
1. **Dikirim** — laporan berhasil dibuat.
2. **Menunggu Verifikasi** — admin memeriksa laporan.
3. **Menunggu Informasi Pelapor** — informasi tambahan diperlukan.
4. **Diteruskan** — laporan ditugaskan ke unit/petugas.
5. **Sedang Diproses** — penanganan sedang berlangsung.
6. **Selesai** — tindakan penanganan telah dicatat dan hasil diinformasikan.
7. **Ditolak** — laporan tidak dapat diproses dan alasan disampaikan.

Perubahan status harus menyimpan aktor, waktu, status sebelumnya, status baru, dan catatan yang sesuai. Pelapor hanya dapat melihat informasi yang diizinkan oleh kebijakan privasi.

## 8. User Stories dan Kriteria Penerimaan

### US-01 — Mengirim pengaduan
**Sebagai mahasiswa,** saya ingin mengirim pengaduan berisi informasi masalah agar kampus dapat menindaklanjutinya.

Kriteria penerimaan:
- Formulir menandai kolom wajib dengan jelas.
- Sistem memvalidasi input dan tipe/ukuran file.
- Laporan yang berhasil disimpan mendapat nomor unik.
- Pengguna mendapat konfirmasi dan dapat membuka detail laporan.
- Jika pengiriman gagal, input tidak hilang tanpa peringatan.

### US-02 — Melacak laporan
**Sebagai mahasiswa,** saya ingin melihat status dan timeline agar mengetahui perkembangan laporan.

Kriteria penerimaan:
- Daftar laporan menampilkan nomor, judul, tanggal, dan status.
- Detail menampilkan timeline secara kronologis.
- Pengguna tidak dapat membuka laporan milik pengguna lain, kecuali ada hak akses resmi.

### US-03 — Memverifikasi laporan
**Sebagai admin,** saya ingin memeriksa laporan agar laporan dapat diarahkan dengan benar.

Kriteria penerimaan:
- Admin dapat menerima/meneruskan, meminta informasi tambahan, atau menolak dengan alasan.
- Setiap tindakan tercatat di riwayat.
- Pelapor menerima notifikasi dalam aplikasi ketika ada pembaruan.

### US-04 — Menangani laporan
**Sebagai petugas,** saya ingin melihat tugas dan memperbarui progres agar pelapor memperoleh informasi yang jelas.

Kriteria penerimaan:
- Petugas hanya melihat laporan yang sesuai dengan hak aksesnya.
- Petugas dapat menambahkan catatan dan mengubah status yang diizinkan.
- Status selesai harus disertai ringkasan tindakan/hasil.

### US-05 — Memberi penilaian
**Sebagai mahasiswa,** saya ingin menilai penanganan setelah laporan selesai.

Kriteria penerimaan:
- Penilaian hanya tersedia untuk laporan berstatus Selesai.
- Satu laporan hanya dapat memiliki satu penilaian aktif dari pelapor.
- Penilaian tidak membuka identitas atau detail sensitif kepada pengguna lain.

## 9. App Flow

### 9.1 Mahasiswa
1. Buka aplikasi.
2. Login/registrasi sesuai kebijakan kampus.
3. Masuk ke Beranda.
4. Pilih **Buat Pengaduan**.
5. Pilih kategori.
6. Isi judul, deskripsi, lokasi, dan waktu kejadian opsional.
7. Tambahkan foto jika tersedia.
8. Atur privasi identitas jika opsi tersebut diaktifkan.
9. Tinjau ringkasan.
10. Kirim laporan.
11. Terima nomor laporan dan buka detail.
12. Pantau status/timeline dari menu Pengaduan Saya.
13. Tanggapi permintaan informasi jika ada.
14. Setelah selesai, beri penilaian (opsional).

Alternatif dari Beranda:
- **Pengaduan Saya** → daftar → detail → timeline/tanggapan.
- **Notifikasi** → pilih pembaruan → buka detail terkait.
- **Profil** → informasi akun, pengaturan, keluar.

### 9.2 Admin
1. Login admin.
2. Buka Dashboard.
3. Buka daftar laporan baru.
4. Pilih laporan dan periksa detail/bukti.
5. Verifikasi kelengkapan.
6. Jika kurang lengkap, minta informasi tambahan.
7. Jika tidak dapat diproses, tolak dengan alasan.
8. Jika layak, tetapkan kategori/prioritas dan unit tujuan.
9. Teruskan laporan dan catat tindakan.
10. Pantau progres hingga selesai.
11. Lihat statistik/riwayat.

### 9.3 Petugas
1. Login.
2. Buka daftar tugas.
3. Pilih laporan yang ditugaskan.
4. Periksa detail.
5. Lakukan tindak lanjut di lapangan/sistem.
6. Tambahkan catatan tindakan.
7. Perbarui status.
8. Saat selesai, isi ringkasan hasil dan tandai Selesai.

## 10. Struktur Halaman

### Mahasiswa
- Splash/landing (jika diperlukan).
- Login.
- Registrasi (jika tidak menggunakan SSO).
- Beranda.
- Pilih kategori.
- Formulir pengaduan.
- Tinjau pengaduan.
- Konfirmasi berhasil.
- Pengaduan Saya.
- Detail pengaduan dan timeline.
- Notifikasi.
- Penilaian.
- Profil/pengaturan.
- Pusat bantuan/FAQ.

### Admin/Petugas
- Login.
- Dashboard.
- Daftar pengaduan.
- Detail/verifikasi pengaduan.
- Penugasan.
- Pembaruan status dan catatan.
- Pengelolaan kategori.
- Pengelolaan pengguna/role.
- Statistik.
- Riwayat aktivitas.

## 11. Persyaratan Nonfungsional

### Responsif dan lintas platform
- Antarmuka web mendukung layar ponsel, tablet, laptop, dan desktop.
- Layout tidak mengharuskan scroll horizontal pada lebar layar umum.
- Target awal: viewport 360 px ke atas untuk mobile dan 1024 px ke atas untuk dashboard desktop; tablet harus tetap dapat digunakan.
- Jika aplikasi mobile native/cross-platform dibuat, gunakan backend/API yang sama dan samakan perilaku serta istilah status dengan web.

### Aksesibilitas dan kegunaan
- Kontras teks dan latar harus memadai.
- Status tidak boleh dibedakan hanya dengan warna; gunakan label teks/ikon.
- Input memiliki label, pesan error yang jelas, dan fokus keyboard yang terlihat.
- Area sentuh mobile nyaman digunakan (target sekitar 44 × 44 px).
- Formulir memberi indikator wajib/opsional dan mempertahankan input saat validasi gagal.

### Keamanan dan privasi
- Autentikasi aman dan otorisasi diperiksa di server.
- Pengguna hanya dapat melihat data sesuai perannya.
- Validasi file, batas ukuran, dan pemeriksaan tipe file diterapkan.
- Lampiran tidak boleh terbuka publik secara default.
- Kata sandi disimpan dengan hashing yang sesuai jika autentikasi lokal digunakan.
- Perubahan status dan akses terhadap laporan sensitif dicatat.
- Sediakan mekanisme untuk pelaporan sensitif dengan akses terbatas, pemberitahuan privasi, dan jalur penanganan yang sesuai.
- Jangan menjanjikan anonimitas mutlak jika sistem tetap menyimpan identitas untuk kebutuhan operasional; jelaskan siapa yang dapat melihatnya.

### Kinerja dan keandalan
- Halaman utama dan daftar menampilkan status loading, empty state, error, dan retry.
- Operasi pengiriman memiliki umpan balik yang jelas.
- Sistem mencegah pengiriman ganda akibat klik berulang sejauh memungkinkan.
- Data laporan dan histori harus konsisten.

## 12. Model Data Awal

Tabel yang disarankan:
1. `users` — akun, peran, dan status akun.
2. `categories` — kategori dan konfigurasi.
3. `complaints` — pelapor, kategori, judul, deskripsi, lokasi, status, prioritas, privasi, waktu.
4. `complaint_attachments` — metadata dan lokasi penyimpanan lampiran.
5. `complaint_status_history` — status lama/baru, aktor, waktu, catatan.
6. `complaint_responses` — tanggapan, penulis, waktu, visibilitas.
7. `complaint_assignments` — unit/petugas yang ditugaskan dan waktu penugasan.
8. `notifications` — penerima, isi, status baca, tautan ke laporan.
9. `complaint_ratings` — rating, komentar, dan waktu.

Relasi dasar:
- Satu user dapat membuat banyak complaint.
- Satu category dapat digunakan oleh banyak complaint.
- Satu complaint dapat memiliki banyak attachment, history, response, dan assignment.
- Satu complaint dapat memiliki nol atau satu rating.
- Satu user dapat menerima banyak notification.

## 13. Metrik Keberhasilan

Metrik awal yang dapat dievaluasi:
- Persentase pengaduan yang berhasil dikirim tanpa bantuan.
- Waktu rata-rata dari laporan dikirim hingga diverifikasi.
- Persentase laporan yang memiliki pembaruan status.
- Persentase laporan selesai.
- Waktu rata-rata penyelesaian per kategori.
- Kepuasan pelapor setelah laporan selesai.
- Jumlah laporan duplikat/tidak lengkap.

Target angka ditetapkan setelah uji coba atau berdasarkan kesepakatan tim/kampus, bukan diasumsikan sejak awal.

## 14. Asumsi dan Hal yang Perlu Diputuskan

- Nama **LaporKampus** bersifat sementara.
- Identitas pengguna dan integrasi SSO bergantung pada kebijakan kampus.
- Struktur unit penanganan belum ditentukan.
- Kebijakan anonimitas dan laporan sensitif harus dikonfirmasi dengan pihak kampus.
- Notifikasi MVP berupa notifikasi di dalam aplikasi.
- Implementasi mobile native atau cross-platform diputuskan berdasarkan kemampuan tim.
- Kebijakan retensi dan penghapusan data perlu ditentukan sebelum penggunaan nyata.

## 15. Definisi Selesai MVP

MVP dapat dianggap selesai jika:
- Mahasiswa dapat login dan mengirim laporan valid.
- Sistem menghasilkan nomor laporan.
- Mahasiswa dapat melihat laporan miliknya dan timeline status.
- Admin dapat memverifikasi, meminta informasi, meneruskan, atau menolak laporan.
- Petugas/admin dapat memperbarui progres dan menyelesaikan laporan.
- Notifikasi dalam aplikasi muncul untuk perubahan penting.
- Hak akses mencegah akses tidak sah ke laporan dan lampiran.
- Alur utama telah diuji pada web desktop dan browser mobile.
- Tampilan memiliki state loading, kosong, sukses, dan error.
