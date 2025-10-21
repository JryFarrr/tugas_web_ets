"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { ReactNode, useMemo, useState } from "react";

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
    <header className="flex flex-col gap-4 rounded-3xl bg-white/85 p-6 shadow-[0_30px_80px_rgba(249,115,164,0.16)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-rose-300">
            {subtitle}
          </p>
          <h2 className="text-2xl font-semibold text-neutral-800">{headline}</h2>
        </div>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span className="rounded-2xl bg-[#ffeef5] px-4 py-2 font-medium text-rose-400">
            {statusBadge}
          </span>
          <Image
            src={profileImageSrc ?? "https://i.pravatar.cc/80?img=5"}
            alt="Foto profil"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover shadow-lg shadow-rose-200/70"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showSearch ? (
          <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-rose-100 bg-[#ffeef5] px-4 text-sm text-neutral-500 shadow-inner shadow-rose-100/60">
            <span className="inline-flex h-3 w-3 rounded-full border border-rose-400 bg-rose-300/70" />
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
                  chip.active
                    ? "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 text-white shadow-lg shadow-rose-200/80"
                    : "bg-[#ffeef5] text-neutral-500 hover:text-rose-500"
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
