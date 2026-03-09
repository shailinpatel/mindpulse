import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
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
          <main className="min-h-screen lg:ml-60">
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
