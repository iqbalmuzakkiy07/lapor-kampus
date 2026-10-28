"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/db";
import { Complaint, ComplaintPriority, ComplaintStatus, User } from "@/types/database";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  User as UserIcon,
  ShieldCheck,
  Lock,
  MessageSquare,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  ExternalLink,
  Forward,
  XCircle,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";

export default function AdminComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const complaintId = params.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [allStaff, setAllStaff] = useState<User[]>([]);

  // Cek kewenangan petugas:
  const isAssignedToCurrentOfficer =
    user?.role === "admin" ||
    (user?.role === "petugas" && complaint?.assignment?.assigned_to === user?.id);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  // Form inputs for modals
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<ComplaintPriority>("sedang");
  const [actionNote, setActionNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [resolveSummary, setResolveSummary] = useState("");

  // Handling notes state
  const [noteContent, setNoteContent] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  useEffect(() => {
    refreshData();
    const staffList = db.getUsers().filter((u) => u.role === "petugas" || u.role === "admin");
    setAllStaff(staffList);
    if (staffList.length > 0) {
      setSelectedStaffId(staffList[0].id);
    }
  }, [complaintId]);

  const refreshData = () => {
    const item = db.getComplaintById(complaintId);
    if (item) {
      setComplaint(item);
      setSelectedPriority(item.priority);
    }
  };

  // 1. TERUSKAN & TUGASKAN KE PETUGAS
  const handleForward = () => {
    if (!complaint || !user) return;
    db.updateComplaintStatus({
      complaintId: complaint.id,
      newStatus: "diteruskan",
      actor: user,
      note: actionNote.trim() || `Laporan diteruskan ke petugas penanganan.`,
      priority: selectedPriority,
      assignedTo: selectedStaffId,
    });
    setIsForwardModalOpen(false);
    setActionNote("");
    refreshData();
  };

  // 2. MINTA INFORMASI TAMBAHAN
  const handleRequestInfo = () => {
    if (!complaint || !user) return;
    if (!actionNote.trim()) {
      alert("Catatan permintaan informasi wajib diisi agar mahasiswa memahami apa yang perlu dilengkapi.");
      return;
    }
    db.updateComplaintStatus({
      complaintId: complaint.id,
      newStatus: "menunggu_informasi",
      actor: user,
      note: actionNote.trim(),
    });
    setIsRequestInfoModalOpen(false);
    setActionNote("");
    refreshData();
  };

  // 3. TOLAK LAPORAN
  const handleReject = () => {
    if (!complaint || !user) return;
    if (!rejectReason.trim()) {
      alert("Alasan penolakan pengaduan wajib diisi.");
      return;
    }
    db.updateComplaintStatus({
      complaintId: complaint.id,
      newStatus: "ditolak",
      actor: user,
      note: `Alasan penolakan: ${rejectReason.trim()}`,
    });
    setIsRejectModalOpen(false);
    setRejectReason("");
    refreshData();
  };

  // 4. SELESAIKAN LAPORAN
  const handleResolve = () => {
    if (!complaint || !user) return;
    if (!resolveSummary.trim()) {
      alert("Ringkasan tindakan penanganan wajib diisi sebelum menandai laporan selesai.");
      return;
    }
    db.updateComplaintStatus({
      complaintId: complaint.id,
      newStatus: "selesai",
      actor: user,
      note: `Telah diselesaikan: ${resolveSummary.trim()}`,
    });
    setIsResolveModalOpen(false);
    setResolveSummary("");
    refreshData();
  };

  // 5. UPDATE PROGRES SEDANG DIPROSES
  const handleSetInProgress = () => {
    if (!complaint || !user) return;
    db.updateComplaintStatus({
      complaintId: complaint.id,
      newStatus: "sedang_diproses",
      actor: user,
      note: "Petugas telah memulai penanganan langsung di lapangan.",
    });
    refreshData();
  };

  // 6. TAMBAH CATATAN PENANGANAN (INTERNAL / PUBLIK)
  const handleAddResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint || !user || !noteContent.trim()) return;

    setIsSubmittingNote(true);
    try {
      db.addResponse({
        complaintId: complaint.id,
        author: user,
        content: noteContent.trim(),
        is_internal: isInternalNote,
      });
      setNoteContent("");
      refreshData();
    } finally {
      setIsSubmittingNote(false);
    }
  };

  if (!complaint) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-[#526B61]">Pengaduan tidak ditemukan.</p>
        <Link href="/admin/pengaduan">
          <Button variant="primary">Kembali ke Daftar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Back button & Action Bar */}
      <div className="space-y-3">
        <Link
          href="/admin/pengaduan"
          className="inline-flex items-center gap-1.5 text-xs text-[#526B61] hover:text-[#163832] font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Pengaduan</span>
        </Link>

        {/* Header Ticket Banner */}
        <div className="bg-white p-5 rounded-2xl border border-[#8EB69B]/40 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#163832] bg-[#DAF1DE] px-2.5 py-0.5 rounded">
                {complaint.ticket_number}
              </span>
              <span className="text-xs text-[#526B61]">
                Kategori: <strong>{complaint.category?.name}</strong>
              </span>
              {complaint.is_anonymous && (
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Laporan Anonim
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#051F20]">
              {complaint.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Verification / Workflow Action Toolbar */}
        {user?.role === "petugas" && !isAssignedToCurrentOfficer ? (
          <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-300 text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Kewenangan Terbatas:</strong> Laporan ini{" "}
              {complaint.assignment?.assigned_to_name
                ? `ditugaskan kepada ${complaint.assignment.assigned_to_name}`
                : "belum dialokasikan ke Anda"}
              . Hanya petugas penanggung jawab atau admin yang dapat melakukan pembaruan status dan tindakan penanganan.
            </span>
          </div>
        ) : (
          <div className="bg-white p-3 rounded-xl border border-[#8EB69B]/40 shadow-sm flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#051F20] mr-2">
              Aksi Penanganan:
            </span>

            {/* Teruskan ke Petugas (Hanya Admin) */}
            {user?.role === "admin" &&
              complaint.status !== "selesai" &&
              complaint.status !== "ditolak" && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsForwardModalOpen(true)}
                  className="gap-1.5 text-xs h-9 bg-[#163832]"
                >
                  <Forward className="w-3.5 h-3.5" />
                  <span>Tugaskan / Teruskan</span>
                </Button>
              )}

            {/* Sedang Diproses */}
            {complaint.status === "diteruskan" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleSetInProgress}
                className="gap-1.5 text-xs h-9 border-[#163832]/30"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#163832]" />
                <span>Mulai Tangani (Diproses)</span>
              </Button>
            )}

            {/* Minta Info Tambahan */}
            {complaint.status !== "selesai" && complaint.status !== "ditolak" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsRequestInfoModalOpen(true)}
                className="gap-1.5 text-xs h-9 border-[#8A6418] text-[#8A6418] hover:bg-[#FFF8E6]"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Minta Info Pelapor</span>
              </Button>
            )}

            {/* Tandai Selesai */}
            {complaint.status !== "selesai" && complaint.status !== "ditolak" && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsResolveModalOpen(true)}
                className="gap-1.5 text-xs h-9 bg-[#235347] hover:bg-[#163832]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tandai Selesai</span>
              </Button>
            )}

            {/* Tolak Laporan (Hanya Admin) */}
            {user?.role === "admin" &&
              complaint.status !== "selesai" &&
              complaint.status !== "ditolak" && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setIsRejectModalOpen(true)}
                  className="gap-1.5 text-xs h-9 ml-auto"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Tolak Laporan</span>
                </Button>
              )}
          </div>
        )}
      </div>

      {/* Main Grid: Detail + Timeline & Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Rincian & Lampiran & Catatan Internal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rincian Masalah */}
          <Card className="bg-white border border-[#8EB69B]/30 shadow-card">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base font-bold text-[#051F20]">
                Rincian Laporan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#526B61] block mb-1">
                  Deskripsi Permasalahan:
                </span>
                <p className="text-sm text-[#051F20] bg-[#F4FAF5] p-3.5 rounded-lg border whitespace-pre-wrap leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[#526B61] block">Lokasi Kejadian:</span>
                  <span className="font-semibold text-[#051F20]">
                    📍 {complaint.location}
                  </span>
                </div>
                <div>
                  <span className="text-[#526B61] block">Waktu Kejadian:</span>
                  <span className="font-semibold text-[#051F20]">
                    {formatDate(complaint.incident_time || complaint.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-[#526B61] block">Identitas Pelapor:</span>
                  <span className="font-semibold text-[#051F20]">
                    {complaint.is_anonymous ? (
                      <span className="text-purple-700">🔒 Dirahasiakan (Anonim)</span>
                    ) : (
                      `${complaint.user_name} (${complaint.user_nim})`
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-[#526B61] block">Petugas Ditugaskan:</span>
                  <span className="font-semibold text-[#051F20]">
                    {complaint.assignment?.assigned_to_name || "Belum ditugaskan"}
                  </span>
                </div>
              </div>

              {/* Lampiran Bukti */}
              {complaint.attachments && complaint.attachments.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-xs font-semibold text-[#526B61] block mb-2">
                    Lampiran Foto Bukti Mahasiswa:
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {complaint.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="relative border rounded-xl overflow-hidden bg-gray-50 max-w-sm"
                      >
                        <img
                          src={att.file_url}
                          alt={att.file_name}
                          className="max-h-60 w-auto object-contain rounded-t-xl"
                        />
                        <div className="p-2 text-xs bg-white border-t flex items-center justify-between">
                          <span className="truncate max-w-[180px] font-medium text-gray-700">
                            {att.file_name}
                          </span>
                          <a
                            href={att.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#163832] font-semibold flex items-center gap-1"
                          >
                            <span>Perbesar</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form & List Komunikasi / Catatan Penanganan */}
          <Card className="bg-white border border-[#8EB69B]/30 shadow-card">
            <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-[#051F20] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#163832]" />
                <span>Catatan Penanganan & Komunikasi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* List responses */}
              <div className="space-y-3">
                {(complaint.responses || []).length === 0 ? (
                  <div className="text-center py-4 text-xs text-[#526B61]">
                    Belum ada catatan atau tanggapan untuk laporan ini.
                  </div>
                ) : (
                  (complaint.responses || []).map((resp) => (
                    <div
                      key={resp.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1 ${resp.is_internal
                          ? "bg-amber-50/70 border-amber-300"
                          : resp.author_role === "mahasiswa"
                            ? "bg-white border-gray-200"
                            : "bg-[#DAF1DE]/40 border-[#8EB69B]"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#051F20]">
                            {resp.author_name}
                          </span>
                          {resp.is_internal ? (
                            <span className="bg-amber-700 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded">
                              🔒 Catatan Internal (Hanya Staf)
                            </span>
                          ) : (
                            <span className="bg-[#163832] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                              Publik (Terbaca Mahasiswa)
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#526B61]">
                          {formatDate(resp.created_at)}
                        </span>
                      </div>
                      <p className="text-[#051F20] whitespace-pre-wrap leading-relaxed">
                        {resp.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Form Input Catatan Baru */}
              {user?.role === "petugas" && !isAssignedToCurrentOfficer ? (
                <div className="pt-3 border-t border-gray-100 text-xs text-[#526B61] italic text-center py-2 bg-gray-50 rounded-lg">
                  Anda tidak ditugaskan untuk laporan ini (hanya dapat membaca riwayat penanganan).
                </div>
              ) : (
                <form onSubmit={handleAddResponse} className="pt-3 border-t border-gray-100 space-y-3">
                  <Textarea
                    placeholder="Ketik catatan penanganan lapangan atau tanggapan untuk mahasiswa..."
                    rows={3}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        id="internal-check"
                        type="checkbox"
                        checked={isInternalNote}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-700 focus:ring-amber-600 border-gray-300"
                      />
                      <label
                        htmlFor="internal-check"
                        className="text-xs text-[#051F20] cursor-pointer"
                      >
                        <strong>Catatan Internal Saja</strong> (Tidak dapat dilihat oleh mahasiswa)
                      </label>
                    </div>

                    <Button
                      type="submit"
                      size="sm"
                      variant="primary"
                      disabled={!noteContent.trim() || isSubmittingNote}
                      className="gap-1.5 text-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Catatan</span>
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Timeline Riwayat & Penilaian Mahasiswa */}
        <div className="space-y-6">
          {/* Riwayat Timeline Status */}
          <Card className="bg-white border border-[#8EB69B]/30 shadow-card">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base font-bold text-[#051F20] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#163832]" />
                <span>Riwayat Perubahan Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#8EB69B]/40">
                {(complaint.status_history || []).map((step, idx) => (
                  <div key={step.id || idx} className="relative">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#163832] border-2 border-white ring-2 ring-[#DAF1DE]" />
                    <div className="space-y-1">
                      <StatusBadge status={step.new_status} size="sm" />
                      <p className="text-xs text-[#051F20] font-medium leading-relaxed mt-1">
                        {step.note}
                      </p>
                      <div className="text-[10px] text-[#526B61] flex items-center justify-between pt-0.5">
                        <span>{step.actor_name || "Sistem"}</span>
                        <span>{formatDate(step.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Penilaian / Rating dari Mahasiswa jika ada */}
          {complaint.rating && (
            <Card className="bg-white border border-emerald-300 shadow-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Penilaian Pelapor:
                </span>
                <span className="text-xs font-bold text-emerald-900">
                  {complaint.rating.rating} / 5
                </span>
              </div>
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= complaint.rating!.rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              {complaint.rating.feedback && (
                <p className="text-xs text-emerald-950 italic">
                  &ldquo;{complaint.rating.feedback}&rdquo;
                </p>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* MODAL 1: TERUSKAN KE PETUGAS */}
      <Modal
        isOpen={isForwardModalOpen}
        onClose={() => setIsForwardModalOpen(false)}
        title="Tugaskan & Teruskan Laporan"
        description="Pilih petugas atau unit teknis penanggung jawab untuk menangani masalah ini."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsForwardModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleForward}
              className="gap-1.5"
            >
              <Forward className="w-4 h-4" />
              <span>Simpan Penugasan</span>
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Select
            label="Pilih Petugas / Unit Kerja"
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            requiredMarker
          >
            {allStaff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.department})
              </option>
            ))}
          </Select>

          <Select
            label="Tetapkan Tingkat Prioritas"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as ComplaintPriority)}
          >
            <option value="rendah">Rendah</option>
            <option value="sedang">Sedang</option>
            <option value="tinggi">Tinggi</option>
            <option value="darurat">Darurat</option>
          </Select>

          <Textarea
            label="Catatan Arahan Verifikator (Opsional)"
            placeholder="Instruksi awal untuk petugas lapangan..."
            value={actionNote}
            onChange={(e) => setActionNote(e.target.value)}
          />
        </div>
      </Modal>

      {/* MODAL 2: MINTA INFORMASI TAMBAHAN */}
      <Modal
        isOpen={isRequestInfoModalOpen}
        onClose={() => setIsRequestInfoModalOpen(false)}
        title="Minta Informasi Tambahan dari Pelapor"
        description="Jelaskan secara spesifik apa yang kurang agar mahasiswa dapat melengkapinya."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRequestInfoModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRequestInfo}
              className="gap-1.5 bg-[#8A6418] hover:bg-[#6D4F12]"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Permintaan</span>
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Textarea
            label="Keterangan yang Diperlukan"
            placeholder="Contoh: Mohon sebutkan nomor bangku/kursi atau foto letak stop kontak yang bermasalah..."
            rows={4}
            value={actionNote}
            onChange={(e) => setActionNote(e.target.value)}
            requiredMarker
          />
        </div>
      </Modal>

      {/* MODAL 3: TOLAK LAPORAN (WAJIB ALASAN) */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Tolak Pengaduan"
        description="Laporan yang ditolak tidak akan diteruskan ke unit lapangan. Alasan penolakan wajib dicantumkan."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleReject}
              className="gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Konfirmasi Tolak</span>
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Textarea
            label="Alasan Penolakan (Wajib Diisi)"
            placeholder="Jelaskan alasan kenapa pengaduan tidak dapat diproses (misal: duplikat, tidak relevan, informasi tidak valid)..."
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            requiredMarker
          />
        </div>
      </Modal>

      {/* MODAL 4: TANDAI SELESAI (WAJIB RINGKASAN TINDAKAN) */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title="Tandai Pengaduan Selesai"
        description="Wajibkan ringkasan hasil tindakan penanganan sebelum menutup laporan."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsResolveModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleResolve}
              className="gap-1.5 bg-[#235347] hover:bg-[#163832]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Selesaikan Laporan</span>
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Textarea
            label="Ringkasan Hasil Penanganan (Wajib Diisi)"
            placeholder="Contoh: Unit AC telah diperbaiki pipa drainasenya dan freon diisi ulang. Ruang 304 sudah dingin dan tidak bocor lagi..."
            rows={4}
            value={resolveSummary}
            onChange={(e) => setResolveSummary(e.target.value)}
            requiredMarker
          />
        </div>
      </Modal>
    </div>
  );
}

