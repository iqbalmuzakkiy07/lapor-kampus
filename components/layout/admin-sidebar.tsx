"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  Tags,
  BarChart3,
  Building2,
  Menu,
  X,
  ExternalLink,
  LogOut,
  ShieldAlert,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Semua Pengaduan",
      href: "/admin/pengaduan",
      icon: ClipboardList,
    },
    {
      label: "Tugas Saya",
      href: "/admin/tugas",
      icon: CheckSquare,
      role: ["petugas", "admin"],
    },
    {
      label: "Kategori Pengaduan",
      href: "/admin/kategori",
      icon: Tags,
      role: ["admin"],
    },
    {
      label: "Statistik & Evaluasi",
      href: "/admin/statistik",
      icon: BarChart3,
    },
  ];

  const filteredItems = menuItems.filter((item) => {
    if (!item.role) return true;
    if (!user) return false;
    return item.role.includes(user.role);
  });

  return (
    <>
      {/* Mobile Top Bar for Admin */}
      <div className="md:hidden bg-[#051F20] text-white px-4 h-14 flex items-center justify-between border-b border-[#163832]">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#8EB69B]" />
          <span className="font-bold text-sm tracking-tight">Admin LaporKampus</span>
        </div>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-1.5 rounded-md hover:bg-[#163832] text-[#DAF1DE]"
          aria-label="Toggle Navigation"
        >
          {isOpenMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#051F20] text-white flex flex-col z-50 transition-transform duration-200 ease-in-out border-r border-[#163832] ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#163832] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#163832] border border-[#8EB69B]/40 flex items-center justify-center text-[#DAF1DE]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white">
              LaporKampus Admin
            </div>
            <div className="text-[10px] text-[#8EB69B] flex items-center gap-1 font-medium">
              <ShieldAlert className="w-3 h-3 text-[#DAF1DE]" />
              Panel Manajemen & Petugas
            </div>
          </div>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-4 mx-3 my-3 bg-[#0B2B26] border border-[#163832] rounded-lg">
            <div className="text-xs font-semibold text-[#DAF1DE] truncate">
              {user.name}
            </div>
            <div className="text-[11px] text-gray-400 capitalize mt-0.5">
              {user.role} • {user.department}
            </div>
            <div className="text-[10px] text-[#8EB69B] mt-1 font-mono">
              NIP: {user.nim_nip}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/admin");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpenMobile(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#163832] text-white font-semibold border-l-4 border-[#8EB69B]"
                    : "text-gray-300 hover:bg-[#0B2B26] hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#DAF1DE]" : "text-[#8EB69B]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#163832] space-y-1">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-gray-300 hover:bg-[#0B2B26] hover:text-[#DAF1DE] transition-colors"
          >
            <span>Buka Portal Mahasiswa</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>
          <button
            onClick={() => {
              logout();
              setIsOpenMobile(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
}

