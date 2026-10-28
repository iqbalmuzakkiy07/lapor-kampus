"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { UserCheck, Shield, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DemoRoleBanner() {
  const { user, switchUser, allUsers } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (!user) return null;

  const isAdminArea = pathname?.startsWith("/admin");

  return (
    <div className="bg-[#051F20] text-white text-xs border-b border-[#163832] relative z-40">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-[#8EB69B]">
            <Shield className="w-3.5 h-3.5 text-[#DAF1DE]" />
            Role Aktif:
          </span>
          <span className="bg-[#163832] px-2 py-0.5 rounded text-[#DAF1DE] font-medium capitalize">
            {user.role} ({user.name.split(",")[0]})
          </span>
          <span className="hidden sm:inline text-gray-400">
            • {user.department}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick link between student portal and admin dashboard */}
          {user.role !== "mahasiswa" && (
            <Link
              href={isAdminArea ? "/" : "/admin"}
              className="bg-[#235347] hover:bg-[#163832] text-white px-2.5 py-1 rounded text-xs font-medium transition-colors"
            >
              {isAdminArea ? "← Buka Portal Mahasiswa" : "→ Masuk Dashboard Admin"}
            </Link>
          )}

          {/* User selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 bg-[#163832] hover:bg-[#235347] text-white px-2.5 py-1 rounded transition-colors"
            >
              <UserCheck className="w-3 h-3 text-[#DAF1DE]" />
              <span>Ganti Akun Demo</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white text-[#051F20] rounded-lg shadow-popover border border-[#8EB69B]/40 py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-gray-100 text-[11px] font-semibold text-[#526B61] uppercase tracking-wider">
                  Pilih Pengguna Simulasi
                </div>
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#DAF1DE]/40 transition-colors ${
                      u.id === user.id ? "bg-[#DAF1DE]/60 font-semibold text-[#163832]" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-[10px] text-[#526B61] capitalize">
                        {u.role} • {u.department}
                      </div>
                    </div>
                    {u.id === user.id && (
                      <span className="w-2 h-2 rounded-full bg-[#163832]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

