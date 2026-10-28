"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/db";
import { Complaint } from "@/types/database";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Eye,
  ArrowUpRight,
} from "lucide-react";

export default function PetugasTugasPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (user) {
      const all = db.getComplaints();
      // Assigned to current user or if admin, all assignments
      const myTasks = all.filter(
        (c) =>
          c.assignment?.assigned_to === user.id ||
          (user.role === "admin" && c.assignment)
      );
      setComplaints(myTasks);
    }
  }, [user]);

  const stats = {
    total: complaints.length,
    belumProses: complaints.filter((c) => c.status === "diteruskan").length,
    proses: complaints.filter((c) => c.status === "sedang_diproses").length,
    selesai: complaints.filter((c) => c.status === "selesai").length,
  };

  const filtered = complaints.filter((c) => {
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#051F20] flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-[#163832]" />
          <span>Daftar Tugas Penanganan Saya</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#526B61] mt-0.5">
          Pengaduan yang secara resmi ditugaskan kepada Anda (<strong>{user?.name}</strong> • {user?.department}).
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#FFE59E] shadow-card">
          <div className="flex items-center justify-between text-[#8A6418]">
            <span className="text-xs font-semibold">Perlu Tindakan Awal</span>
            <Clock className="w-4 h-4 text-[#8A6418]" />
          </div>
          <div className="text-2xl font-bold text-[#8A6418] mt-2">
            {stats.belumProses}
          </div>
          <p className="text-[10px] text-[#8A6418]/80 mt-1">Status Diteruskan</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#8EB69B]/40 shadow-card">
          <div className="flex items-center justify-between text-[#163832]">
            <span className="text-xs font-semibold">Sedang Dikerjakan</span>
            <AlertTriangle className="w-4 h-4 text-[#163832]" />
          </div>
          <div className="text-2xl font-bold text-[#163832] mt-2">
            {stats.proses}
          </div>
          <p className="text-[10px] text-[#526B61] mt-1">Penanganan lapangan</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#8EB69B]/30 shadow-card">
          <div className="flex items-center justify-between text-[#235347]">
            <span className="text-xs font-semibold">Tugas Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-[#235347]" />
          </div>
          <div className="text-2xl font-bold text-[#235347] mt-2">
            {stats.selesai}
          </div>
          <p className="text-[10px] text-[#526B61] mt-1">Berhasil dituntaskan</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            statusFilter === "all"
              ? "bg-[#163832] text-white"
              : "text-[#526B61] hover:bg-gray-100"
          }`}
        >
          Semua Tugas ({complaints.length})
        </button>
        <button
          onClick={() => setStatusFilter("diteruskan")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            statusFilter === "diteruskan"
              ? "bg-[#163832] text-white"
              : "text-[#526B61] hover:bg-gray-100"
          }`}
        >
          Menunggu Dikerjakan ({stats.belumProses})
        </button>
        <button
          onClick={() => setStatusFilter("sedang_diproses")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            statusFilter === "sedang_diproses"
              ? "bg-[#163832] text-white"
              : "text-[#526B61] hover:bg-gray-100"
          }`}
        >
          Sedang Dikerjakan ({stats.proses})
        </button>
        <button
          onClick={() => setStatusFilter("selesai")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            statusFilter === "selesai"
              ? "bg-[#163832] text-white"
              : "text-[#526B61] hover:bg-gray-100"
          }`}
        >
          Selesai ({stats.selesai})
        </button>
      </div>

      {/* Tasks List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Tidak ada tugas ditemukan"
          description="Saat ini belum ada tugas baru yang dialokasikan ke akun Anda."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="p-5 bg-white border border-[#8EB69B]/40 hover:border-[#163832] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
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

              <h3 className="text-sm sm:text-base font-bold text-[#051F20] mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-[#526B61] line-clamp-2 mb-3">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#526B61] pt-3 border-t border-gray-50">
                <div className="space-y-0.5">
                  <div>📍 <strong>Lokasi:</strong> {item.location}</div>
                  <div>
                    👤 <strong>Pelapor:</strong>{" "}
                    {item.is_anonymous ? "🔒 Anonim" : item.user_name}
                  </div>
                </div>

                <Link href={`/admin/pengaduan/${item.id}`}>
                  <Button size="sm" variant="primary" className="gap-1.5 h-9 text-xs">
                    <span>Buka Detail & Tindak Lanjut</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

