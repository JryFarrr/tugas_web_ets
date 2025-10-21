import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoulMatch - Dashboard",
  description:
    "Antarmuka SoulMatch dengan gaya pastel lembut untuk pengalaman dating yang hangat dan modern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#fef4f7] via-[#fff7f0] to-[#efe8ff] text-neutral-700`}
      >
        {children}
      </body>
    </html>
  );
}
