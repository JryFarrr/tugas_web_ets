"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "10k+ Anggota",
    description: "Komunitas hangat yang aktif terhubung setiap hari.",
    icon: "*",
  },
  {
    title: "Kecerdasan Hangat",
    description: "Algoritma cerdas memahami vibe dan mood kamu.",
    icon: "~",
  },
  {
    title: "Match Tepat",
    description: "Lebih dari 90% pengguna menemukan koneksi bermakna.",
    icon: "@",
  },
];

const heroCards = [
  {
    title: "Temukan Cinta",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Ngobrol Nyaman",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Dibuat Dengan Rasa",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
];

const THEMES = {
  pink: {
    background: "bg-gradient-to-br from-[#fef4f7] via-[#fff6ed] to-[#efe8ff]",
    radial: "bg-[radial-gradient(circle_at_20%_15%,#ffffff_0%,#ffeef5_45%,#efe8ff_100%)]",
    blobOne: "bg-gradient-to-br from-[#ffdce9] via-[#ffe3d4] to-[#e7dcff]",
    blobTwo: "bg-gradient-to-br from-[#ffe9f1] via-[#ffeccc] to-[#e6ddff]",
    gradientLogo:
      "bg-[conic-gradient(at_top_left,_#ff8fa3,_#ffad66,_#f694ff,_#ff8fa3)]",
    accentGradient: "from-rose-500 via-rose-400 to-orange-300",
    accentShadow: "shadow-rose-200/70",
    accentText: "text-rose-500",
    accentTextSubtle: "text-rose-400",
    borderAccent: "border-rose-200",
    hoverBorderAccent: "hover:border-rose-400",
    hoverTextAccent: "hover:text-rose-500",
    chipShadow: "shadow-rose-100/70",
    toggleShadow: "shadow-rose-200/60",
    toggleIndicator: "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300",
    heroLabelText: "text-rose-500",
    heroLabelShadow: "shadow-rose-100/70",
    heroSpanShadow: "shadow-rose-200/70",
    ctaButtonGradient: "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300",
    ctaButtonShadow: "shadow-rose-200/70",
    highlightChipText: "text-rose-500",
    heroBadgeText: "text-rose-400",
    heroCardShadowLeft: "shadow-[0_40px_100px_rgba(249,115,164,0.25)]",
    heroCardShadowRight: "shadow-[0_40px_100px_rgba(251,123,124,0.22)]",
    featureShadow: "shadow-[0_45px_120px_rgba(249,115,164,0.12)]",
    footerLink: "text-rose-500",
  },
  blue: {
    background: "bg-gradient-to-br from-[#f2f8ff] via-[#eef4ff] to-[#dfefff]",
    radial: "bg-[radial-gradient(circle_at_20%_15%,#ffffff_0%,#e3f2ff_45%,#dbe7ff_100%)]",
    blobOne: "bg-gradient-to-br from-[#c8e7ff] via-[#d9f1ff] to-[#cdd7ff]",
    blobTwo: "bg-gradient-to-br from-[#d0eaff] via-[#d5f3ff] to-[#c3d6ff]",
    gradientLogo:
      "bg-[conic-gradient(at_top_left,_#60a5fa,_#818cf8,_#38bdf8,_#60a5fa)]",
    accentGradient: "from-sky-500 via-indigo-500 to-blue-600",
    accentShadow: "shadow-sky-200/70",
    accentText: "text-sky-500",
    accentTextSubtle: "text-sky-400",
    borderAccent: "border-sky-200",
    hoverBorderAccent: "hover:border-sky-400",
    hoverTextAccent: "hover:text-sky-500",
    chipShadow: "shadow-sky-100/70",
    toggleShadow: "shadow-sky-200/60",
    toggleIndicator: "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600",
    heroLabelText: "text-sky-500",
    heroLabelShadow: "shadow-sky-100/70",
    heroSpanShadow: "shadow-sky-200/70",
    ctaButtonGradient: "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600",
    ctaButtonShadow: "shadow-sky-200/70",
    highlightChipText: "text-sky-500",
    heroBadgeText: "text-sky-400",
    heroCardShadowLeft: "shadow-[0_40px_100px_rgba(59,130,246,0.25)]",
    heroCardShadowRight: "shadow-[0_40px_100px_rgba(99,102,241,0.22)]",
    featureShadow: "shadow-[0_45px_120px_rgba(56,137,209,0.12)]",
    footerLink: "text-sky-500",
  },
} as const;

type ThemeName = keyof typeof THEMES;

export default function LandingPage() {
  const [themeName, setThemeName] = useState<ThemeName>("pink");
  const theme = THEMES[themeName];

  return (
    <div
      className={`relative min-h-screen overflow-hidden text-neutral-700 ${theme.background}`}
    >
      <div className={`absolute inset-0 -z-10 ${theme.radial}`} />
      <div
        className={`absolute -right-40 top-20 -z-10 h-[720px] w-[720px] rounded-full ${theme.blobOne} blur-[160px]`}
      />
      <div
        className={`absolute -left-56 bottom-[-240px] -z-10 h-[600px] w-[600px] rounded-full ${theme.blobTwo} blur-[150px]`}
      />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-12">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14">
            <span
              className={`absolute inset-0 rounded-[22px] opacity-80 blur-[6px] ${theme.gradientLogo}`}
              aria-hidden
            />
            <div className="relative flex h-full w-full items-center justify-center rounded-[22px] bg-neutral-900/80 text-lg font-semibold text-white shadow-xl">
              SM
            </div>
          </div>
          <p className="hidden text-sm font-semibold text-neutral-700 sm:block">
            Dating dengan hati hangat.
          </p>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex">
          <Link href="#hero" className={`transition ${theme.hoverTextAccent}`}>
            Beranda
          </Link>
          <Link href="#kontak" className={`transition ${theme.hoverTextAccent}`}>
            Kontak
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div
            className={`relative grid h-10 w-28 grid-cols-2 items-center overflow-hidden rounded-full border bg-white/70 text-lg font-semibold ${theme.borderAccent} ${theme.toggleShadow}`}
            aria-label="Pengaturan tema"
          >
            <span
              className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-8px)] rounded-full transition-transform duration-300 ease-out ${theme.toggleIndicator} ${
                themeName === "blue" ? "translate-x-full" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setThemeName("pink")}
              className={`relative z-10 flex items-center justify-center transition-colors ${
                themeName === "pink" ? "text-white" : "text-neutral-500"
              }`}
              aria-pressed={themeName === "pink"}
              aria-label="Tema pink"
            >
              ♀️
            </button>
            <button
              type="button"
              onClick={() => setThemeName("blue")}
              className={`relative z-10 flex items-center justify-center transition-colors ${
                themeName === "blue" ? "text-white" : "text-neutral-500"
              }`}
              aria-pressed={themeName === "blue"}
              aria-label="Tema biru"
            >
              ♂️
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link
              href="/login"
              className={`rounded-full border px-5 py-2 text-neutral-600 transition ${theme.borderAccent} ${theme.hoverBorderAccent} ${theme.hoverTextAccent}`}
            >
              Masuk
            </Link>
            <Link
              href="/signup"
              className={`rounded-full px-5 py-2 text-white shadow-lg transition hover:brightness-105 ${theme.ctaButtonGradient} ${theme.ctaButtonShadow}`}
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      <main
        id="hero"
        className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-8 pb-28"
      >
        <section className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="space-y-10">
            <div
              className={`inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] shadow-sm backdrop-blur ${theme.heroLabelText} ${theme.heroLabelShadow}`}
            >
              Platform Dating Pastel
            </div>

            <div className="space-y-5 text-neutral-800">
              <h1 className="text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                Temukan rasa cocok paling tulus bersama{" "}
                <span
                  className={`inline-block rounded-full px-3 py-1 text-white shadow-sm ${theme.ctaButtonGradient} ${theme.heroSpanShadow}`}
                >
                  SoulMatch
                </span>
              </h1>
              <p className="max-w-xl text-lg text-neutral-500">
                Kami meracik pengalaman yang lembut dan penuh warna agar kamu
                bisa menghapus semua aplikasi dating lain yang bikin penat.
                Cukup satu ruang hangat untuk bertemu mereka yang sefrekuensi.
              </p>
            </div>

            <div className="relative inline-flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className={`rounded-full px-8 py-3 text-sm font-semibold text-white shadow-xl transition hover:brightness-105 ${theme.ctaButtonGradient} ${theme.ctaButtonShadow}`}
              >
                Mulai Eksplor
              </Link>
              <span className="text-sm text-neutral-400">
                Tidak ada swipe tanpa arah, hanya cerita yang berarti.
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-neutral-500">
              <span
                className={`rounded-full bg-white px-3 py-1 font-semibold shadow-sm ${theme.highlightChipText}`}
              >
                Buat janji hangat
              </span>
              <span className="relative flex-1 border-t border-dashed border-neutral-200" />
            </div>
          </div>

          <div className="relative h-[460px]">
            <div className="absolute inset-0 -z-10 rounded-[48px] bg-white/75 blur-3xl" />
            <div
              className={`absolute left-10 top-0 h-[380px] w-[240px] -rotate-6 rounded-[45px] bg-white/85 backdrop-blur ${theme.heroCardShadowLeft}`}
            >
              <Image
                src={heroCards[0].image}
                alt={heroCards[0].title}
                fill
                className="rounded-[45px] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 rounded-[45px] bg-gradient-to-t from-black/55 via-black/0 to-transparent p-6 text-white">
                <p className="text-sm font-semibold">{heroCards[0].title}</p>
              </div>
              <div
                className={`absolute -bottom-7 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full bg-gradient-to-br ${theme.accentGradient} ${theme.accentShadow}`}
              />
            </div>
            <div
              className={`absolute right-0 top-10 h-[380px] w-[240px] rotate-6 rounded-[45px] bg-white/85 backdrop-blur ${theme.heroCardShadowRight}`}
            >
              <Image
                src={heroCards[1].image}
                alt={heroCards[1].title}
                fill
                className="rounded-[45px] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 rounded-[45px] bg-gradient-to-t from-black/55 via-black/0 to-transparent p-6 text-white">
                <p className="text-sm font-semibold">{heroCards[1].title}</p>
              </div>
            </div>
            <div className="absolute left-1/2 top-24 h-[380px] w-[240px] -translate-x-1/2 rotate-3 rounded-[45px] bg-neutral-900 shadow-[0_40px_90px_rgba(17,23,42,0.3)]">
              <Image
                src={heroCards[2].image}
                alt={heroCards[2].title}
                fill
                className="rounded-[45px] object-cover opacity-90"
              />
              <div className="absolute inset-x-0 bottom-0 rounded-[45px] bg-gradient-to-t from-black/65 via-black/0 to-transparent p-6 text-white">
                <p className="text-sm font-semibold">{heroCards[2].title}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`grid gap-6 rounded-3xl bg-white/80 p-10 backdrop-blur-md sm:grid-cols-3 ${theme.featureShadow}`}
        >
          {features.map((feature) => (
            <div key={feature.title} className="space-y-3">
              <span className="text-2xl">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-neutral-800">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-500">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>

      <footer
        id="kontak"
        className="border-t border-neutral-100 bg-white/80 py-10 text-center text-sm text-neutral-400 backdrop-blur"
      >
        <p>
          Hubungi kami di{" "}
          <a
            href="mailto:halo@soulmatch.id"
            className={`font-semibold hover:underline ${theme.footerLink}`}
          >
            halo@soulmatch.id
          </a>{" "}
          atau kunjungi studio kami di Jakarta.
        </p>
      </footer>
    </div>
  );
}
