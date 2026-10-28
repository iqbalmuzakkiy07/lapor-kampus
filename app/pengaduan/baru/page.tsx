"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudentNavbar } from "@/components/layout/student-navbar";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/db";
import { Category, Complaint } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Textarea, Select } from "@/components/ui/input";
import {
  Building2,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Lock,
  Eye,
  AlertCircle,
  HelpCircle,
  Camera,
  X,
} from "lucide-react";
import Link from "next/link";

export default function BuatPengaduanPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);

  // Form states
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Attachment states
  const [attachmentFile, setAttachmentFile] = useState<{
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
  } | null>(null);
  const [fileError, setFileError] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const cats = db.getCategories().filter((c) => c.is_active);
    setCategories(cats);
    if (cats.length > 0 && !categoryId) {
      setCategoryId(cats[0].id);
    }
  }, []);

  // Konfirmasi sebelum meninggalkan formulir yang belum disimpan (design.md Bagian 8.3)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if ((title.trim() || description.trim() || location.trim()) && currentStep < 6) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [title, description, location, currentStep]);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Ukuran file maksimal 5 MB.");
      return;
    }

    // Validate type: image
    if (!file.type.startsWith("image/")) {
      setFileError("Format file harus berupa gambar (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachmentFile({
        file_name: file.name,
        file_url: event.target?.result as string,
        file_type: file.type,
        file_size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachmentFile(null);
    setFileError("");
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!categoryId) newErrors.category = "Silakan pilih kategori pengaduan.";
    }

    if (step === 2) {
      if (!title.trim()) newErrors.title = "Judul pengaduan wajib diisi.";
      else if (title.trim().length < 5)
        newErrors.title = "Judul minimal 5 karakter.";

      if (!description.trim())
        newErrors.description = "Deskripsi permasalahan wajib diisi.";
      else if (description.trim().length < 15)
        newErrors.description = "Deskripsi permasalahan minimal 15 karakter.";
    }

    if (step === 3) {
      if (!location.trim()) newErrors.location = "Lokasi kejadian wajib diisi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Silakan masuk terlebih dahulu untuk mengirim laporan.");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate network save
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newComplaint = db.createComplaint({
        user,
        category_id: categoryId,
        title,
        description,
        location,
        incident_time: incidentTime ? new Date(incidentTime).toISOString() : undefined,
        is_anonymous: isAnonymous,
        attachment: attachmentFile || undefined,
      });

      setCreatedComplaint(newComplaint);
      setCurrentStep(6); // Step 6 = Sukses
    } catch (err) {
      alert("Terjadi kendala saat menyimpan data pengaduan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 6: KONFIRMASI SUKSES
  if (currentStep === 6 && createdComplaint) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4FAF5] pb-24 md:pb-12">
        <StudentNavbar />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-16 flex items-center justify-center">
          <Card className="w-full text-center p-6 sm:p-8 bg-white border border-[#8EB69B]/40 shadow-card">
            <div className="w-16 h-16 rounded-full bg-[#DAF1DE] text-[#235347] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#051F20] mb-2">
              Pengaduan Berhasil Dikirim
            </h1>
            <p className="text-xs sm:text-sm text-[#526B61] mb-6">
              Laporan Anda telah tercatat dalam sistem dan akan segera diverifikasi oleh tim admin kampus.
            </p>

            <div className="bg-[#DAF1DE]/40 border border-[#8EB69B] rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="text-xs text-[#526B61]">Nomor Tiket Pengaduan:</div>
              <div className="text-lg sm:text-xl font-mono font-bold text-[#163832] flex items-center justify-between">
                <span>{createdComplaint.ticket_number}</span>
                <span className="text-xs bg-[#163832] text-white px-2.5 py-0.5 rounded-full font-sans font-medium">
                  Dikirim
                </span>
              </div>
              <div className="text-xs text-[#051F20] font-medium pt-1 border-t border-[#8EB69B]/30">
                Judul: {createdComplaint.title}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/pengaduan/${createdComplaint.id}`} className="flex-1">
                <Button variant="primary" className="w-full gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Lihat Detail Pengaduan</span>
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF5] pb-24 md:pb-12">
      <StudentNavbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Title & Step Indicator */}
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#526B61] hover:text-[#163832] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#051F20]">
            Formulir Pengaduan Kampus
          </h1>
          <p className="text-xs sm:text-sm text-[#526B61]">
            Lengkapi data secara runtut untuk mempermudah penanganan oleh petugas terkait.
          </p>

          {/* Stepper bar */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2 text-xs font-semibold text-[#163832]">
              <span>Langkah {currentStep} dari 5</span>
              <span>
                {currentStep === 1 && "Pilih Kategori"}
                {currentStep === 2 && "Judul & Deskripsi"}
                {currentStep === 3 && "Lokasi & Waktu"}
                {currentStep === 4 && "Bukti Foto & Privasi"}
                {currentStep === 5 && "Tinjau & Kirim"}
              </span>
            </div>
            <div className="w-full bg-[#DAF1DE] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#163832] h-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <Card className="bg-white border border-[#8EB69B]/40 shadow-card">
          <CardContent className="p-5 sm:p-7 space-y-5">
            {/* STEP 1: PILIH KATEGORI */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-[#051F20]">
                    Pilih Kategori Permasalahan
                  </h2>
                  <p className="text-xs text-[#526B61]">
                    Pilih topik yang paling sesuai dengan kejadian yang ingin Anda laporkan.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {categories.map((cat) => {
                    const isSelected = cat.id === categoryId;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategoryId(cat.id);
                          setErrors({});
                        }}
                        className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#DAF1DE]/60 border-[#163832] ring-2 ring-[#235347]/30 shadow-sm"
                            : "bg-white border-[#8EB69B]/40 hover:bg-[#F4FAF5]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-xs sm:text-sm text-[#051F20]">
                            {cat.name}
                          </span>
                          {cat.is_sensitive && (
                            <span className="shrink-0 text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              Sensitif
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#526B61] mt-1.5 line-clamp-2">
                          {cat.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {errors.category && (
                  <p className="text-xs text-[#B42318] font-medium">{errors.category}</p>
                )}

                {selectedCategory?.is_sensitive && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 text-xs flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Kategori dengan Penanganan Khusus:</span> Laporan ini akan diproses langsung oleh Satgas Pencegahan / Pejabat Berwenang dengan perlindungan identitas pelapor.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: JUDUL & DESKRIPSI */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-[#051F20]">
                    Judul dan Rincian Pengaduan
                  </h2>
                  <p className="text-xs text-[#526B61]">
                    Jelaskan inti masalah secara jelas dan terperinci.
                  </p>
                </div>

                <Input
                  label="Judul Pengaduan"
                  placeholder="Contoh: AC Ruang Kuliah 304 Bocor dan Menetes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                  helperText="Tuliskan judul singkat yang menggambarkan inti masalah (minimal 5 karakter)."
                  requiredMarker
                />

                <Textarea
                  label="Deskripsi Permasalahan"
                  placeholder="Jelaskan secara detail kejadian, dampak yang dirasakan, dan nomor sarana jika ada..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={errors.description}
                  helperText={`Minimal 15 karakter. Karakter saat ini: ${description.length}`}
                  requiredMarker
                />
              </div>
            )}

            {/* STEP 3: LOKASI & WAKTU */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-[#051F20]">
                    Lokasi dan Waktu Kejadian
                  </h2>
                  <p className="text-xs text-[#526B61]">
                    Informasi lokasi yang akurat memudahkan petugas lapangan melakukan tindak lanjut.
                  </p>
                </div>

                <Input
                  label="Lokasi Spesifik Kejadian"
                  placeholder="Contoh: Gedung B Lantai 3, Ruang Kelas 304"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  error={errors.location}
                  helperText="Sebutkan nama gedung, lantai, dan nomor ruangan atau landmark sekitar."
                  requiredMarker
                />

                <Input
                  label="Waktu Kejadian (Opsional)"
                  type="datetime-local"
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                  helperText="Kosongkan jika kejadian baru saja terjadi hari ini."
                />
              </div>
            )}

            {/* STEP 4: BUKTI FOTO & PRIVASI */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold text-[#051F20]">
                    Lampiran Bukti & Pengaturan Privasi
                  </h2>
                  <p className="text-xs text-[#526B61]">
                    Foto bukti sangat membantu verifikasi awal admin dan petugas.
                  </p>
                </div>

                {/* Upload Foto */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#051F20]">
                    Unggah Foto Bukti (Opsional)
                  </label>

                  {attachmentFile ? (
                    <div className="relative border border-[#8EB69B] rounded-xl p-3 bg-[#F4FAF5] flex items-center justify-between">
                      <div className="flex items-center gap-3 truncate">
                        <img
                          src={attachmentFile.file_url}
                          alt="Pratinjau Bukti"
                          className="w-14 h-14 object-cover rounded-lg border border-[#8EB69B]/40"
                        />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-[#051F20] truncate">
                            {attachmentFile.file_name}
                          </p>
                          <p className="text-[11px] text-[#526B61]">
                            {(attachmentFile.file_size / 1024).toFixed(1)} KB • Siap dikirim
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeAttachment}
                        className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500"
                        title="Hapus foto"
                      >
                        <X className="w-5 h-5 text-[#B42318]" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-[#8EB69B] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#DAF1DE]/20 transition-colors">
                      <Camera className="w-8 h-8 text-[#163832] mb-2" />
                      <span className="text-xs sm:text-sm font-semibold text-[#163832]">
                        Klik untuk memilih foto dari perangkat
                      </span>
                      <span className="text-[11px] text-[#526B61] mt-1">
                        Format JPG, PNG, atau WebP (Maksimal 5 MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  )}

                  {fileError && (
                    <p className="text-xs text-[#B42318] font-medium">{fileError}</p>
                  )}
                </div>

                {/* Privacy setting (Anonimitas) */}
                <div className="p-4 rounded-xl border border-[#8EB69B]/40 bg-[#DAF1DE]/20 space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      id="checkbox-anon"
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#163832] focus:ring-[#235347] border-[#8EB69B]"
                    />
                    <label htmlFor="checkbox-anon" className="cursor-pointer">
                      <span className="text-xs sm:text-sm font-bold text-[#051F20] block">
                        Kirim sebagai Laporan Anonim
                      </span>
                      <span className="text-[11px] text-[#526B61] block leading-normal mt-0.5">
                        Nama dan NIM Anda akan disembunyikan dari tampilan umum penanganan. Hanya admin pengawas kepatuhan yang dapat mengakses catatan identitas jika diperlukan investigasi resmi.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: TINJAU & KIRIM */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-[#051F20]">
                    Tinjau Informasi Pengaduan
                  </h2>
                  <p className="text-xs text-[#526B61]">
                    Periksa kembali kelengkapan laporan Anda sebelum dikirimkan ke sistem.
                  </p>
                </div>

                <div className="bg-[#F4FAF5] border border-[#8EB69B]/40 rounded-xl p-4 space-y-3 text-xs">
                  <div>
                    <span className="text-[#526B61] block">Kategori:</span>
                    <span className="font-semibold text-[#051F20] text-sm">
                      {selectedCategory?.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#526B61] block">Judul:</span>
                    <span className="font-semibold text-[#051F20] text-sm">
                      {title}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#526B61] block">Deskripsi Permasalahan:</span>
                    <p className="text-[#051F20] whitespace-pre-wrap mt-0.5 bg-white p-2.5 rounded border border-gray-100">
                      {description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[#526B61] block">Lokasi Kejadian:</span>
                      <span className="font-medium text-[#051F20]">{location}</span>
                    </div>
                    <div>
                      <span className="text-[#526B61] block">Waktu Kejadian:</span>
                      <span className="font-medium text-[#051F20]">
                        {incidentTime ? new Date(incidentTime).toLocaleString("id-ID") : "Baru saja / hari ini"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#526B61] block">Privasi Identitas:</span>
                    <span className="font-medium text-[#051F20]">
                      {isAnonymous ? "🔒 Anonim (Nama disembunyikan)" : `Tampilkan Nama (${user?.name})`}
                    </span>
                  </div>

                  {attachmentFile && (
                    <div>
                      <span className="text-[#526B61] block">Lampiran Bukti:</span>
                      <div className="mt-1 flex items-center gap-2">
                        <img
                          src={attachmentFile.file_url}
                          alt="Lampiran"
                          className="w-12 h-12 rounded object-cover border"
                        />
                        <span className="text-gray-700 font-medium">
                          {attachmentFile.file_name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-xs flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>
                    Setelah dikirim, laporan akan memperoleh nomor tiket unik dan riwayat status dapat dipantau setiap saat.
                  </span>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </Button>
              ) : (
                <Link href="/">
                  <Button type="button" variant="ghost">
                    Batal
                  </Button>
                </Link>
              )}

              {currentStep < 5 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={nextStep}
                  className="gap-1.5 ml-auto"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  className="gap-1.5 ml-auto bg-[#235347] hover:bg-[#163832]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kirim Pengaduan</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

