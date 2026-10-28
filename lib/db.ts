import {
  Category,
  Complaint,
  ComplaintAttachment,
  ComplaintPriority,
  ComplaintRating,
  ComplaintResponse,
  ComplaintStatus,
  ComplaintStatusHistory,
  NotificationItem,
  User,
  UserRole,
} from "@/types/database";

// Data awal (Seed)
const INITIAL_USERS: User[] = [
  {
    id: "m0000000-0000-0000-0000-000000000001",
    email: "mahasiswa@kampus.ac.id",
    name: "Ahmad Fauzi",
    nim_nip: "2201010045",
    role: "mahasiswa",
    department: "Teknik Informatika",
    phone_number: "085712345678",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "m0000000-0000-0000-0000-000000000002",
    email: "siti.nurhaliza@kampus.ac.id",
    name: "Siti Nurhaliza",
    nim_nip: "2201010088",
    role: "mahasiswa",
    department: "Sistem Informasi",
    phone_number: "085712345679",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "a0000000-0000-0000-0000-000000000001",
    email: "admin@kampus.ac.id",
    name: "Budi Santoso, M.Kom",
    nim_nip: "198501152010121001",
    role: "admin",
    department: "Bagian Umum & Rektorat",
    phone_number: "081234567890",
    created_at: "2026-01-01T08:00:00Z",
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    email: "petugas.sarpras@kampus.ac.id",
    name: "Agus Prasetyo",
    nim_nip: "199003202015041002",
    role: "petugas",
    department: "Unit Sarana & Prasarana",
    phone_number: "081234567891",
    created_at: "2026-01-01T08:00:00Z",
  },
  {
    id: "a0000000-0000-0000-0000-000000000003",
    email: "petugas.it@kampus.ac.id",
    name: "Rian Hidayat",
    nim_nip: "199207102018011003",
    role: "petugas",
    department: "Unit IT & Jaringan",
    phone_number: "081234567892",
    created_at: "2026-01-01T08:00:00Z",
  },
];

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "c0000000-0000-0000-0000-000000000001",
    name: "Fasilitas Kampus",
    slug: "fasilitas-kampus",
    description: "Kerusakan AC, proyektor, kursi kelas, toilet, lift, dan sarana fisik gedung.",
    icon: "Building",
    is_sensitive: false,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c0000000-0000-0000-0000-000000000002",
    name: "Jaringan & Teknologi",
    slug: "jaringan-teknologi",
    description: "Permasalahan WiFi kampus, portal akademik SIAKAD, lab komputer, dan server.",
    icon: "Wifi",
    is_sensitive: false,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c0000000-0000-0000-0000-000000000003",
    name: "Kebersihan & Lingkungan",
    slug: "kebersihan-lingkungan",
    description: "Kebersihan area kelas, koridor, taman, tempat sampah, dan kantin kampus.",
    icon: "Sparkles",
    is_sensitive: false,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c0000000-0000-0000-0000-000000000004",
    name: "Pelayanan Administrasi",
    slug: "pelayanan-administrasi",
    description: "Layanan BAAK, keuangan, legalisir, perpustakaan, dan administrasi fakultas.",
    icon: "FileText",
    is_sensitive: false,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c0000000-0000-0000-0000-000000000005",
    name: "Akademik",
    slug: "akademik",
    description: "Jadwal perkuliahan, transparansi nilai, proses bimbingan, dan evaluasi dosen.",
    icon: "GraduationCap",
    is_sensitive: false,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c0000000-0000-0000-0000-000000000006",
    name: "Keamanan & Ketertiban",
    slug: "keamanan-ketertiban",
    description: "Kehilangan barang, parkir liar, ketertiban lingkungan, dan pos satpam.",
    icon: "ShieldAlert",
    is_sensitive: false,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c0000000-0000-0000-0000-000000000007",
    name: "Perundungan / Sensitif",
    slug: "perundungan-sensitif",
    description: "Pelecehan, diskriminasi, kekerasan verbal/fisik. Ditangani dengan privasi ketat.",
    icon: "Lock",
    is_sensitive: true,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c0000000-0000-0000-0000-000000000008",
    name: "Saran & Aspirasi",
    slug: "saran-aspirasi",
    description: "Ide, kritik membangun, dan usulan pengembangan fasilitas atau kebijakan kampus.",
    icon: "Lightbulb",
    is_sensitive: false,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c0000000-0000-0000-0000-000000000009",
    name: "Lainnya",
    slug: "lainnya",
    description: "Pengaduan lain yang tidak tercakup dalam kategori yang sudah ada.",
    icon: "HelpCircle",
    is_sensitive: false,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
];

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "d0000000-0000-0000-0000-000000000001",
    ticket_number: "LPK-20261025-0001",
    user_id: "m0000000-0000-0000-0000-000000000001",
    user_name: "Ahmad Fauzi",
    user_nim: "2201010045",
    category_id: "c0000000-0000-0000-0000-000000000001",
    title: "AC Ruang Kuliah 304 Gedung B Bocor dan Menetes ke Kursi",
    description:
      "Air menetes cukup deras dari unit AC sisi kanan ruang 304 sehingga 4 kursi di bawahnya basah dan tidak dapat digunakan untuk perkuliahan jam 08.00 WIB.",
    location: "Gedung B Lantai 3, Ruang 304",
    incident_time: "2026-10-25T08:30:00Z",
    status: "selesai",
    priority: "sedang",
    is_anonymous: false,
    created_at: "2026-10-25T09:00:00Z",
    updated_at: "2026-10-25T11:45:00Z",
    attachments: [
      {
        id: "att-1",
        complaint_id: "d0000000-0000-0000-0000-000000000001",
        file_name: "bukti_ac_bocor.jpg",
        file_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        file_type: "image/jpeg",
        file_size: 1024 * 450,
        created_at: "2026-10-25T09:00:00Z",
      },
    ],
    status_history: [
      {
        id: "hist-1",
        complaint_id: "d0000000-0000-0000-0000-000000000001",
        previous_status: null,
        new_status: "dikirim",
        actor_id: "m0000000-0000-0000-0000-000000000001",
        actor_name: "Ahmad Fauzi",
        actor_role: "mahasiswa",
        note: "Laporan berhasil dibuat oleh pelapor.",
        created_at: "2026-10-25T09:00:00Z",
      },
      {
        id: "hist-2",
        complaint_id: "d0000000-0000-0000-0000-000000000001",
        previous_status: "dikirim",
        new_status: "menunggu_verifikasi",
        actor_id: "a0000000-0000-0000-0000-000000000001",
        actor_name: "Budi Santoso, M.Kom",
        actor_role: "admin",
        note: "Admin menerima laporan untuk diverifikasi kelayakannya.",
        created_at: "2026-10-25T09:15:00Z",
      },
      {
        id: "hist-3",
        complaint_id: "d0000000-0000-0000-0000-000000000001",
        previous_status: "menunggu_verifikasi",
        new_status: "diteruskan",
        actor_id: "a0000000-0000-0000-0000-000000000001",
        actor_name: "Budi Santoso, M.Kom",
        actor_role: "admin",
        note: "Laporan diverifikasi dan diteruskan ke Unit Sarana & Prasarana.",
        created_at: "2026-10-25T09:40:00Z",
      },
      {
        id: "hist-4",
        complaint_id: "d0000000-0000-0000-0000-000000000001",
        previous_status: "diteruskan",
        new_status: "sedang_diproses",
        actor_id: "a0000000-0000-0000-0000-000000000002",
        actor_name: "Agus Prasetyo",
        actor_role: "petugas",
        note: "Teknisi Sarpras tiba di lokasi dan melakukan pengecekan pipa drainase AC.",
        created_at: "2026-10-25T10:30:00Z",
      },
      {
        id: "hist-5",
        complaint_id: "d0000000-0000-0000-0000-000000000001",
        previous_status: "sedang_diproses",
        new_status: "selesai",
        actor_id: "a0000000-0000-0000-0000-000000000002",
        actor_name: "Agus Prasetyo",
        actor_role: "petugas",
        note: "Pipa pembuangan AC tersumbat debu telah dibersihkan dan disolasi ulang. AC kembali normal dan dingin tanpa kebocoran.",
        created_at: "2026-10-25T11:45:00Z",
      },
    ],
    responses: [
      {
        id: "resp-1",
        complaint_id: "d0000000-0000-0000-0000-000000000001",
        author_id: "a0000000-0000-0000-0000-000000000002",
        author_name: "Agus Prasetyo (Petugas Sarpras)",
        author_role: "petugas",
        content:
          "Halo Ahmad, teknisi kami sudah mengganti pipa drainase AC dan menguji pengoperasian selama 30 menit. Ruang 304 sudah siap dipakai kembali.",
        is_internal: false,
        created_at: "2026-10-25T11:46:00Z",
      },
    ],
    rating: {
      id: "rate-1",
      complaint_id: "d0000000-0000-0000-0000-000000000001",
      user_id: "m0000000-0000-0000-0000-000000000001",
      rating: 5,
      feedback: "Respon sangat cepat! Petugas langsung datang kurang dari 2 jam setelah melapor.",
      created_at: "2026-10-25T12:30:00Z",
    },
  },
  {
    id: "d0000000-0000-0000-0000-000000000002",
    ticket_number: "LPK-20261026-0002",
    user_id: "m0000000-0000-0000-0000-000000000001",
    user_name: "Ahmad Fauzi",
    user_nim: "2201010045",
    category_id: "c0000000-0000-0000-0000-000000000002",
    title: "Akses WiFi Mahasiswa Gedung Perpustakaan Terputus",
    description:
      "Koneksi WiFi @Campus-Student di lantai 2 perpustakaan pusat mengalami kendala obtain IP address sejak kemarin sore, membuat banyak mahasiswa kesulitan mengerjakan tugas.",
    location: "Perpustakaan Pusat Lantai 2",
    incident_time: "2026-10-26T14:00:00Z",
    status: "sedang_diproses",
    priority: "tinggi",
    is_anonymous: false,
    created_at: "2026-10-26T14:30:00Z",
    updated_at: "2026-10-26T16:15:00Z",
    attachments: [],
    assignment: {
      id: "assign-2",
      complaint_id: "d0000000-0000-0000-0000-000000000002",
      assigned_to: "a0000000-0000-0000-0000-000000000003",
      assigned_to_name: "Rian Hidayat (Unit IT)",
      assigned_by: "a0000000-0000-0000-0000-000000000001",
      notes: "Tolong periksa access point di ruang baca barat lantai 2.",
      created_at: "2026-10-26T15:00:00Z",
    },
    status_history: [
      {
        id: "hist-21",
        complaint_id: "d0000000-0000-0000-0000-000000000002",
        previous_status: null,
        new_status: "dikirim",
        actor_id: "m0000000-0000-0000-0000-000000000001",
        actor_name: "Ahmad Fauzi",
        actor_role: "mahasiswa",
        note: "Laporan dikirim mahasiswa.",
        created_at: "2026-10-26T14:30:00Z",
      },
      {
        id: "hist-22",
        complaint_id: "d0000000-0000-0000-0000-000000000002",
        previous_status: "dikirim",
        new_status: "diteruskan",
        actor_id: "a0000000-0000-0000-0000-000000000001",
        actor_name: "Budi Santoso, M.Kom",
        actor_role: "admin",
        note: "Laporan diverifikasi dan ditugaskan ke Unit IT & Jaringan.",
        created_at: "2026-10-26T15:00:00Z",
      },
      {
        id: "hist-23",
        complaint_id: "d0000000-0000-0000-0000-000000000002",
        previous_status: "diteruskan",
        new_status: "sedang_diproses",
        actor_id: "a0000000-0000-0000-0000-000000000003",
        actor_name: "Rian Hidayat",
        actor_role: "petugas",
        note: "Access Point di lantai 2 sedang di-reboot dan konfigurasi DHCP dicek.",
        created_at: "2026-10-26T16:15:00Z",
      },
    ],
    responses: [
      {
        id: "resp-21",
        complaint_id: "d0000000-0000-0000-0000-000000000002",
        author_id: "a0000000-0000-0000-0000-000000000003",
        author_name: "Rian Hidayat (Petugas IT)",
        author_role: "petugas",
        content: "Catatan internal: Switch Cisco Catalyst di rack lantai 2 overheat. Perlu pendingin tambahan di ruang server.",
        is_internal: true,
        created_at: "2026-10-26T16:10:00Z",
      },
      {
        id: "resp-22",
        complaint_id: "d0000000-0000-0000-0000-000000000002",
        author_id: "a0000000-0000-0000-0000-000000000003",
        author_name: "Rian Hidayat (Petugas IT)",
        author_role: "petugas",
        content: "Pembaruan: Tim IT sedang menstabilkan router access point lantai 2. Estimasi normal kembali pukul 17.30 WIB.",
        is_internal: false,
        created_at: "2026-10-26T16:20:00Z",
      },
    ],
  },
  {
    id: "d0000000-0000-0000-0000-000000000003",
    ticket_number: "LPK-20261027-0003",
    user_id: "m0000000-0000-0000-0000-000000000001",
    user_name: "Ahmad Fauzi",
    user_nim: "2201010045",
    category_id: "c0000000-0000-0000-0000-000000000003",
    title: "Kran Wastafel Toilet Pria Lantai 1 Gedung A Patah",
    description:
      "Kran air di wastafel patah sehingga air menyembur ke lantai dan menimbulkan genangan licin di dekat pintu masuk toilet.",
    location: "Gedung A Lantai 1 Toilet Pria",
    incident_time: "2026-10-27T10:15:00Z",
    status: "menunggu_verifikasi",
    priority: "sedang",
    is_anonymous: false,
    created_at: "2026-10-27T10:30:00Z",
    updated_at: "2026-10-27T10:30:00Z",
    attachments: [],
    status_history: [
      {
        id: "hist-31",
        complaint_id: "d0000000-0000-0000-0000-000000000003",
        previous_status: null,
        new_status: "dikirim",
        actor_id: "m0000000-0000-0000-0000-000000000001",
        actor_name: "Ahmad Fauzi",
        actor_role: "mahasiswa",
        note: "Laporan dikirim mahasiswa.",
        created_at: "2026-10-27T10:30:00Z",
      },
    ],
    responses: [],
  },
  {
    id: "d0000000-0000-0000-0000-000000000004",
    ticket_number: "LPK-20261027-0004",
    user_id: "m0000000-0000-0000-0000-000000000002",
    user_name: "Siti Nurhaliza",
    user_nim: "2201010088",
    category_id: "c0000000-0000-0000-0000-000000000007",
    title: "Laporan Kejadian Perundungan Verbal di Kantin",
    description:
      "Terjadi tindakan intimidasi dan perundungan verbal secara berulang kepada mahasiswa baru di area kantin belakang pada jam istirahat siang.",
    location: "Area Gazebo Kantin Belakang Kampus",
    incident_time: "2026-10-27T12:00:00Z",
    status: "menunggu_verifikasi",
    priority: "darurat",
    is_anonymous: true,
    created_at: "2026-10-27T13:00:00Z",
    updated_at: "2026-10-27T13:00:00Z",
    attachments: [],
    status_history: [
      {
        id: "hist-41",
        complaint_id: "d0000000-0000-0000-0000-000000000004",
        previous_status: null,
        new_status: "dikirim",
        actor_id: "m0000000-0000-0000-0000-000000000002",
        actor_name: "Siti Nurhaliza",
        actor_role: "mahasiswa",
        note: "Laporan kategori sensitif berhasil dikirim.",
        created_at: "2026-10-27T13:00:00Z",
      },
    ],
    responses: [],
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    user_id: "m0000000-0000-0000-0000-000000000001",
    complaint_id: "d0000000-0000-0000-0000-000000000001",
    title: "Pengaduan Selesai Ditangani",
    message: "Laporan LPK-20261025-0001 telah selesai diperbaiki oleh teknisi Sarpras. Silakan beri penilaian.",
    is_read: true,
    created_at: "2026-10-25T11:46:00Z",
  },
  {
    id: "notif-2",
    user_id: "m0000000-0000-0000-0000-000000000001",
    complaint_id: "d0000000-0000-0000-0000-000000000002",
    title: "Status Diperbarui",
    message: "Laporan WiFi Perpustakaan kini berstatus Sedang Diproses oleh tim IT & Jaringan.",
    is_read: false,
    created_at: "2026-10-26T16:15:00Z",
  },
  {
    id: "notif-3",
    user_id: "m0000000-0000-0000-0000-000000000001",
    complaint_id: "d0000000-0000-0000-0000-000000000003",
    title: "Pengaduan Berhasil Dikirim",
    message: "Nomor tiket Anda: LPK-20261027-0003. Menunggu verifikasi admin kampus.",
    is_read: false,
    created_at: "2026-10-27T10:30:00Z",
  },
];

