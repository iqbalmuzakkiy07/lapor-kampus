"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { Category, Complaint } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Tags, Plus, Lock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form add category
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSensitive, setIsSensitive] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setCategories(db.getCategories());
    setComplaints(db.getComplaints());
  };

  const handleToggleActive = (cat: Category) => {
    const updated: Category = {
      ...cat,
      is_active: !cat.is_active,
    };
    db.updateCategory(updated);
    refreshData();
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newCat: Category = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      slug,
      description: description.trim(),
      is_sensitive: isSensitive,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    db.updateCategory(newCat);
    setName("");
    setDescription("");
    setIsSensitive(false);
    setIsAddModalOpen(false);
    refreshData();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#051F20] flex items-center gap-2">
            <Tags className="w-6 h-6 text-[#163832]" />
            <span>Manajemen Kategori Pengaduan</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#526B61] mt-0.5">
            Konfigurasikan klasifikasi pengaduan, status operasional, dan parameter sensitivitas.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </Button>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = complaints.filter((c) => c.category_id === cat.id).length;

          return (
            <Card
              key={cat.id}
              className={`p-5 bg-white border transition-all flex flex-col justify-between ${
                cat.is_active
                  ? "border-[#8EB69B]/40 hover:border-[#163832]"
                  : "border-gray-200 opacity-60 bg-gray-50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#051F20]">{cat.name}</h3>
                  <div className="flex items-center gap-1.5">
                    {cat.is_sensitive && (
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Sensitif
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        cat.is_active
                          ? "bg-[#DAF1DE] text-[#163832]"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {cat.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#526B61] leading-relaxed">
                  {cat.description || "Tidak ada deskripsi."}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[#526B61]">
                  Total Laporan: <strong>{count}</strong>
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleActive(cat)}
                  className="h-8 text-xs px-2.5"
                >
                  {cat.is_active ? "Nonaktifkan" : "Aktifkan"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* MODAL TAMBAH KATEGORI */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Kategori Baru"
        description="Buat klasifikasi baru untuk mempermudah alur distribusi pengaduan kampus."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddCategory}
              disabled={!name.trim()}
            >
              Simpan Kategori
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nama Kategori"
            placeholder="Contoh: Parkir & Transportasi Kampus"
            value={name}
            onChange={(e) => setName(e.target.value)}
            requiredMarker
          />

          <Textarea
            label="Deskripsi Kategori"
            placeholder="Jelaskan jenis-jenis permasalahan yang masuk dalam kategori ini..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="p-3 rounded-lg border border-purple-200 bg-purple-50 flex items-start gap-2.5">
            <input
              id="cat-sensitive"
              type="checkbox"
              checked={isSensitive}
              onChange={(e) => setIsSensitive(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-purple-700 focus:ring-purple-600 border-gray-300"
            />
            <label htmlFor="cat-sensitive" className="text-xs text-purple-950 cursor-pointer">
              <strong>Kategori Sensitif / Khusus</strong>
              <span className="block text-purple-800 text-[11px] mt-0.5">
                Pengaduan di kategori ini akan diproteksi dengan kerahasiaan tinggi dan penanganan terbatas.
              </span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}

