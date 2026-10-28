"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudentNavbar } from "@/components/layout/student-navbar";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/db";
import { NotificationItem } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { Bell, CheckCheck, FileText, ArrowRight } from "lucide-react";

export default function NotifikasiPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    refreshNotifs();
  }, [user]);

  const refreshNotifs = () => {
    if (user) {
      setNotifications(db.getNotifications(user.id));
    }
  };

  const handleMarkAllRead = () => {
    if (!user) return;
    db.markAllNotificationsAsRead(user.id);
    refreshNotifs();
  };

  const handleClickItem = (item: NotificationItem) => {
    db.markNotificationAsRead(item.id);
    refreshNotifs();
    if (item.complaint_id) {
      router.push(`/pengaduan/${item.complaint_id}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAF5] pb-24 md:pb-12">
      <StudentNavbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#051F20] flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#163832]" />
              <span>Notifikasi</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-[#B42318] text-white px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} Baru
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-[#526B61] mt-0.5">
              Pemberitahuan perubahan status dan tanggapan atas pengaduan Anda.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="gap-1.5 text-xs"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Semua Dibaca</span>
            </Button>
          )}
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-7 h-7" />}
            title="Belum ada notifikasi"
            description="Semua pembaruan penting mengenai perkembangan laporan Anda akan muncul di sini."
          />
        ) : (
          <div className="space-y-2.5">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleClickItem(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  !item.is_read
                    ? "bg-white border-[#163832] ring-1 ring-[#163832]/20 shadow-sm"
                    : "bg-white/80 border-[#8EB69B]/30 hover:bg-white"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    !item.is_read
                      ? "bg-[#DAF1DE] text-[#163832]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-xs sm:text-sm truncate ${
                        !item.is_read
                          ? "font-bold text-[#051F20]"
                          : "font-semibold text-gray-700"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-[#526B61] shrink-0">
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  <p className="text-xs text-[#526B61] leading-relaxed line-clamp-2">
                    {item.message}
                  </p>

                  {item.complaint_id && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#163832] pt-1 hover:underline">
                      <span>Buka Laporan Terkait</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {!item.is_read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#163832] shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

