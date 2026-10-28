# Design System & UI/UX — LaporKampus
**Versi:** 1.0  
**Tanggal:** 27 Oktober 2026  
**Platform:** Web responsif dan Mobile

## 1. Arah Desain

**Konsep:** Modern Forest Green — Clean, Calm, Professional.

LaporKampus harus terasa tepercaya, tenang, jelas, dan mudah digunakan. Visualnya memakai palet hijau hutan dan mint yang diberikan sebagai identitas utama. Hindari tampilan terlalu ramai, dekorasi berlebihan, atau penggunaan warna gelap pada semua area konten.

Prinsip desain:
1. **Jelas:** status, langkah berikutnya, dan informasi laporan mudah ditemukan.
2. **Ringkas:** formulir dibagi menjadi bagian yang mudah dipahami.
3. **Konsisten:** komponen, istilah, warna, dan status seragam pada web dan mobile.
4. **Responsif:** layout menyesuaikan lebar layar dan cara interaksi.
5. **Aman:** privasi dan akses ke laporan dijelaskan secara jelas.
6. **Aksesibel:** teks terbaca, fokus keyboard terlihat, dan warna bukan satu-satunya penanda.

## 2. Palet Warna

| Token | HEX | Peran |
|---|---|---|
| `color-darkest` | `#051F20` | Identitas gelap, teks utama pada permukaan terang, sidebar gelap. |
| `color-deep` | `#0B2B26` | Header/nav gelap, area navigasi sekunder. |
| `color-forest` | `#163832` | Tombol utama, link/ikon aktif pada konteks yang sesuai. |
| `color-teal` | `#235347` | Hover, aksen, elemen terpilih. |
| `color-sage` | `#8EB69B` | Border lembut, ikon pendukung, dekorasi. |
| `color-mint` | `#DAF1DE` | Latar halaman/section lembut dan highlight. |
| `color-surface` | `#FFFFFF` | Kartu, formulir, modal. |
| `color-text-muted` | `#526B61` | Teks sekunder pada latar terang. |

### Warna status fungsional

Warna ini merupakan tambahan untuk memperjelas arti status, bukan bagian dari identitas inti:
- **Selesai:** `#235347`, dengan label “Selesai”.
- **Menunggu:** `#8A6418`, dengan label “Menunggu Verifikasi”.
- **Ditolak/galat:** `#B42318`, dengan label “Ditolak” atau pesan error.
- **Informasi:** `#235347`, dengan label yang sesuai.

Pastikan kontras teks pada badge diuji. Jika latar badge gelap, gunakan teks putih; jika latar muda, gunakan teks gelap. Jangan memakai warna saja untuk menyampaikan status.

### Panduan proporsi warna
Sebagai titik awal:
- 55% putih dan mint untuk latar/kartu.
- 25% hijau gelap untuk navigasi dan identitas.
- 15% forest/teal untuk tombol dan elemen interaktif.
- 5% sage untuk aksen.

Proporsi dapat berubah sesuai halaman. Area formulir sebaiknya dominan putih agar mudah dibaca.

## 3. Tipografi

Gunakan font sans-serif yang mudah dibaca, misalnya **Inter** atau system font.

Skala desktop:
- H1: 32 px / 40 px, weight 700.
- H2: 24 px / 32 px, weight 650–700.
- H3: 20 px / 28 px, weight 600.
- Body: 16 px / 24 px, weight 400.
- Small: 14 px / 20 px.
- Caption: 12 px / 16 px, hanya untuk informasi tambahan.

Skala mobile:
- H1: 26–28 px.
- H2: 22 px.
- H3: 18 px.
- Body: 16 px.
- Label/input: minimal 14–16 px.

Hindari teks panjang dengan warna hijau pucat di atas latar putih. Warna `#8EB69B` lebih cocok untuk aksen/border daripada teks isi kecil.

## 4. Layout dan Grid

