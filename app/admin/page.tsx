"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/db";
import { Complaint } from "@/types/database";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  CheckSquare,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    setComplaints(db.getComplaints());
  }, []);

  const stats = {
    total: complaints.length,
    menunggu: complaints.filter(
      (c) => c.status === "dikirim" || c.status === "menunggu_verifikasi"
    ).length,
    menungguInfo: complaints.filter((c) => c.status === "menunggu_informasi").length,
    proses: complaints.filter(
      (c) => c.status === "diteruskan" || c.status === "sedang_diproses"
    ).length,
    selesai: complaints.filter((c) => c.status === "selesai").length,
    ditolak: complaints.filter((c) => c.status === "ditolak").length,
  };

  const pendingVerification = complaints.filter(
    (c) => c.status === "dikirim" || c.status === "menunggu_verifikasi"
  );

  const recentList = complaints.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#051F20]">
            Dashboard Manajemen Pengaduan
          </h1>
          <p className="text-xs sm:text-sm text-[#526B61]">
            Selamat datang, <strong>{user?.name}</strong> ({user?.department})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/pengaduan">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Kelola Seluruh Laporan</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Real Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#8EB69B]/30 shadow-card">
          <div className="flex items-center justify-between text-[#526B61]">
            <span className="text-xs font-medium">Total Masuk</span>
            <FileText className="w-4 h-4 text-[#163832]" />
          </div>
          <div className="text-2xl font-bold text-[#051F20] mt-2">
            {stats.total}
          </div>
          <p className="text-[10px] text-[#526B61] mt-1">Laporan dari mahasiswa</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#FFE59E] shadow-card">
          <div className="flex items-center justify-between text-[#8A6418]">
            <span className="text-xs font-semibold">Menunggu Verifikasi</span>
            <Clock className="w-4 h-4 text-[#8A6418]" />
          </div>
          <div className="text-2xl font-bold text-[#8A6418] mt-2">
            {stats.menunggu}
          </div>
          <p className="text-[10px] text-[#8A6418]/80 mt-1">Perlu tindakan verifikator</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#8EB69B]/40 shadow-card">
          <div className="flex items-center justify-between text-[#163832]">
            <span className="text-xs font-semibold">Sedang Diproses</span>
            <AlertTriangle className="w-4 h-4 text-[#163832]" />
          </div>
          <div className="text-2xl font-bold text-[#163832] mt-2">
            {stats.proses}
          </div>
          <p className="text-[10px] text-[#526B61] mt-1">Penanganan di unit kerja</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#8EB69B]/30 shadow-card">
          <div className="flex items-center justify-between text-[#235347]">
            <span className="text-xs font-semibold">Selesai Ditangani</span>
            <CheckCircle2 className="w-4 h-4 text-[#235347]" />
          </div>
          <div className="text-2xl font-bold text-[#235347] mt-2">
            {stats.selesai}
          </div>
          <p className="text-[10px] text-[#526B61] mt-1">Tuntas diperbaiki</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-card col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#B42318]">
            <span className="text-xs font-semibold">Ditolak</span>
            <XCircle className="w-4 h-4 text-[#B42318]" />
          </div>
          <div className="text-2xl font-bold text-[#B42318] mt-2">
            {stats.ditolak}
          </div>
          <p className="text-[10px] text-[#B42318]/80 mt-1">Tidak memenuhi syarat</p>
        </div>
      </div>

      {/* Grid: Pending Action + Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri (2 Span): Daftar Menunggu Verifikasi */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#051F20] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8A6418]" />
              <span>Perlu Verifikasi Segera ({pendingVerification.length})</span>
            </h2>
            <Link
              href="/admin/pengaduan?status=menunggu_verifikasi"
              className="text-xs font-semibold text-[#163832] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {pendingVerification.length === 0 ? (
            <Card className="p-6 text-center bg-white border border-[#8EB69B]/30">
              <CheckCircle2 className="w-8 h-8 text-[#235347] mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-[#051F20]">
                Seluruh pengaduan telah diverifikasi!
              </p>
              <p className="text-xs text-[#526B61] mt-0.5">
                Tidak ada antrean laporan baru yang menunggu verifikasi saat ini.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingVerification.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border border-[#FFE59E] hover:border-[#8A6418] shadow-card transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#163832] bg-[#DAF1DE] px-2 py-0.5 rounded">
                        {item.ticket_number}
                      </span>
                      <span className="text-xs text-[#526B61]">
                        {item.category?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={item.priority} size="sm" />
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#051F20]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#526B61] line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-[#526B61] pt-2 border-t border-gray-100">
                    <span>
                      Pelapor: {item.is_anonymous ? "🔒 Anonim" : item.user_name}
                    </span>
                    <Link href={`/admin/pengaduan/${item.id}`}>
                      <Button size="sm" variant="primary" className="h-8 text-xs gap-1">
                        <span>Verifikasi & Tindak Lanjut</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Panduan Tindakan Petugas */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#051F20]">
            Prosedur Standar Verifikasi
          </h2>

          <Card className="p-4 bg-white border border-[#8EB69B]/30 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#163832] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-[#051F20] block">Periksa Keabsahan:</strong>
                <span className="text-[#526B61]">Pastikan lokasi jelas dan bukti foto relevan.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#163832] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-[#051F20] block">Tentukan Penugasan:</strong>
                <span className="text-[#526B61]">Teruskan ke unit Sarpras atau IT sesuai bidang masalah.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#163832] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-[#051F20] block">Penolakan Wajib Beralasan:</strong>
                <span className="text-[#526B61]">Jika laporan tidak layak, sertakan alasan yang konstruktif bagi mahasiswa.</span>
              </div>
            </div>
          </Card>

          {/* Akses Cepat Tugas Petugas */}
          <Card className="p-4 bg-[#DAF1DE]/40 border border-[#8EB69B] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#163832]">
              <CheckSquare className="w-4 h-4 text-[#235347]" />
              <span>Portal Khusus Petugas Lapangan</span>
            </div>
            <p className="text-[11px] text-[#526B61] leading-relaxed">
              Petugas dapat melihat laporan yang ditugaskan secara spesifik dan mencatat tindakan lapangan.
            </p>
            <Link href="/admin/tugas" className="block pt-1">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Buka Menu Tugas Saya
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

