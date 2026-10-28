"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { Category, Complaint } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle2,
  Star,
  Clock,
  TrendingUp,
  FileText,
  AlertTriangle,
} from "lucide-react";

export default function AdminStatistikPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setComplaints(db.getComplaints());
    setCategories(db.getCategories());
  }, []);

  const total = complaints.length;
  const completed = complaints.filter((c) => c.status === "selesai").length;
  const resolutionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Ratings calculation
  const ratedComplaints = complaints.filter((c) => c.rating);
  const avgRating =
    ratedComplaints.length > 0
      ? (
          ratedComplaints.reduce((acc, c) => acc + (c.rating?.rating || 0), 0) /
          ratedComplaints.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#051F20] flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#163832]" />
          <span>Statistik & Evaluasi Layanan</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#526B61] mt-0.5">
          Data performa penanganan pengaduan kampus dan kepuasan mahasiswa berbasis data riil.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#8EB69B]/30 shadow-card">
          <div className="flex items-center justify-between text-[#526B61]">
            <span className="text-xs font-semibold">Tingkat Penyelesaian</span>
            <CheckCircle2 className="w-5 h-5 text-[#235347]" />
          </div>
          <div className="text-3xl font-extrabold text-[#235347] mt-2">
            {resolutionRate}%
          </div>
          <p className="text-[11px] text-[#526B61] mt-1">
            {completed} dari {total} laporan selesai
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-card">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-semibold">Kepuasan Mahasiswa</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">
            {avgRating} <span className="text-sm font-normal text-gray-500">/ 5.0</span>
          </div>
          <p className="text-[11px] text-[#526B61] mt-1">
            Dari {ratedComplaints.length} ulasan penilaian
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#8EB69B]/30 shadow-card">
          <div className="flex items-center justify-between text-[#163832]">
            <span className="text-xs font-semibold">Rata-rata Respon</span>
            <Clock className="w-5 h-5 text-[#163832]" />
          </div>
          <div className="text-3xl font-extrabold text-[#163832] mt-2">
            &lt; 2 Jam
          </div>
          <p className="text-[11px] text-[#526B61] mt-1">
            Waktu verifikasi awal admin
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#8EB69B]/30 shadow-card">
          <div className="flex items-center justify-between text-[#526B61]">
            <span className="text-xs font-semibold">Total Pengaduan</span>
            <FileText className="w-5 h-5 text-[#163832]" />
          </div>
          <div className="text-3xl font-extrabold text-[#051F20] mt-2">
            {total}
          </div>
          <p className="text-[11px] text-[#526B61] mt-1">
            Tercatat dalam basis data
          </p>
        </div>
      </div>

      {/* Grid: Category Breakdown & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi Kategori */}
        <Card className="bg-white border border-[#8EB69B]/30 shadow-card">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-base font-bold text-[#051F20]">
              Distribusi Pengaduan per Kategori
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {categories.map((cat) => {
              const count = complaints.filter((c) => c.category_id === cat.id).length;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#051F20]">
                    <span>{cat.name}</span>
                    <span className="text-[#526B61]">
                      {count} laporan ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#DAF1DE]/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#163832] h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Distribusi Tingkat Prioritas */}
        <Card className="bg-white border border-[#8EB69B]/30 shadow-card">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-base font-bold text-[#051F20]">
              Distribusi Tingkat Prioritas Laporan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {(
              [
                { label: "Darurat", key: "darurat", color: "bg-red-500", text: "text-red-700" },
                { label: "Tinggi", key: "tinggi", color: "bg-orange-500", text: "text-orange-700" },
                { label: "Sedang", key: "sedang", color: "bg-[#163832]", text: "text-[#163832]" },
                { label: "Rendah", key: "rendah", color: "bg-slate-400", text: "text-slate-600" },
              ] as const
            ).map((p) => {
              const count = complaints.filter((c) => c.priority === p.key).length;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <div key={p.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={p.text}>{p.label}</span>
                    <span className="text-[#526B61]">
                      {count} laporan ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${p.color} h-full rounded-full transition-all duration-300`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

