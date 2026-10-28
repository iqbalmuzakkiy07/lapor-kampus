"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  UserPlus,
  LogIn,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchUser, allUsers } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regNim, setRegNim] = useState("");
  const [regDept, setRegDept] = useState("Teknik Informatika");
  const [regPhone, setRegPhone] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [isRegLoading, setIsRegLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!identifier.trim()) {
      setLoginError("Masukkan Email atau NIM/NIP Anda.");
      return;
    }

    setIsLoginLoading(true);
    const success = await login(identifier);
    setIsLoginLoading(false);

    if (success) {
      router.push("/");
    } else {
      setLoginError("Kredensial tidak ditemukan. Gunakan salah satu akun simulasi di bawah atau daftarkan akun baru.");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName.trim() || !regEmail.trim() || !regNim.trim()) {
      setRegError("Nama, Email Kampus, dan NIM wajib diisi.");
      return;
    }

    setIsRegLoading(true);
    const result = db.registerStudent({
      name: regName,
      email: regEmail,
      nim: regNim,
      department: regDept,
      phone_number: regPhone,
    });
    setIsRegLoading(false);

    if (!result.success) {
      setRegError(result.error || "Gagal mendaftarkan akun.");
    } else {
      setRegSuccess(true);
      // Auto login as new user
      if (result.user) {
        switchUser(result.user.id);
        setTimeout(() => {
          router.push("/");
        }, 1200);
      }
    }
  };

  const handleQuickLogin = (userId: string, role: string) => {
    switchUser(userId);
    if (role === "admin" || role === "petugas") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-[#DAF1DE]/40 via-[#F4FAF5] to-[#DAF1DE]/20">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-xl bg-[#163832] flex items-center justify-center text-[#DAF1DE] shadow-md group-hover:bg-[#235347] transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#051F20]">
            Portal LaporKampus
          </h1>
          <p className="text-xs sm:text-sm text-[#526B61]">
            Layanan Pengaduan & Aspirasi Kampus Terpadu
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#DAF1DE]/60 p-1 rounded-xl border border-[#8EB69B]/40">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "login"
                ? "bg-[#163832] text-white shadow-sm"
                : "text-[#163832] hover:bg-white/40"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Akun</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "register"
                ? "bg-[#163832] text-white shadow-sm"
                : "text-[#163832] hover:bg-white/40"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Mahasiswa</span>
          </button>
        </div>

        {/* Card Form */}
        <Card className="bg-white border border-[#8EB69B]/40 shadow-card">
          {activeTab === "login" ? (
            <>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Autentikasi Akun</CardTitle>
                <CardDescription>
                  Gunakan email atau NIM/NIP untuk masuk ke sistem.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-[#B42318] rounded-md text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <Input
                    label="Email atau NIM / NIP"
                    placeholder="misal: mahasiswa@kampus.ac.id atau 2201010045"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    requiredMarker
                  />

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#051F20]">
                      Kata Sandi <span className="text-[#B42318]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex min-h-[44px] w-full rounded-md border border-[#8EB69B] bg-white px-3 py-2 text-sm text-[#051F20] placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#235347] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#051F20]"
                        aria-label="Tampilkan sandi"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isLoginLoading}
                  >
                    Masuk
                  </Button>
                </form>

                {/* Quick Demo Switcher */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#163832]">
                    <UserCheck className="w-4 h-4 text-[#235347]" />
                    <span>Simulasi Masuk Cepat (Pilih Akun Penguji):</span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u.id, u.role)}
                        className="flex items-center justify-between text-left p-2 rounded-lg border border-[#8EB69B]/30 hover:bg-[#DAF1DE]/40 text-xs transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-[#051F20]">{u.name}</span>
                          <span className="block text-[11px] text-[#526B61]">
                            {u.email} ({u.role})
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#163832] bg-[#DAF1DE] px-2 py-0.5 rounded">
                          Masuk
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Pendaftaran Mahasiswa</CardTitle>
                <CardDescription>
                  Daftarkan identitas mahasiswa Anda untuk menyampaikan aspirasi dan pengaduan.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {regSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h3 className="font-bold text-sm text-emerald-900">
                      Pendaftaran Berhasil!
                    </h3>
                    <p className="text-xs text-emerald-700">
                      Akun mahasiswa Anda telah aktif. Mengalihkan ke Beranda...
                    </p>
                  </div>
                ) : (
                  <>
                    {regError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-[#B42318] rounded-md text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="space-y-3">
                      <Input
                        label="Nama Lengkap"
                        placeholder="Contoh: Muhammad Rizky"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        requiredMarker
                      />

                      <Input
                        label="Email Kampus (@kampus.ac.id)"
                        type="email"
                        placeholder="m.rizky@kampus.ac.id"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        requiredMarker
                      />

                      <Input
                        label="NIM (Nomor Induk Mahasiswa)"
                        placeholder="2201010199"
                        value={regNim}
                        onChange={(e) => setRegNim(e.target.value)}
                        requiredMarker
                      />

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-[#051F20]">
                          Program Studi
                        </label>
                        <select
                          value={regDept}
                          onChange={(e) => setRegDept(e.target.value)}
                          className="flex min-h-[44px] w-full rounded-md border border-[#8EB69B] bg-white px-3 py-2 text-sm text-[#051F20]"
                        >
                          <option value="Teknik Informatika">Teknik Informatika</option>
                          <option value="Sistem Informasi">Sistem Informasi</option>
                          <option value="Teknik Komputer">Teknik Komputer</option>
                          <option value="Manajemen">Manajemen</option>
                          <option value="Ilmu Komunikasi">Ilmu Komunikasi</option>
                          <option value="Hukum">Hukum</option>
                        </select>
                      </div>

                      <Input
                        label="Nomor WhatsApp/HP (Opsional)"
                        placeholder="08123456789"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                      />

                      <div className="p-2.5 bg-[#DAF1DE]/40 border border-[#8EB69B]/40 rounded-lg text-[11px] text-[#526B61] leading-relaxed">
                        Akun yang didaftarkan secara mandiri otomatis berstatus peran <strong>Mahasiswa</strong> untuk menjamin keamanan akses sistem.
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={isRegLoading}
                      >
                        Daftar Sebagai Mahasiswa
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </>
          )}
        </Card>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#526B61] text-center">
          <ShieldCheck className="w-4 h-4 text-[#235347]" />
          <span>Sistem diawasi dan dilindungi hak akses berbasis peran (RBAC)</span>
        </div>
      </div>
    </div>
  );
}
