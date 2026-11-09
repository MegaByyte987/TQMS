import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { env } from "@/lib/env";
import { AppProviders } from "@/providers/app-providers";
import "@/app/globals.css";
import "@/styles/landing.css"; 

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: env.appName,
  description: "Transport Queue Management System — frontend rebuild",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased bg-[var(--color-bg)] text-[var(--color-fg)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}