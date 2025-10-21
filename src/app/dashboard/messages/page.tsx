"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

import { DashboardShell, useDashboardTheme } from "@/components/DashboardShell";

type StageKey = "pdkt" | "getting_to_know" | "relationship";

type MatchStatus = {
  id: string;
  name: string;
  age: number;
  city: string;
  occupation: string;
  photoUrl: string;
  whatsApp: string;
  compatibility: number;
  stage: StageKey;
  online: boolean;
};

const stageOptions: Array<{ key: StageKey; label: string }> = [
  { key: "pdkt", label: "PDKT" },
  { key: "getting_to_know", label: "Pengenalan Mendalam" },
  { key: "relationship", label: "Pacaran" },
];

const initialStatuses: MatchStatus[] = [
  {
    id: "nadhira",
    name: "Nadhira Yusuf",
    age: 26,
    city: "Bandung",
    occupation: "Barista & penulis indie",
    photoUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80",
    whatsApp: "6281355512345",
    compatibility: 94,
    stage: "pdkt",
    online: true,
  },
  {
    id: "bayu",
    name: "Bayu Rahman",
    age: 28,
    city: "Jakarta",
    occupation: "Kurator musik",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    whatsApp: "6281288876543",
    compatibility: 89,
    stage: "getting_to_know",
    online: true,
  },
  {
    id: "salma",
    name: "Salma Nur",
    age: 25,
    city: "Surabaya",
    occupation: "Desainer interior",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    whatsApp: "6281299322211",
    compatibility: 92,
    stage: "relationship",
    online: true,
  },
  {
    id: "rafi",
    name: "Rafi Adrian",
    age: 29,
    city: "Yogyakarta",
    occupation: "Videografer",
    photoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    whatsApp: "6281399988776",
    compatibility: 87,
    stage: "pdkt",
    online: false,
  },
  {
    id: "tasya",
    name: "Tasya Lintang",
    age: 24,
    city: "Depok",
    occupation: "Product Researcher",
    photoUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    whatsApp: "6281312345567",
    compatibility: 90,
    stage: "getting_to_know",
    online: true,
  },
  {
    id: "nabil",
    name: "Nabil Hakim",
    age: 27,
    city: "Jakarta",
    occupation: "Produser podcast",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    whatsApp: "6281333312345",
    compatibility: 88,
    stage: "pdkt",
    online: true,
  },
];

const stageColors: Record<StageKey, string> = {
  pdkt: "bg-[#fff7f2] text-rose-500 border border-rose-100",
  getting_to_know: "bg-[#f2f9ff] text-sky-500 border border-sky-100",
  relationship: "bg-[#f4fff2] text-emerald-500 border border-emerald-100",
};

export default function MessagesPage() {
  return (
    <DashboardShell
      headerChips={[]}
      headerShowSearch={false}
      headerSubtitle="Match Status"
      headerHeadline="Kelola progress hubunganmu"
      headerStatusBadge={`${initialStatuses.length} kandidat yang aktif`}
    >
      <MessagesContent />
    </DashboardShell>
  );
}

function MessagesContent() {
  const [statuses, setStatuses] = useState(initialStatuses);
  const { themeName } = useDashboardTheme();
  const isPink = themeName === "pink";

  const styles = useMemo(
    () =>
      isPink
        ? {
            infoCard:
              "rounded-[32px] border border-white/70 bg-gradient-to-br from-[#fff6fc] via-white to-[#ffe9f4] p-6 shadow-[0_45px_110px_rgba(249,115,164,0.16)] backdrop-blur transition-colors duration-500",
            profileCard:
              "flex flex-col gap-4 rounded-[28px] border border-white/70 bg-gradient-to-br from-[#fff5fa] via-white to-[#ffe9f3] p-5 shadow-[0_35px_90px_rgba(249,115,164,0.18)] backdrop-blur transition-colors duration-500",
            imageOverlay: "bg-gradient-to-t from-[#ffe6f4] via-transparent to-transparent",
            whatsappButton:
              "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-rose-200/70 transition hover:brightness-110",
            stageInactive:
              "bg-[#ffeef5] text-neutral-500 hover:text-rose-500",
          }
        : {
            infoCard:
              "rounded-[32px] border border-white/70 bg-gradient-to-br from-[#e3f1ff] via-white to-[#d9e8ff] p-6 shadow-[0_45px_110px_rgba(79,70,229,0.18)] backdrop-blur transition-colors duration-500",
            profileCard:
              "flex flex-col gap-4 rounded-[28px] border border-white/75 bg-gradient-to-br from-[#e7f2ff] via-white to-[#d7e7ff] p-5 shadow-[0_35px_90px_rgba(79,70,229,0.16)] backdrop-blur transition-colors duration-500",
            imageOverlay: "bg-gradient-to-t from-[#d8ecff] via-transparent to-transparent",
            whatsappButton:
              "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-sky-200/70 transition hover:brightness-110",
            stageInactive:
              "bg-[#e5f2ff] text-neutral-500 hover:text-sky-600",
          },
    [isPink],
  );

  const handleStageChange = (id: string, newStage: StageKey) => {
    setStatuses((prev) =>
      prev.map((status) =>
        status.id === id ? { ...status, stage: newStage } : status,
      ),
    );
  };

  return (
    <section className="space-y-6">
      <div className={styles.infoCard}>
        <h2 className="text-xl font-semibold text-neutral-900">
          Pantau perkembangan setiap pasangan potensial
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Kamu bisa memperbarui status hubungan, menyapa via WhatsApp, dan
          melihat kecocokan secara cepat.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {statuses.map((match) => {
          const stageOption = stageOptions.find(
            (option) => option.key === match.stage,
          );

          return (
            <article key={match.id} className={styles.profileCard}>
              <div className="relative h-40 w-full overflow-hidden rounded-3xl">
                <Image
                  src={match.photoUrl}
                  alt={match.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
                <div className={`absolute inset-0 ${styles.imageOverlay}`} />
              </div>

              <header className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {match.name}, {match.age}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-500">
                    {match.compatibility}% cocok
                  </span>
                </div>
                <p className="text-sm text-neutral-500">
                  {match.city} - {match.occupation}
                </p>
              </header>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <span className={`inline-block h-2 w-2 rounded-full ${match.online ? "bg-emerald-500" : "bg-neutral-400"}`} />
                  {match.online ? "Online" : "Offline"}
                </span>
                <Link
                  href={`https://wa.me/${match.whatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappButton}
                >
                  Kontak WA
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-300">
                  Status hubungan
                </span>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${stageColors[match.stage]}`}
                >
                  {stageOption?.label ?? "Belum diatur"}
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  Ubah status:
                  <div className="flex flex-wrap gap-2">
                    {stageOptions.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => handleStageChange(match.id, option.key)}
                        className={`rounded-full px-3 py-1 transition ${
                          option.key === match.stage
                            ? styles.whatsappButton
                            : styles.stageInactive
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}


