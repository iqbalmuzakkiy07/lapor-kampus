"use client";

import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4FAF5]">
        <div className="text-sm font-semibold text-[#163832]">Memuat konsol...</div>
      </div>
    );
  }

  // Otorisasi role check
  if (!user || user.role === "mahasiswa") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4FAF5]">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-[#8EB69B]/40 shadow-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-[#B42318] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#051F20]">
            Akses Terbatas: Hanya Admin & Petugas
          </h2>
          <p className="text-xs sm:text-sm text-[#526B61] leading-relaxed">
            Akun Anda saat ini ({user ? user.name : "Tamu"}) memiliki peran <strong>{user ? user.role : "None"}</strong>.
            Gunakan tombol &ldquo;Ganti Akun Demo&rdquo; di bilah atas untuk beralih ke akun Admin atau Petugas.
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/">
              <Button variant="primary" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Portal Mahasiswa</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4FAF5]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