### Web desktop
- Konten mahasiswa: lebar maksimum sekitar 1200 px.
- Dashboard admin: sidebar tetap dan area konten fleksibel.
- Gunakan grid 12 kolom bila dibutuhkan untuk halaman kompleks.
- Jarak antarbagian konsisten, umumnya 24–32 px.
- Formulir panjang tidak perlu memenuhi lebar layar; batasi lebar baca sekitar 720–800 px.

### Tablet
- Sidebar admin dapat diperkecil atau menjadi drawer.
- Kartu statistik memakai 2 kolom jika ruang cukup.
- Tabel dapat berubah menjadi daftar kartu jika tidak nyaman dibaca.

### Mobile
- Target dukungan mulai dari lebar 360 px.
- Gunakan satu kolom untuk formulir.
- Tombol utama mudah dijangkau dan cukup besar.
- Hindari tabel lebar; gunakan kartu/list atau tabel dengan kolom prioritas.
- Navigasi mahasiswa memakai bottom navigation atau menu yang setara.
- Filter dan navigasi admin dapat menggunakan drawer.
- Pertahankan jarak tepi sekitar 16–20 px.

## 5. Design Tokens

```css
:root {
  /* Brand palette */
  --color-darkest: #051F20;
  --color-deep: #0B2B26;
  --color-forest: #163832;
  --color-teal: #235347;
  --color-sage: #8EB69B;
  --color-mint: #DAF1DE;

  /* Semantic UI */
  --color-background: #DAF1DE;
  --color-surface: #FFFFFF;
  --color-text: #051F20;
  --color-text-muted: #526B61;
  --color-border: #8EB69B;
  --color-primary: #163832;
  --color-primary-hover: #235347;
  --color-focus: #235347;
  --color-danger: #B42318;
  --color-warning: #8A6418;
  --color-success: #235347;

  /* Typography */
  --font-family: Inter, ui-sans-serif, system-ui, -apple-system,
                 BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Shape and elevation */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-pill: 999px;
  --shadow-card: 0 4px 16px rgba(5, 31, 32, 0.08);
  --shadow-popover: 0 12px 32px rgba(5, 31, 32, 0.16);

  /* Interaction */
  --control-height: 44px;
  --transition-fast: 150ms ease;
}
```

## 6. Komponen UI

### 6.1 Button
Varian:
- **Primary:** latar `#163832`, teks putih.
- **Primary hover:** `#235347`.
- **Secondary:** latar mint/putih, border `#8EB69B`, teks `#051F20`.
- **Ghost:** transparan, teks `#163832`.
- **Danger:** merah fungsional untuk tindakan berisiko.

Aturan:
- Tinggi kontrol minimal 44 px.
- Ada state default, hover, focus, pressed, disabled, loading.
- Tombol destructive seperti menolak laporan atau menghapus kategori membutuhkan konfirmasi.

### 6.2 Input dan Textarea
- Latar putih.
- Border `#8EB69B`.
- Label selalu terlihat; jangan hanya mengandalkan placeholder.
- Tampilkan penanda wajib/opsional.
- Error diletakkan dekat input dan menjelaskan cara memperbaikinya.
- Tampilkan batas karakter jika diperlukan.

### 6.3 Card
- Latar putih.
- Radius 12–18 px.
- Shadow tipis.
- Padding desktop 20–24 px; mobile 16 px.
- Jangan gunakan shadow berat pada semua elemen.

### 6.4 Status Badge
Gunakan label teks yang jelas:
- Dikirim
- Menunggu Verifikasi
- Menunggu Informasi
- Diteruskan
- Sedang Diproses
- Selesai
- Ditolak

Gunakan kombinasi warna, teks, dan bila sesuai ikon. Pastikan label tetap terbaca pada layar kecil.

### 6.5 Timeline
- Garis vertikal dengan titik status.
- Setiap item menampilkan status, tanggal/waktu, dan catatan.
- Urutkan dari yang terbaru atau terlama secara konsisten; rekomendasi detail pengaduan: kronologis dari awal ke terbaru.
- Bedakan peristiwa saat ini dari langkah yang telah selesai.