// Persistent storage keys
const KEY_USERS = "laporkampus_users_v2";
const KEY_COMPLAINTS = "laporkampus_complaints_v2";
const KEY_CATEGORIES = "laporkampus_categories_v2";
const KEY_NOTIFICATIONS = "laporkampus_notifications_v2";

export class StorageService {
  private getStorage(): Storage | null {
    if (typeof window !== "undefined") {
      return window.localStorage;
    }
    return null;
  }

  getUsers(): User[] {
    const storage = this.getStorage();
    if (!storage) return INITIAL_USERS;
    try {
      const data = storage.getItem(KEY_USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  saveUsers(users: User[]): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(KEY_USERS, JSON.stringify(users));
    }
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  /**
   * Pendaftaran Mahasiswa Baru:
   * Peran WAJIB 'mahasiswa' - Cegah pengguna biasa mengangkat diri menjadi admin/petugas!
   */
  registerStudent(params: {
    email: string;
    name: string;
    nim: string;
    department: string;
    phone_number?: string;
  }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanNim = params.nim.trim();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: "Email sudah terdaftar dalam sistem." };
    }
    if (users.some((u) => u.nim_nip === cleanNim)) {
      return { success: false, error: "NIM sudah terdaftar dalam sistem." };
    }

    const newUser: User = {
      id: `m-${Date.now()}`,
      email: cleanEmail,
      name: params.name.trim(),
      nim_nip: cleanNim,
      role: "mahasiswa", // Kunci: selalu mahasiswa
      department: params.department.trim(),
      phone_number: params.phone_number?.trim(),
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    return { success: true, user: newUser };
  }

  getCategories(): Category[] {
    const storage = this.getStorage();
    if (!storage) return INITIAL_CATEGORIES;
    try {
      const data = storage.getItem(KEY_CATEGORIES);
      return data ? JSON.parse(data) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  updateCategory(category: Category, actor?: User): boolean {
    if (actor && actor.role !== "admin") {
      throw new Error("Hanya admin yang berwenang mengubah konfigurasi kategori.");
    }
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    this.saveCategories(categories);
    return true;
  }

  private saveCategories(categories: Category[]): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(KEY_CATEGORIES, JSON.stringify(categories));
    }
  }

  getComplaints(): Complaint[] {
    const storage = this.getStorage();
    if (!storage) return INITIAL_COMPLAINTS;
    try {
      const data = storage.getItem(KEY_COMPLAINTS);
      const complaints: Complaint[] = data ? JSON.parse(data) : INITIAL_COMPLAINTS;
      const categories = this.getCategories();
      return complaints.map((c) => ({
        ...c,
        category: categories.find((cat) => cat.id === c.category_id),
      }));
    } catch {
      return INITIAL_COMPLAINTS;
    }
  }

  /**
   * Mengambil detail pengaduan dengan pemeriksaan hak akses ketat:
   * - Mahasiswa HANYA dapat membuka pengaduan miliknya sendiri!
   * - Catatan internal (is_internal: true) TIDAK PERNAH disertakan pada tampilan mahasiswa!
   */
  getComplaintById(id: string, currentUser?: User | null): Complaint | null {
    const list = this.getComplaints();
    const complaint = list.find((c) => c.id === id || c.ticket_number === id);
    if (!complaint) return null;

    if (currentUser) {
      // 1. Isolasi Mahasiswa: Cegah buka laporan orang lain
      if (currentUser.role === "mahasiswa" && complaint.user_id !== currentUser.id) {
        return null; // Akses Ditolak
      }

      // 2. Proteksi Catatan Internal: Hilangkan dari array responses untuk mahasiswa
      if (currentUser.role === "mahasiswa") {
        return {
          ...complaint,
          responses: (complaint.responses || []).filter((r) => !r.is_internal),
        };
      }
    }

    return complaint;
  }

  saveComplaints(complaints: Complaint[]): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(KEY_COMPLAINTS, JSON.stringify(complaints));
    }
  }

  createComplaint(data: {
    user: User;
    category_id: string;
    title: string;
    description: string;
    location: string;
    incident_time?: string;
    is_anonymous: boolean;
    attachment?: {
      file_name: string;
      file_url: string;
      file_type: string;
      file_size: number;
    };
  }): Complaint {
    const complaints = this.getComplaints();
    const categories = this.getCategories();
    const category = categories.find((c) => c.id === data.category_id);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `LPK-${dateStr}-${randomSuffix}`;
    const newId = `d${Date.now()}-${randomSuffix}`;

    const newAttachments: ComplaintAttachment[] = data.attachment
      ? [
          {
            id: `att-${Date.now()}`,
            complaint_id: newId,
            file_name: data.attachment.file_name,
            file_url: data.attachment.file_url,
            file_type: data.attachment.file_type,
            file_size: data.attachment.file_size,
            created_at: now.toISOString(),
          },
        ]
      : [];

    const newComplaint: Complaint = {
      id: newId,
      ticket_number: ticketNumber,
      user_id: data.user.id,
      user_name: data.is_anonymous ? "Anonim (Mahasiswa)" : data.user.name,
      user_nim: data.is_anonymous ? "-" : data.user.nim_nip,
      category_id: data.category_id,
      category,
      title: data.title,
      description: data.description,
      location: data.location,
      incident_time: data.incident_time || now.toISOString(),
      status: "dikirim",
      priority: category?.is_sensitive ? "darurat" : "sedang",
      is_anonymous: data.is_anonymous,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      attachments: newAttachments,
      status_history: [
        {
          id: `hist-${Date.now()}`,
          complaint_id: newId,
          previous_status: null,
          new_status: "dikirim",
          actor_id: data.user.id,
          actor_name: data.user.name,
          actor_role: data.user.role,
          note: "Pengaduan berhasil dibuat oleh pelapor.",
          created_at: now.toISOString(),
        },
      ],
      responses: [],
    };

    complaints.unshift(newComplaint);
    this.saveComplaints(complaints);

    // Kirim notifikasi konfirmasi ke mahasiswa
    this.createNotification({
      user_id: data.user.id,
      complaint_id: newComplaint.id,
      title: "Pengaduan Berhasil Dikirim",
      message: `Nomor tiket ${newComplaint.ticket_number} telah terdaftar. Kami akan segera memverifikasinya.`,
    });

    return newComplaint;
  }

  /**
   * Perubahan Status dengan Validasi Hak Akses & Aturan Transisi:
   * - Mahasiswa dilarang keras melakukan tindakan administratif (tolak, teruskan, selesaikan).
   * - Penolakan WAJIB menyertakan alasan penolakan.
   * - Penyelesaian WAJIB menyertakan ringkasan tindakan.
   */
  updateComplaintStatus(params: {
    complaintId: string;
    newStatus: ComplaintStatus;
    actor: User;
    note: string;
    priority?: Complaint["priority"];
    assignedTo?: string;
  }): { success: boolean; complaint?: Complaint; error?: string } {
    const complaints = this.getComplaints();
    const complaint = complaints.find((c) => c.id === params.complaintId);
    if (!complaint) return { success: false, error: "Pengaduan tidak ditemukan." };

    // Aturan RBAC: Mahasiswa tidak boleh melakukan tindakan administratif
    if (params.actor.role === "mahasiswa") {
      // Mahasiswa hanya boleh memperbarui status jika menanggapi permintaan info
      if (
        complaint.status !== "menunggu_informasi" ||
        (params.newStatus !== "sedang_diproses" && params.newStatus !== "menunggu_verifikasi")
      ) {
        return {
          success: false,
          error: "Mahasiswa tidak memiliki kewenangan mengubah status ini secara langsung.",
        };
      }
    }

    // Terminal Status Check
    if (complaint.status === "selesai" || complaint.status === "ditolak") {
      return {
        success: false,
        error: `Pengaduan sudah berada pada status akhir (${complaint.status}) dan tidak dapat diubah lagi.`,
      };
    }

    // Validasi penolakan: Wajib alasan
    if (params.newStatus === "ditolak" && (!params.note || !params.note.trim())) {
      return {
        success: false,
        error: "Penolakan laporan wajib menyertakan alasan yang jelas.",
      };
    }

    // Validasi penyelesaian: Wajib ringkasan hasil tindakan
    if (params.newStatus === "selesai" && (!params.note || !params.note.trim())) {
      return {
        success: false,
        error: "Penyelesaian pengaduan wajib menyertakan ringkasan tindakan penanganan.",
      };
    }

    const previousStatus = complaint.status;
    complaint.status = params.newStatus;
    complaint.updated_at = new Date().toISOString();

    if (params.priority) {
      complaint.priority = params.priority;
    }

    if (params.assignedTo) {
      const assignedUser = this.getUserById(params.assignedTo);
      complaint.assignment = {
        id: `assign-${Date.now()}`,
        complaint_id: complaint.id,
        assigned_to: params.assignedTo,
        assigned_to_name: assignedUser?.name || "Petugas Terkait",
        assigned_by: params.actor.id,
        notes: params.note,
        created_at: new Date().toISOString(),
      };
    }

    const historyItem: ComplaintStatusHistory = {
      id: `hist-${Date.now()}`,
      complaint_id: complaint.id,
      previous_status: previousStatus,
      new_status: params.newStatus,
      actor_id: params.actor.id,
      actor_name: params.actor.name,
      actor_role: params.actor.role,
      note: params.note,
      created_at: new Date().toISOString(),
    };

    complaint.status_history = complaint.status_history || [];
    complaint.status_history.push(historyItem);

    this.saveComplaints(complaints);

    // Kirim notifikasi ke pelapor
    const statusTitles: Record<ComplaintStatus, string> = {
      dikirim: "Pengaduan Dibuat",
      menunggu_verifikasi: "Laporan Sedang Diverifikasi",
      menunggu_informasi: "Informasi Tambahan Diperlukan",
      diteruskan: "Laporan Diteruskan ke Unit Terkait",
      sedang_diproses: "Laporan Sedang Diproses",
      selesai: "Laporan Selesai Ditangani",
      ditolak: "Pengaduan Belum Dapat Diproses",
    };

    this.createNotification({
      user_id: complaint.user_id,
      complaint_id: complaint.id,
      title: statusTitles[params.newStatus] || "Status Pengaduan Diperbarui",
      message: `${complaint.ticket_number}: ${params.note}`,
    });

    return { success: true, complaint };
  }

  addResponse(params: {
    complaintId: string;
    author: User;
    content: string;
    is_internal: boolean;
  }): { success: boolean; response?: ComplaintResponse; error?: string } {
    const complaints = this.getComplaints();
    const complaint = complaints.find((c) => c.id === params.complaintId);
    if (!complaint) return { success: false, error: "Pengaduan tidak ditemukan." };

    // Mahasiswa HANYA boleh menanggapi laporannya sendiri dan TIDAK BISA membuat catatan internal
    if (params.author.role === "mahasiswa") {
      if (complaint.user_id !== params.author.id) {
        return { success: false, error: "Akses ditolak: Anda bukan pemilik laporan ini." };
      }
      params.is_internal = false; // Paksa publik
    }

    const response: ComplaintResponse = {
      id: `resp-${Date.now()}`,
      complaint_id: complaint.id,
      author_id: params.author.id,
      author_name: params.author.name,
      author_role: params.author.role,
      content: params.content,
      is_internal: params.is_internal,
      created_at: new Date().toISOString(),
    };

    complaint.responses = complaint.responses || [];
    complaint.responses.push(response);
    complaint.updated_at = new Date().toISOString();

    this.saveComplaints(complaints);

    // Jika tanggapan publik dibuat petugas/admin, notifikasi pelapor
    if (!params.is_internal && params.author.role !== "mahasiswa") {
      this.createNotification({
        user_id: complaint.user_id,
        complaint_id: complaint.id,
        title: "Tanggapan Baru dari Petugas",
        message: `${params.author.name}: ${params.content.slice(0, 100)}...`,
      });
    }

    return { success: true, response };
  }

  /**
   * Penilaian (Rating):
   * - HANYA boleh diberikan oleh pelapor
   * - HANYA untuk laporan berstatus 'selesai'
   * - Rating 1 s.d. 5
   * - Maksimal satu rating aktif per laporan
   */
  addRating(params: {
    complaintId: string;
    user: User;
    rating: number;
    feedback?: string;
  }): { success: boolean; rating?: ComplaintRating; error?: string } {
    const complaints = this.getComplaints();
    const complaint = complaints.find((c) => c.id === params.complaintId);
    if (!complaint) return { success: false, error: "Pengaduan tidak ditemukan." };

    if (complaint.user_id !== params.user.id) {
      return { success: false, error: "Hanya pelapor yang dapat memberikan penilaian." };
    }

    if (complaint.status !== "selesai") {
      return { success: false, error: "Penilaian hanya dapat diberikan untuk laporan yang telah selesai." };
    }

    if (complaint.rating) {
      return { success: false, error: "Laporan ini sudah memiliki penilaian aktif." };
    }

    if (params.rating < 1 || params.rating > 5) {
      return { success: false, error: "Nilai bintang harus antara 1 sampai 5." };
    }

    const rating: ComplaintRating = {
      id: `rate-${Date.now()}`,
      complaint_id: complaint.id,
      user_id: params.user.id,
      rating: params.rating,
      feedback: params.feedback,
      created_at: new Date().toISOString(),
    };

    complaint.rating = rating;
    complaint.updated_at = new Date().toISOString();
    this.saveComplaints(complaints);

    return { success: true, rating };
  }

  getNotifications(userId: string): NotificationItem[] {
    const storage = this.getStorage();
    if (!storage) return INITIAL_NOTIFICATIONS.filter((n) => n.user_id === userId);
    try {
      const data = storage.getItem(KEY_NOTIFICATIONS);
      const notifs: NotificationItem[] = data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
      return notifs.filter((n) => n.user_id === userId);
    } catch {
      return INITIAL_NOTIFICATIONS.filter((n) => n.user_id === userId);
    }
  }

  createNotification(data: Omit<NotificationItem, "id" | "created_at" | "is_read">): void {
    const storage = this.getStorage();
    const notifs: NotificationItem[] = storage
      ? JSON.parse(storage.getItem(KEY_NOTIFICATIONS) || JSON.stringify(INITIAL_NOTIFICATIONS))
      : INITIAL_NOTIFICATIONS;

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ...data,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    notifs.unshift(newNotif);
    if (storage) {
      storage.setItem(KEY_NOTIFICATIONS, JSON.stringify(notifs));
    }
  }

  markNotificationAsRead(id: string): void {
    const storage = this.getStorage();
    if (!storage) return;
    try {
      const notifs: NotificationItem[] = JSON.parse(
        storage.getItem(KEY_NOTIFICATIONS) || JSON.stringify(INITIAL_NOTIFICATIONS)
      );
      const target = notifs.find((n) => n.id === id);
      if (target) {
        target.is_read = true;
        storage.setItem(KEY_NOTIFICATIONS, JSON.stringify(notifs));
      }
    } catch {
      // ignore
    }
  }

  markAllNotificationsAsRead(userId: string): void {
    const storage = this.getStorage();
    if (!storage) return;
    try {
      const notifs: NotificationItem[] = JSON.parse(
        storage.getItem(KEY_NOTIFICATIONS) || JSON.stringify(INITIAL_NOTIFICATIONS)
      );
      notifs.forEach((n) => {
        if (n.user_id === userId) n.is_read = true;
      });
      storage.setItem(KEY_NOTIFICATIONS, JSON.stringify(notifs));
    } catch {
      // ignore
    }
  }

  resetToDefault(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(KEY_COMPLAINTS);
      storage.removeItem(KEY_CATEGORIES);
      storage.removeItem(KEY_NOTIFICATIONS);
      storage.removeItem(KEY_USERS);
    }
  }
}

export const db = new StorageService();
