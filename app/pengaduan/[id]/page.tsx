"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { StudentNavbar } from "@/components/layout/student-navbar";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/db";
import { Complaint, ComplaintResponse } from "@/types/database";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  Lock,
  MessageSquare,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  ExternalLink,
} from "lucide-react";

export default function DetailPengaduanPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const complaintId = params.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [mounted, setMounted] = useState(false);

  // Response form (pelapor tanggapi permintaan informasi)
  const [responseText, setResponseText] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  // Rating form (untuk laporan selesai)
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    refreshData();
  }, [complaintId, user]);

  const refreshData = () => {
    if (!user) {
      setComplaint(null);
      return;
    }

    const item = db.getComplaintById(complaintId, user);
    if (!item) {
      setComplaint(null);
      return;
    }

    // RBAC check: Jika peran mahasiswa dan bukan pemilik pengaduan
    if (user.role === "mahasiswa" && item.user_id !== user.id) {
      setComplaint(null);
      return;
    }

    setComplaint(item);
    if (item.rating) {
      setRatingValue(item.rating.rating);
      setRatingFeedback(item.rating.feedback || "");
    }
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim() || !user || !complaint) return;

    setIsSubmittingResponse(true);
    try {
      db.addResponse({
        complaintId: complaint.id,
        author: user,
        content: responseText.trim(),
        is_internal: false, // Pelapor selalu mengirim respons publik
      });

      // Update status dari 'menunggu_informasi' kembali ke 'sedang_diproses' bila perlu
      if (complaint.status === "menunggu_informasi") {
        db.updateComplaintStatus({
          complaintId: complaint.id,
          newStatus: "sedang_diproses",
          actor: user,
          note: "Pelapor telah melengkapi informasi yang diminta.",
        });
      }

      setResponseText("");
      refreshData();
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !complaint) return;

    setIsSubmittingRating(true);
    try {
      db.addRating({
        complaintId: complaint.id,
        user,
        rating: ratingValue,
        feedback: ratingFeedback.trim() || undefined,
      });
      setRatingSuccess(true);
      refreshData();
    } finally {
      setIsSubmittingRating(false);
    }
  };

  if (!mounted) return null;

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4FAF5]">
        <StudentNavbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#B42318] mx-auto" />
          <h2 className="text-xl font-bold text-[#051F20]">
            Pengaduan Tidak Ditemukan atau Akses Dibatasi
          </h2>
          <p className="text-xs sm:text-sm text-[#526B61]">
            Nomor laporan tidak terdaftar atau Anda tidak memiliki hak akses resmi untuk membuka pengaduan civitas lain.
          </p>
          <Link href="/pengaduan">
            <Button variant="primary">Kembali ke Daftar Pengaduan</Button>
          </Link>
        </main>
      </div>
    );
  }

  // Filter tanggapan: mahasiswa hanya melihat yang is_internal === false
  const visibleResponses = (complaint.responses || []).filter(
    (r) => !r.is_internal || (user && user.role !== "mahasiswa")
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF5] pb-24 md:pb-12">
      <StudentNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Back Link & Header */}
        <div className="space-y-3">
          <Link
            href="/pengaduan"
            className="inline-flex items-center gap-1.5 text-xs text-[#526B61] hover:text-[#163832] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Riwayat Pengaduan</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#8EB69B]/40 shadow-card">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-mono text-xs font-bold text-[#163832] bg-[#DAF1DE] px-2.5 py-0.5 rounded">
                  {complaint.ticket_number}
                </span>
                <span className="text-xs font-medium text-[#526B61]">
                  Kategori: {complaint.category?.name}
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

            <div className="flex items-center gap-2 self-start sm:self-center">
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
          </div>
        </div>

        {/* Action Banner jika butuh info tambahan */}
        {complaint.status === "menunggu_informasi" && (
          <div className="bg-[#FFF8E6] border border-[#FFE59E] rounded-xl p-4 text-[#8A6418] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-[#8A6418] mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm">
                Petugas Membutuhkan Informasi Tambahan
              </h3>
              <p className="text-xs leading-normal">
                Harap periksa catatan verifikasi atau tanggapan petugas di bawah, lalu kirimkan keterangan pelengkap agar laporan dapat segera diproses lebih lanjut.
              </p>
            </div>
          </div>
        )}

        {/* Content Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri (2 Span): Detail & Tanggapan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rincian Permasalahan */}
            <Card className="bg-white border border-[#8EB69B]/30 shadow-card">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base font-bold text-[#051F20]">
                  Rincian Pengaduan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-[#526B61] mb-1">
                    Deskripsi Masalah:
                  </h4>
                  <p className="text-sm text-[#051F20] whitespace-pre-wrap leading-relaxed bg-[#F4FAF5] p-3.5 rounded-lg border border-gray-100">
                    {complaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#163832] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#526B61] block">Lokasi Kejadian:</span>
                      <span className="font-semibold text-[#051F20]">
                        {complaint.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-[#163832] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#526B61] block">Waktu Pengiriman:</span>
                      <span className="font-semibold text-[#051F20]">
                        {formatDate(complaint.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bukti Foto */}
                {complaint.attachments && complaint.attachments.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <h4 className="text-xs font-semibold text-[#526B61] mb-2">
                      Lampiran Foto Bukti:
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {complaint.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="relative border border-[#8EB69B]/50 rounded-xl overflow-hidden bg-gray-50 max-w-sm"
                        >
                          <img
                            src={att.file_url}
                            alt={att.file_name}
                            className="max-h-60 w-auto object-contain rounded-t-xl"
                          />
                          <div className="p-2.5 text-xs text-[#051F20] bg-white flex items-center justify-between border-t">
                            <span className="truncate max-w-[200px] font-medium">
                              {att.file_name}
                            </span>
                            <a
                              href={att.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#163832] hover:text-[#235347] font-semibold flex items-center gap-1"
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

            {/* Tanggapan Petugas & Komunikasi */}
            <Card className="bg-white border border-[#8EB69B]/30 shadow-card">
              <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold text-[#051F20] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#163832]" />
                  <span>Tanggapan & Komunikasi Penanganan</span>
                </CardTitle>
                <span className="text-xs text-[#526B61]">
                  {visibleResponses.length} Tanggapan
                </span>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {visibleResponses.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#526B61]">
                    Belum ada tanggapan resmi dari petugas untuk laporan ini.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visibleResponses.map((resp) => {
                      const isStaff = resp.author_role !== "mahasiswa";
                      return (
                        <div
                          key={resp.id}
                          className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                            isStaff
                              ? "bg-[#DAF1DE]/40 border-[#8EB69B]/60"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#051F20]">
                                {resp.author_name}
                              </span>
                              {isStaff && (
                                <span className="bg-[#163832] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                                  Petugas
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#526B61]">
                              {formatDate(resp.created_at)}
                            </span>
                          </div>
                          <p className="text-[#051F20] leading-relaxed whitespace-pre-wrap">
                            {resp.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Form Kirim Tanggapan / Pelengkap Info */}
                <form onSubmit={handleSubmitResponse} className="pt-3 border-t border-gray-100 space-y-3">
                  <Textarea
                    placeholder="Tuliskan keterangan tambahan atau tanggapan Anda di sini..."
                    rows={3}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    helperText="Tanggapan Anda akan langsung terbaca oleh petugas yang menangani laporan."
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={isSubmittingResponse}
                      disabled={!responseText.trim()}
                      className="gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Tanggapan</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* FORM PENILAIAN / RATING (Bila status Selesai) */}
            {complaint.status === "selesai" && (
              <Card className="bg-white border border-[#235347] shadow-card">
                <CardHeader className="pb-2 bg-[#DAF1DE]/40 rounded-t-xl border-b border-[#8EB69B]/30">
                  <CardTitle className="text-base font-bold text-[#163832] flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Penilaian Penanganan Pengaduan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {complaint.rating ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= complaint.rating!.rating
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-emerald-900">
                          ({complaint.rating.rating} dari 5 Bintang)
                        </span>
                      </div>
                      {complaint.rating.feedback && (
                        <p className="text-xs text-emerald-900 italic">
                          &ldquo;{complaint.rating.feedback}&rdquo;
                        </p>
                      )}
                      <p className="text-[10px] text-emerald-700">
                        Penilaian disimpan pada {formatDate(complaint.rating.created_at)}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitRating} className="space-y-4">
                      <p className="text-xs text-[#526B61]">
                        Penanganan pengaduan ini telah selesai. Berikan penilaian Anda untuk membantu meningkatkan kualitas layanan kampus.
                      </p>

                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-[#051F20]">
                          Tingkat Kepuasan (1 s.d. 5 Bintang):
                        </label>
                        <div className="flex items-center gap-2 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingValue(star)}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-7 h-7 ${
                                  star <= ratingValue
                                    ? "fill-amber-500 text-amber-500"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-[#163832] ml-2">
                            {ratingValue === 5 && "Sangat Memuaskan"}
                            {ratingValue === 4 && "Memuaskan"}
                            {ratingValue === 3 && "Cukup"}
                            {ratingValue === 2 && "Kurang Memuaskan"}
                            {ratingValue === 1 && "Tidak Memuaskan"}
                          </span>
                        </div>
                      </div>

                      <Textarea
                        label="Ulasan / Masukan Tambahan (Opsional)"
                        placeholder="Berikan saran atau tanggapan terkait kecepatan dan hasil perbaikan..."
                        rows={2}
                        value={ratingFeedback}
                        onChange={(e) => setRatingFeedback(e.target.value)}
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmittingRating}
                        className="w-full bg-[#235347] hover:bg-[#163832]"
                      >
                        Simpan Penilaian
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Kolom Kanan (1 Span): Timeline Perkembangan Status */}
          <div className="space-y-6">
            <Card className="bg-white border border-[#8EB69B]/30 shadow-card">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base font-bold text-[#051F20] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#163832]" />
                  <span>Timeline Perkembangan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#8EB69B]/40">
                  {(complaint.status_history || []).map((step, idx) => (
                    <div key={step.id || idx} className="relative group">
                      {/* Dot icon */}
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#163832] border-2 border-white ring-2 ring-[#DAF1DE] flex items-center justify-center" />

                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <StatusBadge status={step.new_status} size="sm" />
                        </div>
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

            {/* Penanggung Jawab Petugas */}
            {complaint.assignment && (
              <Card className="bg-white border border-[#8EB69B]/30 shadow-card p-4">
                <h4 className="text-xs font-semibold text-[#526B61] mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#163832]" />
                  <span>Petugas Ditugaskan</span>
                </h4>
                <div className="text-xs font-bold text-[#051F20]">
                  {complaint.assignment.assigned_to_name}
                </div>
                <div className="text-[11px] text-[#526B61] mt-0.5">
                  Ditugaskan sejak: {formatDate(complaint.assignment.created_at)}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

