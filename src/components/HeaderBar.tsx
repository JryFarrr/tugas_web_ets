"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { ReactNode, useMemo, useState } from "react";

import { useDashboardTheme } from "@/components/DashboardShell";

export type HeaderChip = {
  id: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

type HeaderBarProps = {
  trailing?: ReactNode;
  chips?: HeaderChip[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  headline?: string;
  subtitle?: string;
  statusBadge?: string;
  showSearch?: boolean;
  profileImageSrc?: string | StaticImageData;
};

const defaultChips: HeaderChip[] = [
  { id: "all", label: "Semua", active: true },
  { id: "nearby", label: "Dekat" },
  { id: "online", label: "Online" },
  { id: "new", label: "Baru" },
];

export function HeaderBar({
  trailing,
  chips,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari kecocokan berdasarkan minat...",
  headline = "Hai, Farah! Siap ketemu kecocokan baru?",
  subtitle = "Sapaan Hari Ini",
  statusBadge = "8 teman online",
  showSearch = true,
  profileImageSrc,
}: HeaderBarProps) {
  const [localSearch, setLocalSearch] = useState("");
  const { themeName } = useDashboardTheme();
  const isPink = themeName === "pink";

  const styles = isPink
    ? {
        header:
          "flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-[#fff6fc] via-white to-[#ffe9f4] p-6 shadow-[0_30px_80px_rgba(249,115,164,0.16)] backdrop-blur transition-colors duration-500",
        subtitle: "text-xs uppercase tracking-[0.35em] text-rose-300",
        badge:
          "rounded-2xl bg-[#ffeef5] px-4 py-2 font-medium text-rose-400 transition-colors duration-500",
        avatarShadow: "shadow-rose-200/70",
        search:
          "flex h-12 flex-1 items-center gap-3 rounded-2xl border border-rose-100 bg-[#ffeef5] px-4 text-sm text-neutral-500 shadow-inner shadow-rose-100/60 transition-colors duration-500",
        searchDot:
          "inline-flex h-3 w-3 rounded-full border border-rose-400 bg-rose-300/70",
        chipActive:
          "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 text-white shadow-lg shadow-rose-200/80",
        chipInactive: "bg-[#ffeef5] text-neutral-500 hover:text-rose-500",
      }
    : {
        header:
          "flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-[#edf4ff] via-white to-[#dfe9ff] p-6 shadow-[0_30px_80px_rgba(79,70,229,0.18)] backdrop-blur transition-colors duration-500",
        subtitle: "text-xs uppercase tracking-[0.35em] text-sky-400",
        badge:
          "rounded-2xl bg-[#e6f1ff] px-4 py-2 font-medium text-sky-500 transition-colors duration-500",
        avatarShadow: "shadow-sky-200/70",
        search:
          "flex h-12 flex-1 items-center gap-3 rounded-2xl border border-sky-100 bg-[#e8f4ff] px-4 text-sm text-neutral-500 shadow-inner shadow-sky-100/60 transition-colors duration-500",
        searchDot:
          "inline-flex h-3 w-3 rounded-full border border-sky-400 bg-sky-300/70",
        chipActive:
          "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 text-white shadow-lg shadow-sky-200/80",
        chipInactive: "bg-[#e8f4ff] text-neutral-500 hover:text-sky-600",
      };

  const chipList = useMemo(() => chips ?? defaultChips, [chips]);
  const resolvedSearchValue =
    searchValue !== undefined ? searchValue : localSearch;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setLocalSearch(value);
    }
  };

  return (
    <header className={styles.header}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className={styles.subtitle}>
            {subtitle}
          </p>
          <h2 className="text-2xl font-semibold text-neutral-800">{headline}</h2>
        </div>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span className={styles.badge}>
            {statusBadge}
          </span>
          <Image
            src={profileImageSrc ?? "https://i.pravatar.cc/80?img=5"}
            alt="Foto profil"
            width={44}
            height={44}
            className={`h-11 w-11 rounded-full object-cover shadow-lg ${styles.avatarShadow}`}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showSearch ? (
          <div className={styles.search}>
            <span className={styles.searchDot} />
            <input
              value={resolvedSearchValue}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="h-full w-full bg-transparent text-neutral-700 outline-none placeholder:text-neutral-400"
              placeholder={searchPlaceholder}
            />
          </div>
        ) : null}
        {chipList.length ? (
          <div className="flex gap-2">
            {chipList.map((chip) => (
              <button
                key={chip.id}
                onClick={chip.onClick}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  chip.active ? styles.chipActive : styles.chipInactive
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        ) : null}
        {trailing}
      </div>
    </header>
  );
}
