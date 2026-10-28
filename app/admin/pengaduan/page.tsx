"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/db";
import { Category, Complaint, ComplaintPriority, ComplaintStatus } from "@/types/database";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  Eye,
  Lock,
  ArrowUpDown,
  Download,
} from "lucide-react";

export default function AdminPengaduanListPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get("status") || "all";

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    setComplaints(db.getComplaints());
    setCategories(db.getCategories());
  }, []);

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.user_name && c.user_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus =
      statusFilter === "all" ? true : c.status === statusFilter;
    const matchCategory =
      categoryFilter === "all" ? true : c.category_id === categoryFilter;
    const matchPriority =
      priorityFilter === "all" ? true : c.priority === priorityFilter;

    return matchSearch && matchStatus && matchCategory && matchPriority;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#051F20]">
            Daftar Seluruh Pengaduan
          </h1>
          <p className="text-xs sm:text-sm text-[#526B61]">
            Kelola, verifikasi, dan pantau status tindak lanjut seluruh pengaduan kampus.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#8EB69B]/30 shadow-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tiket, judul, pelapor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-[#8EB69B] bg-white focus:outline-none focus:ring-2 focus:ring-[#235347]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#8EB69B] bg-white text-[#051F20] focus:outline-none focus:ring-2 focus:ring-[#235347]"
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
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#8EB69B] bg-white text-[#051F20] focus:outline-none focus:ring-2 focus:ring-[#235347]"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#8EB69B] bg-white text-[#051F20] focus:outline-none focus:ring-2 focus:ring-[#235347]"
            >
              <option value="all">Semua Prioritas</option>
              <option value="rendah">Rendah</option>
              <option value="sedang">Sedang</option>
              <option value="tinggi">Tinggi</option>
              <option value="darurat">Darurat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table (Desktop) & Cards (Mobile) */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Tidak ada pengaduan ditemukan"
          description="Cobalah ubah filter pencarian atau pastikan kata kunci sudah benar."
        />
      ) : (
        <div className="space-y-4">
          {/* Mobile Card View (md:hidden) */}
          <div className="md:hidden space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl border border-[#8EB69B]/30 shadow-card space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#163832] bg-[#DAF1DE] px-2 py-0.5 rounded">
                    {item.ticket_number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <PriorityBadge priority={item.priority} size="sm" />
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#051F20] line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="text-xs text-[#526B61] mt-0.5">
                    {item.category?.name} • 📍 {item.location}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#526B61] pt-2 border-t border-gray-100">
                  <div>
                    {item.is_anonymous ? (
                      <span className="text-purple-700 font-semibold">🔒 Anonim</span>
                    ) : (
                      <span>{item.user_name}</span>
                    )}
                  </div>
                  <span>{formatDate(item.created_at)}</span>
                </div>

                <Link href={`/admin/pengaduan/${item.id}`} className="block pt-1">
                  <Button size="sm" variant="secondary" className="w-full h-10 text-xs gap-1.5 border-[#163832]/30">
                    <Eye className="w-3.5 h-3.5 text-[#163832]" />
                    <span>Periksa & Tindak Lanjut</span>
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Desktop Table View (hidden md:block) */}
          <div className="hidden md:block bg-white rounded-xl border border-[#8EB69B]/30 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-[#051F20] text-white text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">No. Tiket</th>
                    <th className="py-3 px-4">Judul & Kategori</th>
                    <th className="py-3 px-4">Pelapor</th>
                    <th className="py-3 px-4">Prioritas</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Tanggal Masuk</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#DAF1DE]/20 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#163832]">
                        {item.ticket_number}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-[#051F20] line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#526B61]">
                          {item.category?.name} • 📍 {item.location}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.is_anonymous ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            <Lock className="w-3 h-3" />
                            Anonim
                          </span>
                        ) : (
                          <div>
                            <div className="font-medium text-[#051F20]">
                              {item.user_name}
                            </div>
                            <div className="text-[10px] text-[#526B61]">
                              {item.user_nim}
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PriorityBadge priority={item.priority} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-[#526B61]">
                        {formatDate(item.created_at)}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <Link href={`/admin/pengaduan/${item.id}`}>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 px-2.5 text-xs gap-1 border-[#163832]/30"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#163832]" />
                            <span>Periksa</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

