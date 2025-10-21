"use client";

import { useMemo } from "react";

import { DashboardShell, useDashboardTheme } from "@/components/DashboardShell";

type Tip = {
  id: number;
  title: string;
  category: "PDKT Sehat" | "Pacaran Sehat";
  subtitle: string;
  items: string[];
};

const tips: Tip[] = [
  {
    id: 1,
    title: "Bangun obrolan yang tulus",
    category: "PDKT Sehat",
    subtitle: "Mulai percakapan tanpa tekanan",
    items: [
      "Gunakan pertanyaan terbuka, bukan interogasi.",
      "Responslah dengan empati dan jangan memotong cerita.",
      "Berikan ruang untuk jeda agar lawan bicara ikut nyaman.",
    ],
  },
  {
    id: 2,
    title: "Bikin momen pertama bermakna",
    category: "PDKT Sehat",
    subtitle: "Rencanakan pertemuan yang relevan dengan minatnya",
    items: [
      "Selipkan aktivitas yang mendukung percakapan dua arah.",
      "Hargai batasan personal dan waktu lawan bicara.",
      "Kirim pesan follow-up hangat untuk menutup momen.",
    ],
  },
  {
    id: 3,
    title: "Kelola ekspektasi bersama",
    category: "Pacaran Sehat",
    subtitle: "Bangun hubungan dengan komunikasi transparan",
    items: [
      "Jadwalkan sesi evaluasi ringan tentang kebutuhan dan rasa nyaman.",
      "Gunakan teknik mendengar aktif sebelum memberi solusi.",
      "Setujui cara menyelesaikan konflik agar tetap saling menghormati.",
    ],
  },
  {
    id: 4,
    title: "Jagalah ruang personal",
    category: "Pacaran Sehat",
    subtitle: "Sehat bersama berarti sehat secara individu",
    items: [
      "Ajak pasangan mendukung kegiatan positif masing-masing.",
      "Buat rutinitas quality time yang konsisten namun fleksibel.",
      "Jangan lupa merayakan pencapaian kecil satu sama lain.",
    ],
  },
];

export default function DashboardPage() {
  const { themeName } = useDashboardTheme();
  const isPink = themeName === "pink";

  const categoryStyles = useMemo<Record<Tip["category"], string>>(
    () =>
      isPink
        ? {
            "PDKT Sehat": "bg-[#fff2f6] text-rose-500",
            "Pacaran Sehat": "bg-[#f2f9ff] text-sky-500",
          }
        : {
            "PDKT Sehat": "bg-[#e6f1ff] text-sky-600",
            "Pacaran Sehat": "bg-[#e8ecff] text-indigo-600",
          },
    [isPink],
  );

  const categoryBadgeBorder = useMemo<Record<Tip["category"], string>>(
    () =>
      isPink
        ? {
            "PDKT Sehat": "border border-rose-100",
            "Pacaran Sehat": "border border-sky-100",
          }
        : {
            "PDKT Sehat": "border border-sky-100",
            "Pacaran Sehat": "border border-indigo-100",
          },
    [isPink],
  );

  const articleClassName = useMemo(
    () =>
      isPink
        ? "flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_45px_110px_rgba(249,115,164,0.16)] backdrop-blur transition-colors duration-500"
        : "flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-[0_45px_110px_rgba(79,70,229,0.16)] backdrop-blur transition-colors duration-500",
    [isPink],
  );

  const listItemClassName = useMemo(
    () =>
      isPink
        ? "rounded-2xl border border-rose-50 bg-[#fff7f2] px-4 py-3 shadow-inner shadow-rose-100/60 transition-colors duration-500"
        : "rounded-2xl border border-sky-50 bg-[#f1f6ff] px-4 py-3 shadow-inner shadow-sky-100/60 transition-colors duration-500",
    [isPink],
  );

  return (
    <DashboardShell
      headerChips={[]}
      headerShowSearch={false}
      headerSubtitle="Beranda"
      headerHeadline="Tips hangat untuk PDKT & pacaran sehat"
      headerStatusBadge="Kami bantu jaga hubunganmu tetap nyaman"
    >
      <section className="grid gap-6 lg:grid-cols-2">
        {tips.map((tip) => (
          <article
            key={tip.id}
            className={articleClassName}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={`rounded-full px-4 py-1 text-xs font-semibold ${categoryStyles[tip.category]} ${categoryBadgeBorder[tip.category]}`}
              >
                {tip.category}
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-300">
                Modul #{tip.id.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-neutral-900">
                {tip.title}
              </h2>
              <p className="text-sm text-neutral-500">{tip.subtitle}</p>
            </div>
            <ul className="space-y-3 text-sm text-neutral-600">
              {tip.items.map((item) => (
                <li
                  key={item}
                  className={listItemClassName}
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </DashboardShell>
  );
}
