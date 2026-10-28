export type UserRole = 'mahasiswa' | 'admin' | 'petugas';

export type ComplaintStatus =
  | 'dikirim'
  | 'menunggu_verifikasi'
  | 'menunggu_informasi'
  | 'diteruskan'
  | 'sedang_diproses'
  | 'selesai'
  | 'ditolak';

export type ComplaintPriority = 'rendah' | 'sedang' | 'tinggi' | 'darurat';

export interface User {
  id: string;
  email: string;
  name: string;
  nim_nip: string;
  role: UserRole;
  department: string;
  phone_number?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  is_sensitive: boolean;
  is_active: boolean;
  created_at: string;
}

export interface ComplaintAttachment {
  id: string;
  complaint_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface ComplaintStatusHistory {
  id: string;
  complaint_id: string;
  previous_status: ComplaintStatus | null;
  new_status: ComplaintStatus;
  actor_id: string;
  actor_name?: string;
  actor_role?: UserRole;
  note: string;
  created_at: string;
}

export interface ComplaintResponse {
  id: string;
  complaint_id: string;
  author_id: string;
  author_name?: string;
  author_role?: UserRole;
  content: string;
  is_internal: boolean;
  created_at: string;
}

export interface ComplaintAssignment {
  id: string;
  complaint_id: string;
  assigned_to: string;
  assigned_to_name?: string;
  assigned_by: string;
  notes?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  complaint_id?: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ComplaintRating {
  id: string;
  complaint_id: string;
  user_id: string;
  rating: number; // 1-5
  feedback?: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  ticket_number: string;
  user_id: string;
  user_name?: string;
  user_nim?: string;
  category_id: string;
  category?: Category;
  title: string;
  description: string;
  location: string;
  incident_time?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  attachments?: ComplaintAttachment[];
  status_history?: ComplaintStatusHistory[];
  responses?: ComplaintResponse[];
  assignment?: ComplaintAssignment;
  rating?: ComplaintRating;
}

