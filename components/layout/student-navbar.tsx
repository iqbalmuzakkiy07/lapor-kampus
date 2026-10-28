"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/db";
import {
  Building2,
  Home,
  FileText,
  PlusCircle,
  Bell,
  User as UserIcon,
  LogIn,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";

export function StudentNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const notifs = db.getNotifications(user.id);
      setUnreadCount(notifs.filter((n) => !n.is_read).length);
    } else {
      setUnreadCount(0);
    }
  }, [user, pathname]);

  const navLinks = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Pengaduan Saya", href: "/pengaduan", icon: FileText },
    { label: "Notifikasi", href: "/notifikasi", icon: Bell, badge: unreadCount },
    { label: "Profil", href: "/profil", icon: UserIcon },
  ];

  return (
    <>
      {/* Top Header (Desktop & Mobile) */}
      <header className="sticky top-0 z-30 bg-[#0B2B26] text-white border-b border-[#163832] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-[#163832] border border-[#8EB69B]/40 flex items-center justify-center text-[#DAF1DE] group-hover:bg-[#235347] transition-colors">
              <Building2 className="w-5 h-5 text-[#DAF1DE]" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                LaporKampus
              </span>
              <span className="block text-[10px] text-[#8EB69B] -mt-1 font-medium">
                Layanan Pengaduan & Aspirasi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    isActive
                      ? "bg-[#163832] text-white shadow-inner font-semibold"
                      : "text-[#DAF1DE]/80 hover:bg-[#163832]/60 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#8EB69B]" />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-1 px-1.5 py-0.2 bg-[#B42318] text-white text-[11px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Buat Pengaduan CTA & User */}
          <div className="flex items-center gap-3">
            <Link href="/pengaduan/baru" className="hidden sm:inline-block">
              <Button
                variant="primary"
                className="bg-[#235347] hover:bg-[#163832] border border-[#8EB69B]/40 text-white font-semibold flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#DAF1DE]" />
                <span>Buat Pengaduan</span>
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profil"
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#163832] transition-colors"
                  title="Profil Saya"
                >
                  <div className="w-8 h-8 rounded-full bg-[#163832] border border-[#8EB69B] flex items-center justify-center text-xs font-semibold text-[#DAF1DE]">
                    {user.name.charAt(0)}
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-[#163832] transition-colors hidden sm:block"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Sesuai design.md Bagian 7 & 9) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0B2B26] border-t border-[#163832] pb-safe shadow-lg">
        <div className="grid grid-cols-5 h-16">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
              pathname === "/" ? "text-[#DAF1DE] font-semibold" : "text-gray-400"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Beranda</span>
          </Link>

          <Link
            href="/pengaduan"
            className={`flex flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
              pathname === "/pengaduan" && !pathname?.startsWith("/pengaduan/baru")
                ? "text-[#DAF1DE] font-semibold"
                : "text-gray-400"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Laporan</span>
          </Link>

          {/* Central Prominent CTA: Buat Pengaduan */}
          <Link
            href="/pengaduan/baru"
            className="flex flex-col items-center justify-center relative -top-3"
          >
            <div className="w-12 h-12 rounded-full bg-[#163832] border-2 border-[#8EB69B] flex items-center justify-center text-white shadow-card hover:bg-[#235347] transition-transform active:scale-95">
              <PlusCircle className="w-6 h-6 text-[#DAF1DE]" />
            </div>
            <span className="text-[10px] text-[#DAF1DE] font-semibold mt-1">Lapor</span>
          </Link>

          <Link
            href="/notifikasi"
            className={`flex flex-col items-center justify-center gap-1 text-[11px] relative transition-colors ${
              pathname?.startsWith("/notifikasi")
                ? "text-[#DAF1DE] font-semibold"
                : "text-gray-400"
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B42318] rounded-full ring-2 ring-[#0B2B26]" />
              )}
            </div>
            <span>Notifikasi</span>
          </Link>

          <Link
            href="/profil"
            className={`flex flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
              pathname?.startsWith("/profil")
                ? "text-[#DAF1DE] font-semibold"
                : "text-gray-400"
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span>Profil</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

