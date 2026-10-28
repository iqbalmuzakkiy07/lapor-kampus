import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { DemoRoleBanner } from "@/components/layout/demo-role-banner";

export const metadata: Metadata = {
  title: "LaporKampus — Layanan Pengaduan & Aspirasi Kampus",
  description:
    "Aplikasi layanan pengaduan dan aspirasi kampus yang aman, transparan, dan terpercaya untuk seluruh civitas akademika.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#F4FAF5] text-[#051F20] antialiased">
        <AuthProvider>
          <DemoRoleBanner />
          <div className="flex-1 flex flex-col">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}

