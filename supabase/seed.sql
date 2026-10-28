-- =============================================================================
-- Seed Data: seed.sql
-- Aplikasi: LaporKampus
-- =============================================================================

-- 1. USERS SEED
INSERT INTO public.users (id, email, name, nim_nip, role, department, phone_number) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@kampus.ac.id', 'Budi Santoso, M.Kom', '198501152010121001', 'admin', 'Bagian Umum & Rektorat', '081234567890'),
  ('a0000000-0000-0000-0000-000000000002', 'petugas.sarpras@kampus.ac.id', 'Agus Prasetyo', '199003202015041002', 'petugas', 'Unit Sarana & Prasarana', '081234567891'),
  ('a0000000-0000-0000-0000-000000000003', 'petugas.it@kampus.ac.id', 'Rian Hidayat', '199207102018011003', 'petugas', 'Unit IT & Jaringan', '081234567892'),
  ('m0000000-0000-0000-0000-000000000001', 'mahasiswa@kampus.ac.id', 'Ahmad Fauzi', '2201010045', 'mahasiswa', 'Teknik Informatika', '085712345678'),
  ('m0000000-0000-0000-0000-000000000002', 'siti.nurhaliza@kampus.ac.id', 'Siti Nurhaliza', '2201010088', 'mahasiswa', 'Sistem Informasi', '085712345679')
ON CONFLICT (id) DO NOTHING;

-- 2. CATEGORIES SEED (9 Kategori sesuai PRD.md Bagian 6)
INSERT INTO public.categories (id, name, slug, description, icon, is_sensitive) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Fasilitas Kampus', 'fasilitas-kampus', 'Kerusakan AC, proyektor, kursi kelas, toilet, lift, dan sarana fisik gedung.', 'Building', false),
  ('c0000000-0000-0000-0000-000000000002', 'Jaringan & Teknologi', 'jaringan-teknologi', 'Permasalahan WiFi kampus, portal akademik SIAKAD, lab komputer, dan server.', 'Wifi', false),
  ('c0000000-0000-0000-0000-000000000003', 'Kebersihan & Lingkungan', 'kebersihan-lingkungan', 'Kebersihan area kelas, koridor, taman, tempat sampah, dan kantin kampus.', 'Sparkles', false),
  ('c0000000-0000-0000-0000-000000000004', 'Pelayanan Administrasi', 'pelayanan-administrasi', 'Layanan BAAK, keuangan, legalisir, perpustakaan, dan administrasi fakultas.', 'FileText', false),
  ('c0000000-0000-0000-0000-000000000005', 'Akademik', 'akademik', 'Jadwal perkuliahan, transparansi nilai, proses bimbingan, dan evaluasi dosen.', 'GraduationCap', false),
  ('c0000000-0000-0000-0000-000000000006', 'Keamanan & Ketertiban', 'keamanan-ketertiban', 'Kehilangan barang, parkir liar, ketertiban lingkungan, dan pos satpam.', 'ShieldAlert', false),
  ('c0000000-0000-0000-0000-000000000007', 'Perundungan / Sensitif', 'perundungan-sensitif', 'Pelecehan, diskriminasi, kekerasan verbal/fisik. Ditangani dengan privasi ketat.', 'Lock', true),
  ('c0000000-0000-0000-0000-000000000008', 'Saran & Aspirasi', 'saran-aspirasi', 'Ide, kritik membangun, dan usulan pengembangan fasilitas atau kebijakan kampus.', 'Lightbulb', false),
  ('c0000000-0000-0000-0000-000000000009', 'Lainnya', 'lainnya', 'Pengaduan lain yang tidak tercakup dalam kategori yang sudah ada.', 'HelpCircle', false)
ON CONFLICT (id) DO NOTHING;

-- 3. COMPLAINTS SEED
INSERT INTO public.complaints (id, ticket_number, user_id, category_id, title, description, location, incident_time, status, priority, is_anonymous, created_at) VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    'LPK-20261025-0001',
    'm0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'AC Ruang Kuliah 304 Gedung B Bocor dan Menetes ke Kursi',
    'Air menetes cukup deras dari unit AC sisi kanan ruang 304 sehingga 4 kursi di bawahnya basah dan tidak dapat digunakan untuk perkuliahan jam 08.00 WIB.',
    'Gedung B Lantai 3, Ruang 304',
    '2026-10-25 08:30:00+07',
    'selesai',
    'sedang',
    false,
    '2026-10-25 09:00:00+07'
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'LPK-20261026-0002',
    'm0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    'Akses WiFi Mahasiswa Gedung Perpustakaan Terputus',
    'Koneksi WiFi @Campus-Student di lantai 2 perpustakaan pusat mengalami kendala obtain IP address sejak kemarin sore, membuat banyak mahasiswa kesulitan mengerjakan tugas.',
    'Perpustakaan Pusat Lantai 2',
    '2026-10-26 14:00:00+07',
    'sedang_diproses',
    'tinggi',
    false,
    '2026-10-26 14:30:00+07'
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'LPK-20261027-0003',
    'm0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'Kran Wastafel Toilet Pria Lantai 1 Gedung A Patah',
    'Kran air di wastafel patah sehingga air menyembur ke lantai dan menimbulkan genangan licin di dekat pintu masuk toilet.',
    'Gedung A Lantai 1 Toilet Pria',
    '2026-10-27 10:15:00+07',
    'menunggu_verifikasi',
    'sedang',
    false,
    '2026-10-27 10:30:00+07'
  ),
  (
    'd0000000-0000-0000-0000-000000000004',
    'LPK-20261027-0004',
    'm0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000007',
    'Laporan Kejadian Perundungan Verbal di Kantin',
    'Terjadi tindakan intimidasi dan perundungan verbal secara berulang kepada mahasiswa baru di area kantin belakang pada jam istirahat siang.',
    'Area Gazebo Kantin Belakang Kampus',
    '2026-10-27 12:00:00+07',
    'menunggu_verifikasi',
    'darurat',
    true,
    '2026-10-27 13:00:00+07'
  )
