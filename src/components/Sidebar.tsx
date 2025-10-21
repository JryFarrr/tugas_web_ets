"use client";

import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  matchPath: string;
  badge?: string;
};

const navItems: NavItem[] = [
  { label: "Beranda", href: "/dashboard", matchPath: "/dashboard", badge: "aktif" },
  { label: "Kecocokan", href: "/dashboard/match", matchPath: "/dashboard/match" },
  { label: "Pesan", href: "/dashboard/messages", matchPath: "/dashboard/messages" },
  { label: "Profil", href: "/dashboard/profile", matchPath: "/dashboard/profile" },
];

type SidebarProps = {
  theme: "pink" | "blue";
  onThemeChange: Dispatch<SetStateAction<"pink" | "blue">>;
  themeStyles: {
    sidebarBg: string;
    sidebarShadow: string;
    sidebarBadge: string;
    brandText: string;
    toggleIndicator: string;
    toggleShadow: string;
    buttonBorder: string;
    buttonHoverBorder: string;
    buttonHoverText: string;
  };
};

const ACTIVE_LINK_GRADIENT = {
  pink: "bg-gradient-to-r from-[#ffe3ee] via-[#ffe9d6] to-transparent",
  blue: "bg-gradient-to-r from-[#dbeaff] via-[#d6edff] to-transparent",
};

const INACTIVE_LINK_HOVER = {
  pink: "hover:bg-[#ffeef5]/80",
  blue: "hover:bg-[#e8f3ff]/80",
};

const DOT_GRADIENT = {
  pink: "bg-gradient-to-br from-rose-500 via-rose-400 to-orange-300 shadow-[0_0_0_3px_rgba(255,233,240,0.7)]",
  blue: "bg-gradient-to-br from-sky-500 via-indigo-500 to-blue-600 shadow-[0_0_0_3px_rgba(218,234,255,0.7)]",
};

const BADGE_COLOR = {
  pink: "text-rose-400",
  blue: "text-sky-500",
};

const PREMIUM_CARD = {
  pink: "bg-[#fff2f6]/90 shadow-inner shadow-rose-100/60",
  blue: "bg-[#e9f4ff]/90 shadow-inner shadow-sky-100/60",
};

export function Sidebar({ theme, onThemeChange, themeStyles }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex w-[260px] flex-col gap-12 rounded-[36px] p-7 text-sm text-neutral-600 backdrop-blur transition-colors duration-500 ${themeStyles.sidebarBg} ${themeStyles.sidebarShadow}`}
    >
      <div className="space-y-2 text-neutral-700">
        <h1
          className={`text-2xl font-extrabold tracking-tight ${themeStyles.brandText}`}
        >
          SoulMatch
        </h1>
        <p className="text-xs text-neutral-500">
          Temukan koneksi baru dan obrolan yang hangat setiap hari.
        </p>
      </div>

      <div
        className={`relative grid h-10 w-full grid-cols-2 items-center overflow-hidden rounded-full border bg-white/70 text-lg font-semibold transition-colors duration-500 ${themeStyles.buttonBorder} ${themeStyles.toggleShadow}`}
        aria-label="Pengaturan tema dashboard"
      >
        <span
          className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-8px)] rounded-full transition-transform duration-300 ease-out ${themeStyles.toggleIndicator} ${
            theme === "blue" ? "translate-x-full" : ""
          }`}
        />
        <button
          type="button"
          onClick={() => onThemeChange("pink")}
          className={`relative z-10 flex items-center justify-center text-sm transition-colors ${
            theme === "pink" ? "text-white" : "text-neutral-500"
          }`}
          aria-pressed={theme === "pink"}
          aria-label="Tema pink"
        >
          {"\u2640"}
        </button>
        <button
          type="button"
          onClick={() => onThemeChange("blue")}
          className={`relative z-10 flex items-center justify-center text-sm transition-colors ${
            theme === "blue" ? "text-white" : "text-neutral-500"
          }`}
          aria-pressed={theme === "blue"}
          aria-label="Tema biru"
        >
          {"\u2642"}
        </button>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const isActive =
            item.matchPath === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.matchPath);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                isActive
                  ? `${ACTIVE_LINK_GRADIENT[theme]} text-neutral-800 shadow-sm`
                  : `${INACTIVE_LINK_HOVER[theme]} hover:text-neutral-700`
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`inline-flex h-2.5 w-2.5 items-center justify-center rounded-full transition-colors ${DOT_GRADIENT[theme]}`}
                />
                {item.label}
              </span>
              {item.badge ? (
                <span className={`text-[10px] font-medium ${BADGE_COLOR[theme]}`}>
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div
        className={`rounded-2xl p-5 text-neutral-700 transition-colors duration-500 ${PREMIUM_CARD[theme]}`}
      >
        <h2 className="text-sm font-semibold text-neutral-900">
          Rencana Premium
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          Tingkatkan peluang bertemu pasangan yang sefrekuensi dengan akses
          filter dan rekomendasi eksklusif.
        </p>
        <button
          className={`mt-5 w-full rounded-xl py-2 text-xs font-semibold text-white shadow-lg transition hover:opacity-90 ${themeStyles.toggleIndicator} ${themeStyles.toggleShadow}`}
        >
          Upgrade Sekarang
        </button>
      </div>
    </aside>
  );
}
