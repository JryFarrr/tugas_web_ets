import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
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
        className={`${poppins.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#fef4f7] via-[#fff7f0] to-[#efe8ff] text-neutral-700`}
      >
        {children}
      </body>
    </html>
  );
}