### 6.6 Notification
- Tampilkan judul singkat, ringkasan, waktu, dan status sudah/belum dibaca.
- Klik notifikasi membuka detail laporan terkait.
- Sediakan empty state jika belum ada notifikasi.

### 6.7 Modal dan Drawer
- Gunakan untuk konfirmasi atau filter sekunder, bukan untuk seluruh alur panjang.
- Mobile menggunakan bottom sheet/drawer bila lebih nyaman.
- Modal memiliki judul, tombol aksi yang jelas, dan dapat ditutup dengan keyboard bila sesuai.

## 7. Struktur Navigasi

### Mahasiswa — Web
Header: logo LaporKampus, navigasi utama, notifikasi, profil.
Menu:
- Beranda
- Pengaduan Saya
- Buat Pengaduan
- Notifikasi
- Profil/Pusat Bantuan

### Mahasiswa — Mobile
Bottom navigation yang disarankan:
- Beranda
- Pengaduan Saya
- Buat Laporan (aksi utama)
- Notifikasi
- Profil

Jika lima item terlalu padat untuk perangkat atau framework target, letakkan Buat Laporan sebagai tombol utama yang menonjol dan pertahankan empat menu lainnya.

### Admin/Petugas — Web
Sidebar:
- Dashboard
- Pengaduan
- Tugas Saya (untuk petugas)
- Kategori
- Pengguna (admin)
- Statistik
- Riwayat Aktivitas
- Pengaturan

### Admin/Petugas — Mobile
- Sidebar berubah menjadi drawer.
- Daftar laporan menjadi list/card dengan filter.
- Aksi utama pada detail laporan tetap terlihat tanpa menutupi konten.
- Formulir pembaruan status memakai layout satu kolom.

## 8. Spesifikasi Halaman Utama

### 8.1 Login
Tujuan: pengguna masuk dengan cepat dan memahami bahwa akses sesuai perannya.

Komponen:
- Logo dan nama aplikasi.
- Judul “Masuk ke LaporKampus”.
- Input email/NIM dan kata sandi.
- Tombol tampil/sembunyikan kata sandi.
- Tombol Masuk.
- Tautan bantuan akun.
- Pesan error yang aman dan jelas.

Jika menggunakan SSO kampus, tombol SSO menggantikan atau melengkapi login lokal. Jangan menampilkan opsi registrasi jika akun dibuat oleh kampus dan registrasi mandiri tidak diizinkan.

### 8.2 Beranda Mahasiswa
Urutan konten:
1. Sapaan dan ringkasan singkat.
2. Tombol utama “Buat Pengaduan”.
3. Ringkasan jumlah laporan berdasarkan status.
4. Daftar pengaduan terbaru.
5. Panduan singkat atau FAQ.

Desktop dapat menggunakan grid dua kolom; mobile satu kolom. Jangan memenuhi layar mobile dengan statistik yang kurang penting.

### 8.3 Formulir Pengaduan
Gunakan formulir bertahap atau bagian yang terkelompok:
1. Kategori.
2. Judul dan deskripsi.
3. Lokasi dan waktu kejadian.
4. Lampiran dan privasi.
5. Tinjau dan kirim.

Field:
- Kategori (wajib).
- Judul (wajib).
- Deskripsi (wajib).
- Lokasi kejadian (wajib bila relevan).
- Waktu kejadian (opsional).
- Foto/dokumen bukti (opsional, dengan batas tipe/ukuran).
- Pilihan privasi (hanya jika didukung kebijakan kampus).

Perilaku:
- Tampilkan indikator langkah jika formulir bertahap.
- Pertahankan input ketika validasi gagal.
- Minta konfirmasi sebelum meninggalkan formulir yang belum tersimpan.
- Tampilkan progres upload dan kegagalan upload.
- Sebelum pengiriman, berikan ringkasan yang dapat diperiksa.

