"use client";

import React, { useState } from "react";
import { StudentNavbar } from "@/components/layout/student-navbar";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  User,
  Mail,
  GraduationCap,
  Shield,
  HelpCircle,
  FileCheck,
  LogOut,
  ChevronDown,
  Lock,
  Phone,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function ProfilPage() {
  const { user, logout, switchUser } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Edit phone modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPhone, setEditPhone] = useState(user?.phone_number || "");
  const [editSuccess, setEditSuccess] = useState(false);

  const faqs = [
    {
      q: "Berapa lama laporan saya akan diverifikasi oleh admin?",
      a: "Proses verifikasi berkas dan kelayakan pengaduan biasanya diselesaikan dalam waktu 1x24 jam kerja sejak laporan berhasil dikirim.",
    },
    {
      q: "Apakah identitas saya aman saat mengirimkan laporan?",
      a: "Ya. Tersedia opsi 'Laporan Anonim' pada saat pembuatan pengaduan. Identitas Anda akan disembunyikan dari proses penanganan publik.",
    },
    {
      q: "Bagaimana jika laporan saya membutuhkan informasi tambahan?",
      a: "Anda akan menerima notifikasi dalam aplikasi dan dapat langsung membalas serta melengkapi keterangan melalui form tanggapan di halaman detail pengaduan.",
    },
    {
      q: "Kapan saya dapat memberikan penilaian (rating)?",
      a: "Formulir penilaian kepuasan layanan dengan bintang 1 hingga 5 akan otomatis aktif begitu laporan Anda berstatus 'Selesai'.",
    },
  ];

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const users = db.getUsers();
    const target = users.find((u) => u.id === user.id);
    if (target) {
      target.phone_number = editPhone.trim();
      db.saveUsers(users);
      switchUser(user.id); // refresh context
      setEditSuccess(true);
      setTimeout(() => {
        setEditSuccess(false);
        setIsEditModalOpen(false);
      }, 1000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4FAF5]">
        <StudentNavbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <p className="text-sm text-[#526B61]">Anda belum masuk ke akun.</p>
          <Link href="/login">
            <Button variant="primary">Masuk Akun</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF5] pb-24 md:pb-12">
      <StudentNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#051F20]">
            Profil & Pengaturan Akun
          </h1>
          <p className="text-xs sm:text-sm text-[#526B61]">
            Kelola data akun civitas akademika dan pelajari panduan layanan pengaduan.
          </p>
        </div>

        {/* User Profile Card */}
        <Card className="bg-white border border-[#8EB69B]/40 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#163832] border-2 border-[#8EB69B] text-white flex items-center justify-center text-xl font-bold shadow-sm">
                {user.name.charAt(0)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-[#051F20]">{user.name}</h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#DAF1DE] text-[#163832] capitalize border border-[#8EB69B]/30">
                    {user.role}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#526B61] pt-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#163832]" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#163832]" />
                    <span>NIM / NIP: {user.nim_nip}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#163832]" />
                    <span>Departemen: {user.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#163832]" />
                    <span>Kontak: {user.phone_number || "Belum diatur"}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditPhone(user.phone_number || "");
                        setIsEditModalOpen(true);
                      }}
                      className="text-[#163832] font-semibold hover:underline flex items-center gap-0.5 ml-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Ubah</span>
                    </button>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-[#B42318] border-red-300 hover:bg-red-50 gap-2 shrink-0 self-end sm:self-center"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Center */}
        <Card className="bg-white border border-[#8EB69B]/30 shadow-card">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-base font-bold text-[#051F20] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#163832]" />
              <span>Pusat Bantuan & FAQ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-gray-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-[#051F20] hover:text-[#163832]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${openFaq === idx ? "rotate-180 text-[#163832]" : ""
                      }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="text-xs text-[#526B61] leading-relaxed mt-2 pl-1 animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Campus Policy Notice */}
        <div className="p-4 rounded-xl border border-[#8EB69B]/30 bg-[#DAF1DE]/30 text-xs text-[#526B61] flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#163832] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-[#051F20]">
              Kebijakan Privasi & Etika Pengaduan
            </h4>
            <p className="leading-relaxed">
              Seluruh laporan yang dikirimkan wajib mematuhi kode etik universitas. Laporan palsu, fitnah, atau pelecehan dapat dikenakan sanksi tata tertib akademik. Privasi pelapor dilindungi sesuai regulasi kampus.
            </p>
          </div>
        </div>
        {/* Modal Edit Kontak */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Ubah Nomor Kontak Mahasiswa"
          description="Nomor kontak digunakan oleh admin untuk konfirmasi penanganan darurat."
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSavePhone}
              >
                Simpan Kontak
              </Button>
            </>
          }
        >
          {editSuccess ? (
            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-lg text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold">Nomor kontak berhasil diperbarui!</p>
            </div>
          ) : (
            <form onSubmit={handleSavePhone} className="space-y-3">
              <Input
                label="Nomor Telepon / WhatsApp"
                placeholder="Contoh: 08123456789"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                requiredMarker
              />
            </form>
          )}
        </Modal>
      </main>
    </div>
  );
}

