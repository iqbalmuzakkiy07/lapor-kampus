"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StudentNavbar } from "@/components/layout/student-navbar";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/db";
import { Complaint } from "@/types/database";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Send,
  HelpCircle,
  Building,
  Wifi,
  Sparkles,
  Lock,
} from "lucide-react";

export default function StudentHomePage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      const all = db.getComplaints();
      const userComplaints = all.filter((c) => c.user_id === user.id);
      setComplaints(userComplaints);
    }
  }, [user]);

  const stats = {
    total: complaints.length,
    menunggu: complaints.filter(
      (c) =>
        c.status === "dikirim" ||
        c.status === "menunggu_verifikasi" ||
        c.status === "menunggu_informasi"
    ).length,
    proses: complaints.filter(
      (c) => c.status === "diteruskan" || c.status === "sedang_diproses"
    ).length,
    selesai: complaints.filter((c) => c.status === "selesai").length,
  };

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF5] pb-24 md:pb-12">
      <StudentNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B2B26] via-[#163832] to-[#235347] text-white p-6 sm:p-10 shadow-card">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-[#8EB69B]/20 text-[#DAF1DE] text-xs font-semibold backdrop-blur-sm border border-[#8EB69B]/30">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DAF1DE]" />
              Layanan Resmi Pengaduan Kampus
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Halo, {user ? user.name.split(" ")[0] : "Mahasiswa"}!
            </h1>
            <p className="text-sm sm:text-base text-[#DAF1DE]/90 leading-relaxed">
              Ada kendala sarana, fasilitas, internet, atau aspirasi yang ingin disampaikan?
              Sampaikan pengaduanmu secara transparan dan pantau penanganannya hingga tuntas.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/pengaduan/baru">
                <Button
                  size="lg"
                  className="bg-[#DAF1DE] text-[#051F20] hover:bg-white font-bold border-none shadow-md gap-2"
                >
                  <PlusCircle className="w-5 h-5 text-[#163832]" />
                  <span>Buat Pengaduan Sekarang</span>
                </Button>
              </Link>
              <Link href="/pengaduan">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#8EB69B] text-white hover:bg-[#163832]/60 gap-2"
                >
                  <FileText className="w-4 h-4 text-[#DAF1DE]" />
                  <span>Riwayat Pengaduan</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-[#8EB69B]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Status Summary Cards (Sesuai PRD & Design) */}
        <section aria-labelledby="status-summary-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="status-summary-heading" className="text-base sm:text-lg font-bold text-[#051F20]">
              Ringkasan Status Pengaduan Anda
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#8EB69B]/30 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-[#526B61]">Total Laporan</span>
                <div className="w-8 h-8 rounded-lg bg-[#DAF1DE] flex items-center justify-center text-[#163832]">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#051F20] mt-2">
                {mounted ? stats.total : 0}
              </div>
              <p className="text-[11px] text-[#526B61] mt-1">Laporan yang pernah Anda kirim</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#FFE59E] shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-[#8A6418]">Menunggu Verifikasi</span>
                <div className="w-8 h-8 rounded-lg bg-[#FFF8E6] flex items-center justify-center text-[#8A6418]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#8A6418] mt-2">
                {mounted ? stats.menunggu : 0}
              </div>
              <p className="text-[11px] text-[#8A6418]/80 mt-1">Sedang ditinjau oleh admin</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#8EB69B]/40 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-[#163832]">Sedang Diproses</span>
                <div className="w-8 h-8 rounded-lg bg-[#DAF1DE] flex items-center justify-center text-[#163832]">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#163832] mt-2">
                {mounted ? stats.proses : 0}
              </div>
              <p className="text-[11px] text-[#526B61] mt-1">Ditangani petugas/unit kerja</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#8EB69B]/30 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-[#235347]">Selesai Ditangani</span>
                <div className="w-8 h-8 rounded-lg bg-[#DAF1DE] flex items-center justify-center text-[#235347]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#235347] mt-2">
                {mounted ? stats.selesai : 0}
              </div>
              <p className="text-[11px] text-[#526B61] mt-1">Telah diselesaikan petugas</p>
            </div>
          </div>
        </section>

        {/* Grid Two Columns: Recent Complaints & Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Kolom Kiri: Laporan Terbaru */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#051F20]">
                Pengaduan Terbaru Anda
              </h2>
              <Link
                href="/pengaduan"
                className="text-xs sm:text-sm font-semibold text-[#163832] hover:text-[#235347] flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {complaints.length === 0 ? (
              <Card className="p-8 text-center bg-white border border-[#8EB69B]/30">
                <div className="w-12 h-12 rounded-full bg-[#DAF1DE] text-[#163832] flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base text-[#051F20]">
                  Belum ada pengaduan
                </h3>
                <p className="text-xs sm:text-sm text-[#526B61] max-w-sm mx-auto mt-1 mb-4">
                  Buat laporan pertama Anda untuk menyampaikan permasalahan fasilitas atau keluhan di lingkungan kampus.
                </p>
                <Link href="/pengaduan/baru">
                  <Button variant="primary" size="sm" className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    <span>Buat Pengaduan Pertama</span>
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentComplaints.map((item) => (
                  <Link
                    key={item.id}
                    href={`/pengaduan/${item.id}`}
                    className="block group"
                  >
                    <Card className="hover:border-[#163832] hover:shadow-md transition-all p-4 sm:p-5 bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#163832] bg-[#DAF1DE] px-2.5 py-0.5 rounded">
                            {item.ticket_number}
                          </span>
                          <span className="text-xs text-[#526B61]">
                            {item.category?.name || "Kategori"}
                          </span>
                          {item.is_anonymous && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              <Lock className="w-3 h-3" />
                              Anonim
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={item.priority} size="sm" />
                          <StatusBadge status={item.status} size="sm" />
                        </div>
                      </div>

                      <h3 className="text-sm sm:text-base font-semibold text-[#051F20] group-hover:text-[#163832] transition-colors line-clamp-1 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#526B61] line-clamp-2 mb-3">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-[#526B61]">
                        <span className="truncate max-w-[200px] sm:max-w-none">
                          📍 {item.location}
                        </span>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Kolom Kanan: Panduan Alur & Kategori Populer */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#051F20]">
              Alur Penanganan Laporan
            </h2>

            <Card className="p-5 bg-white space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#163832] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#051F20]">
                    Kirim Pengaduan & Bukti
                  </h4>
                  <p className="text-[11px] text-[#526B61] mt-0.5">
                    Pilih kategori, jelaskan lokasi kejadian, dan lampirkan foto bukti.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#163832] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#051F20]">
                    Verifikasi Admin
                  </h4>
                  <p className="text-[11px] text-[#526B61] mt-0.5">
                    Admin memeriksa keabsahan laporan dan meneruskan ke unit kerja terkait.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#163832] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#051F20]">
                    Tindakan Penanganan Petugas
                  </h4>
                  <p className="text-[11px] text-[#526B61] mt-0.5">
                    Petugas menangani masalah di lapangan dan memperbarui progres secara berkala.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#235347] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#051F20]">
                    Selesai & Berikan Penilaian
                  </h4>
                  <p className="text-[11px] text-[#526B61] mt-0.5">
                    Pelapor menerima notifikasi penyelesaian dan memberikan rating kepuasan layanan.
                  </p>
                </div>
              </div>
            </Card>

            {/* Banner Kategori Sensitif */}
            <Card className="p-4 bg-[#DAF1DE]/40 border border-[#8EB69B]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg text-[#163832] shadow-sm">
                  <Lock className="w-5 h-5 text-[#235347]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#051F20]">
                    Privasi & Laporan Sensitif
                  </h4>
                  <p className="text-[11px] text-[#526B61] mt-1 leading-normal">
                    Pengaduan kekerasan atau perundungan ditangani khusus dengan kerahasiaan identitas tinggi.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