### 8.4 Konfirmasi Pengiriman
Komponen:
- Ikon sukses.
- Teks “Pengaduan berhasil dikirim”.
- Nomor laporan.
- Tombol “Lihat Detail”.
- Tombol sekunder “Kembali ke Beranda”.

Jangan mengandalkan warna hijau saja untuk menyatakan keberhasilan.

### 8.5 Pengaduan Saya
Komponen:
- Search berdasarkan nomor/judul.
- Filter status dan kategori.
- Daftar kartu berisi nomor, judul, kategori, tanggal, status.
- Empty state dengan tombol “Buat Pengaduan”.
- Loading skeleton dan error state.

Pada mobile, filter dapat dibuka lewat drawer/bottom sheet.

### 8.6 Detail Pengaduan
Urutan:
1. Nomor laporan dan status.
2. Judul, kategori, lokasi, dan tanggal.
3. Deskripsi dan lampiran.
4. Timeline status.
5. Tanggapan/catatan yang boleh dilihat pelapor.
6. Tombol untuk memberikan informasi tambahan bila diminta.
7. Rating setelah selesai.

Identitas pelapor tidak ditampilkan kepada pengguna lain. Catatan internal petugas harus dipisahkan dari tanggapan yang dapat dilihat mahasiswa.

### 8.7 Dashboard Admin
Header dengan judul halaman dan profil.
Kartu statistik:
- Total pengaduan.
- Menunggu verifikasi.
- Sedang diproses.
- Selesai.

Bagian berikut:
- Daftar laporan terbaru.
- Filter status/kategori/prioritas.
- Pencarian.
- Aksi detail/verifikasi.
- Grafik sederhana jika data cukup.

Jangan memakai angka contoh sebagai data produksi. Jika belum ada data, tampilkan empty state atau data dummy yang diberi label.

### 8.8 Verifikasi dan Penugasan
- Ringkasan laporan dan bukti.
- Pilihan kategori/prioritas.
- Pilihan unit/petugas tujuan.
- Tombol “Minta Informasi”, “Teruskan”, atau “Tolak”.
- Penolakan harus mewajibkan alasan.
- Perubahan status harus meminta konfirmasi jika berdampak besar.
- Catatan internal dan pesan untuk pelapor harus dibedakan.

### 8.9 Detail Penanganan Petugas
- Informasi laporan yang ditugaskan.
- Status dan target waktu jika ditetapkan.
- Riwayat tindakan.
- Formulir catatan penanganan.
- Tombol perbarui progres.
- Saat menandai selesai, wajibkan ringkasan hasil penanganan.

### 8.10 Notifikasi
- Daftar pembaruan terbaru.
- Label sudah/belum dibaca.
- Klik menuju laporan terkait.
- Empty state yang ramah.
- Notifikasi tidak boleh menampilkan isi laporan sensitif secara berlebihan pada layar terkunci.

### 8.11 Profil dan Pengaturan
- Informasi akun.
- Peran pengguna.
- Preferensi notifikasi jika tersedia.
- Pusat bantuan.
- Kebijakan privasi.
- Keluar.

## 9. Responsive Behavior

| Area | Desktop | Mobile |
|---|---|---|
| Navigasi mahasiswa | Header/top navigation | Bottom navigation |
| Dashboard admin | Sidebar + konten | Drawer + konten satu kolom |
| Statistik | 3–4 kartu sejajar | 1–2 kolom sesuai lebar |
| Daftar laporan | Tabel | Kartu/list ringkas |
| Formulir | Lebar terbatas, bisa dua kolom untuk field pendek | Satu kolom |
| Filter | Selalu terlihat atau toolbar | Drawer/bottom sheet |
| Detail laporan | Dua kolom bila berguna | Satu kolom |
| Dialog | Modal tengah | Modal responsif atau bottom sheet |

