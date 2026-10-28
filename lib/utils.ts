import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ComplaintPriority, ComplaintStatus } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  dikirim: "Dikirim",
  menunggu_verifikasi: "Menunggu Verifikasi",
  menunggu_informasi: "Menunggu Informasi",
  diteruskan: "Diteruskan",
  sedang_diproses: "Sedang Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

export const STATUS_STYLES: Record<
  ComplaintStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  dikirim: {
    bg: "bg-[#DAF1DE] text-[#051F20]",
    text: "text-[#051F20]",
    border: "border-[#8EB69B]",
    dot: "bg-[#163832]",
  },
  menunggu_verifikasi: {
    bg: "bg-[#FFF8E6] text-[#8A6418]",
    text: "text-[#8A6418]",
    border: "border-[#FFE59E]",
    dot: "bg-[#8A6418]",
  },
  menunggu_informasi: {
    bg: "bg-[#FEF3EB] text-[#B54708]",
    text: "text-[#B54708]",
    border: "border-[#FECDCA]",
    dot: "bg-[#B54708]",
  },
  diteruskan: {
    bg: "bg-[#E6F4F1] text-[#235347]",
    text: "text-[#235347]",
    border: "border-[#8EB69B]",
    dot: "bg-[#235347]",
  },
  sedang_diproses: {
    bg: "bg-[#E0EFF0] text-[#163832]",
    text: "text-[#163832]",
    border: "border-[#8EB69B]",
    dot: "bg-[#163832]",
  },
  selesai: {
    bg: "bg-[#DAF1DE] text-[#163832]",
    text: "text-[#163832]",
    border: "border-[#8EB69B]",
    dot: "bg-[#235347]",
  },
  ditolak: {
    bg: "bg-[#FEE4E2] text-[#B42318]",
    text: "text-[#B42318]",
    border: "border-[#FDA29B]",
    dot: "bg-[#B42318]",
  },
};

export const PRIORITY_LABELS: Record<ComplaintPriority, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
  darurat: "Darurat",
};

export const PRIORITY_STYLES: Record<ComplaintPriority, string> = {
  rendah: "bg-slate-100 text-slate-700 border-slate-300",
  sedang: "bg-blue-50 text-blue-800 border-blue-200",
  tinggi: "bg-orange-50 text-orange-800 border-orange-200",
  darurat: "bg-red-50 text-red-800 border-red-300 font-semibold",
};