ON CONFLICT (id) DO NOTHING;

-- 4. COMPLAINT STATUS HISTORY
INSERT INTO public.complaint_status_history (complaint_id, previous_status, new_status, actor_id, note, created_at) VALUES
  ('d0000000-0000-0000-0000-000000000001', NULL, 'dikirim', 'm0000000-0000-0000-0000-000000000001', 'Laporan berhasil dibuat oleh pelapor.', '2026-10-25 09:00:00+07'),
  ('d0000000-0000-0000-0000-000000000001', 'dikirim', 'menunggu_verifikasi', 'a0000000-0000-0000-0000-000000000001', 'Admin menerima laporan untuk diverifikasi kelayakannya.', '2026-10-25 09:15:00+07'),
  ('d0000000-0000-0000-0000-000000000001', 'menunggu_verifikasi', 'diteruskan', 'a0000000-0000-0000-0000-000000000001', 'Laporan diverifikasi dan diteruskan ke Unit Sarana & Prasarana.', '2026-10-25 09:40:00+07'),
  ('d0000000-0000-0000-0000-000000000001', 'diteruskan', 'sedang_diproses', 'a0000000-0000-0000-0000-000000000002', 'Teknisi Sarpras tiba di lokasi dan melakukan pengecekan pipa drainase AC.', '2026-10-25 10:30:00+07'),
  ('d0000000-0000-0000-0000-000000000001', 'sedang_diproses', 'selesai', 'a0000000-0000-0000-0000-000000000002', 'Pipa pembuangan AC tersumbat debu telah dibersihkan dan disolasi ulang. AC kembali normal dan dingin tanpa kebocoran.', '2026-10-25 11:45:00+07'),

  ('d0000000-0000-0000-0000-000000000002', NULL, 'dikirim', 'm0000000-0000-0000-0000-000000000001', 'Laporan dikirim mahasiswa.', '2026-10-26 14:30:00+07'),
  ('d0000000-0000-0000-0000-000000000002', 'dikirim', 'diteruskan', 'a0000000-0000-0000-0000-000000000001', 'Laporan diverifikasi dan ditugaskan ke Unit IT & Jaringan.', '2026-10-26 15:00:00+07'),
  ('d0000000-0000-0000-0000-000000000002', 'diteruskan', 'sedang_diproses', 'a0000000-0000-0000-0000-000000000003', 'Access Point di lantai 2 sedang di-reboot dan konfigurasi DHCP dicek.', '2026-10-26 16:15:00+07'),

  ('d0000000-0000-0000-0000-000000000003', NULL, 'dikirim', 'm0000000-0000-0000-0000-000000000001', 'Laporan dikirim mahasiswa.', '2026-10-27 10:30:00+07');

-- 5. COMPLAINT RESPONSES (Tanggapan publik dan catatan internal)
INSERT INTO public.complaint_responses (complaint_id, author_id, content, is_internal, created_at) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Halo Ahmad, teknisi kami sudah mengganti pipa drainase AC dan menguji pengoperasian selama 30 menit. Ruang 304 sudah siap dipakai kembali.', false, '2026-10-25 11:46:00+07'),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'Catatan internal: Switch Cisco Catalyst di rack lantai 2 overheat. Perlu pendingin tambahan di ruang server.', true, '2026-10-26 16:10:00+07'),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'Pembaruan: Tim IT sedang menstabilkan router access point lantai 2. Estimasi normal kembali pukul 17.30 WIB.', false, '2026-10-26 16:20:00+07');

-- 6. COMPLAINT RATINGS (Rating dari mahasiswa untuk laporan yang sudah selesai)
INSERT INTO public.complaint_ratings (complaint_id, user_id, rating, feedback, created_at) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 5, 'Respon sangat cepat! Petugas langsung datang kurang dari 2 jam setelah melapor.', '2026-10-25 12:30:00+07')
ON CONFLICT (complaint_id) DO NOTHING;

-- 7. NOTIFICATIONS
INSERT INTO public.notifications (user_id, complaint_id, title, message, is_read, created_at) VALUES
  ('m0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Pengaduan Selesai Ditangani', 'Laporan LPK-20261025-0001 telah selesai diperbaiki oleh teknisi Sarpras. Silakan beri penilaian.', true, '2026-10-25 11:46:00+07'),
  ('m0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'Status Diperbarui', 'Laporan WiFi Perpustakaan kini berstatus Sedang Diproses oleh tim IT & Jaringan.', false, '2026-10-26 16:15:00+07'),
  ('m0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'Pengaduan Berhasil Dikirim', 'Nomor tiket Anda: LPK-20261027-0003. Menunggu verifikasi admin kampus.', false, '2026-10-27 10:30:00+07');