Pastikan aksi penting tidak tertutup keyboard virtual saat input pada mobile.

## 10. Accessibility dan Feedback States

Setiap halaman penting perlu memiliki:
- **Loading:** spinner/skeleton dan teks bila proses lama.
- **Empty:** jelaskan belum ada data dan berikan tindakan berikutnya.
- **Error:** jelaskan masalah dan cara mencoba kembali.
- **Success:** konfirmasi hasil tindakan.
- **Disabled:** jelaskan atau tunjukkan alasan kontrol tidak aktif jika tidak jelas.
- **Focus:** outline keyboard terlihat.

Persyaratan tambahan:
- Navigasi bisa digunakan dengan keyboard.
- Gunakan elemen semantik dan label input yang benar.
- Gambar bukti memiliki teks alternatif bila relevan.
- Kontras teks diperiksa terhadap WCAG 2.2 AA sejauh memungkinkan.
- Jangan menggunakan warna sebagai satu-satunya pembeda.
- Hindari animasi yang berlebihan; hormati preferensi reduced motion.

## 11. Microcopy yang Disarankan

- Tombol utama: **Buat Pengaduan**
- Tombol formulir: **Tinjau Pengaduan**
- Tombol kirim: **Kirim Pengaduan**
- Konfirmasi: **Pengaduan berhasil dikirim**
- Empty state: **Belum ada pengaduan. Buat laporan pertama untuk memulai.**
- Permintaan informasi: **Petugas membutuhkan informasi tambahan agar laporan dapat diproses.**
- Penolakan: **Pengaduan belum dapat diproses. Baca alasan yang diberikan dan hubungi petugas jika perlu.**
- Selesai: **Penanganan ditandai selesai. Periksa ringkasan tindakan dari petugas.**
- Error umum: **Terjadi kendala saat menyimpan data. Periksa koneksi lalu coba lagi.**

Gunakan bahasa Indonesia yang konsisten dan hindari istilah teknis dalam pesan yang ditujukan kepada mahasiswa.

## 12. Aturan Privasi dalam UI

- Jangan menampilkan identitas pelapor pada daftar yang dapat diakses publik.
- Pilihan anonim harus menjelaskan siapa yang masih dapat melihat identitas.
- Lampiran dan catatan sensitif hanya tersedia bagi peran berwenang.
- Pisahkan catatan internal petugas dari tanggapan publik kepada pelapor.
- Sebelum mengirim laporan sensitif, tampilkan penjelasan privasi dan kanal bantuan yang relevan.
- Jangan membuat halaman publik yang menampilkan isi pengaduan secara default.

## 13. Checklist Review Desain

- [ ] Palet enam warna utama digunakan konsisten.
- [ ] Teks memiliki kontras yang cukup.
- [ ] Tombol utama mudah dikenali.
- [ ] Formulir dapat digunakan pada layar 360 px.
- [ ] Dashboard admin dapat digunakan di desktop dan mobile.
- [ ] Daftar laporan tidak memaksa scroll horizontal pada mobile.
- [ ] Semua status memiliki teks, bukan warna saja.
- [ ] Terdapat loading, empty, success, dan error state.
- [ ] Tindakan menolak atau menyelesaikan laporan memiliki konfirmasi/catatan sesuai kebutuhan.
- [ ] Catatan internal terpisah dari tanggapan yang dilihat pelapor.
- [ ] Identitas dan lampiran sensitif dilindungi sesuai hak akses.
- [ ] Navigasi keyboard dan fokus terlihat.
- [ ] Komponen web dan mobile menggunakan istilah dan perilaku yang konsisten.

## 14. Catatan Implementasi

Dokumen ini adalah pedoman desain, bukan file desain Figma. Gunakan token dan spesifikasi ini sebagai dasar pembuatan komponen reusable. Jika web dan mobile dikembangkan sebagai aplikasi terpisah, keduanya sebaiknya memakai design token, API, aturan status, dan pola validasi yang sama.
