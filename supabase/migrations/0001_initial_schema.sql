-- =============================================================================
-- Migration: 0001_initial_schema.sql
-- Aplikasi: LaporKampus
-- Versi: 1.0 (MVP)
-- Berdasarkan PRD.md dan design.md
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('mahasiswa', 'admin', 'petugas');
CREATE TYPE complaint_status AS ENUM (
  'dikirim',
  'menunggu_verifikasi',
  'menunggu_informasi',
  'diteruskan',
  'sedang_diproses',
  'selesai',
  'ditolak'
);
CREATE TYPE complaint_priority AS ENUM ('rendah', 'sedang', 'tinggi', 'darurat');

-- 2. TABEL: users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nim_nip TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'mahasiswa',
  department TEXT, -- Program Studi atau Unit Kerja
  phone_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABEL: categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'HelpCircle',
  is_sensitive BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABEL: complaints
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  incident_time TIMESTAMPTZ,
  status complaint_status NOT NULL DEFAULT 'dikirim',
  priority complaint_priority NOT NULL DEFAULT 'sedang',
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABEL: complaint_attachments
CREATE TABLE IF NOT EXISTS public.complaint_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TABEL: complaint_status_history
CREATE TABLE IF NOT EXISTS public.complaint_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  previous_status complaint_status,
  new_status complaint_status NOT NULL,
  actor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. TABEL: complaint_responses
CREATE TABLE IF NOT EXISTS public.complaint_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false, -- True: internal admin/petugas saja; False: terlihat pelapor
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. TABEL: complaint_assignments
CREATE TABLE IF NOT EXISTS public.complaint_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TABEL: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. TABEL: complaint_ratings
CREATE TABLE IF NOT EXISTS public.complaint_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL UNIQUE REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_category_id ON public.complaints(category_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON public.complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attachments_complaint_id ON public.complaint_attachments(complaint_id);
CREATE INDEX IF NOT EXISTS idx_status_history_complaint_id ON public.complaint_status_history(complaint_id);
CREATE INDEX IF NOT EXISTS idx_responses_complaint_id ON public.complaint_responses(complaint_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_to ON public.complaint_assignments(assigned_to);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_ratings ENABLE ROW LEVEL SECURITY;

-- Categories: siapa saja yang login dapat melihat kategori aktif
CREATE POLICY "Categories are readable by authenticated users"
  ON public.categories FOR SELECT
  TO authenticated
  USING (is_active = true OR auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- Complaints: Mahasiswa hanya melihat miliknya; Admin & Petugas melihat sesuai hak
CREATE POLICY "Mahasiswa can view own complaints"
  ON public.complaints FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'petugas'))
  );

CREATE POLICY "Mahasiswa can create complaints"
  ON public.complaints FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin and Petugas can update complaints"
  ON public.complaints FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'petugas')));

-- Complaint Responses: Mahasiswa tidak boleh melihat is_internal = true
CREATE POLICY "Public responses viewable by complaint owner, all by staff"
  ON public.complaint_responses FOR SELECT
  TO authenticated
  USING (
    (is_internal = false AND complaint_id IN (SELECT id FROM public.complaints WHERE user_id = auth.uid()))
    OR auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'petugas'))
  );

CREATE POLICY "Responses insertable by authorized users"
  ON public.complaint_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND (
      auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'petugas'))
      OR complaint_id IN (SELECT id FROM public.complaints WHERE user_id = auth.uid())
    )
  );

-- Notifications: hanya untuk user pemilik
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can mark own notifications as read"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Complaint Ratings: Hanya pelapor pada laporan selesai
CREATE POLICY "Owner can rate resolved complaint"
  ON public.complaint_ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND complaint_id IN (
      SELECT id FROM public.complaints 
      WHERE user_id = auth.uid() AND status = 'selesai'
    )
  );

CREATE POLICY "Ratings viewable by authenticated users"
  ON public.complaint_ratings FOR SELECT
  TO authenticated
  USING (true);

