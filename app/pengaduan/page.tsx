"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StudentNavbar } from "@/components/layout/student-navbar";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/db";
import { Category, Complaint, ComplaintStatus } from "@/types/database";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  PlusCircle,
  FileText,
  Lock,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

export default function PengaduanSayaPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      const all = db.getComplaints();
      const myComplaints = all.filter((c) => c.user_id === user.id);
      setComplaints(myComplaints);
    }
    setCategories(db.getCategories());
  }, [user]);

  const filteredComplaints = complaints.filter((c) => {
    // Search query match
    const matchSearch =
      c.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter match
    const matchStatus =
      statusFilter === "all" ? true : c.status === statusFilter;

    // Category filter match
    const matchCategory =
      categoryFilter === "all" ? true : c.category_id === categoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF5] pb-24 md:pb-12">
      <StudentNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#051F20]">
              Pengaduan Saya
            </h1>
            <p className="text-xs sm:text-sm text-[#526B61]">
              Pantau seluruh riwayat pengaduan dan perkembangan penanganan masalah Anda.
            </p>
          </div>

          <Link href="/pengaduan/baru">
            <Button variant="primary" className="gap-2 w-full sm:w-auto">
              <PlusCircle className="w-4 h-4" />
              <span>Buat Pengaduan Baru</span>
            </Button>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#8EB69B]/30 shadow-card space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan nomor tiket (LPK-...) atau judul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#8EB69B] bg-white focus:outline-none focus:ring-2 focus:ring-[#235347]"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-56">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#8EB69B] bg-white text-[#051F20] focus:outline-none focus:ring-2 focus:ring-[#235347]"
              >
                <option value="all">Semua Status</option>
                <option value="dikirim">Dikirim</option>
                <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                <option value="menunggu_informasi">Menunggu Informasi</option>
                <option value="diteruskan">Diteruskan</option>
                <option value="sedang_diproses">Sedang Diproses</option>
                <option value="selesai">Selesai</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-56">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#8EB69B] bg-white text-[#051F20] focus:outline-none focus:ring-2 focus:ring-[#235347]"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <EmptyState
            title="Tidak ada pengaduan ditemukan"
            description={
              searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "Tidak ada pengaduan yang sesuai dengan filter pencarian Anda."
                : "Anda belum pernah mengirim pengaduan. Sampaikan aspirasi atau keluhan Anda sekarang."
            }
            actionLabel="Buat Pengaduan Sekarang"
            onAction={() => (window.location.href = "/pengaduan/baru")}
          />
        ) : (
          <div className="space-y-3">
            {filteredComplaints.map((item) => (
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

                  <h3 className="text-sm sm:text-base font-semibold text-[#051F20] group-hover:text-[#163832] transition-colors line-clamp-1 mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#526B61] line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#526B61] pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <span>📍 {item.location}</span>
                      {item.attachments && item.attachments.length > 0 && (
                        <span className="text-[#163832] font-medium">
                          📎 Ada Foto Bukti
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{formatDate(item.created_at)}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#163832] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

