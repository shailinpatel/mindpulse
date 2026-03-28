import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindPulse — Remote Therapeutic Monitoring",
  description: "Clinician dashboard for remotely monitoring patients with depression and anxiety between clinic visits.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1a1a2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TooltipProvider>
          <Sidebar />
          <main className="min-h-screen pb-16 lg:ml-60 lg:pb-0">
            {children}
          </main>
          <BottomNav />
        </TooltipProvider>
      </body>
    </html>
  );
}
