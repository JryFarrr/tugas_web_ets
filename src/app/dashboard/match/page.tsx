"use client";

import { useMemo, useState } from "react";

import { DashboardShell } from "@/components/DashboardShell";
import { ProfileCard, type Profile } from "@/components/ProfileCard";
import { ProfileDetail } from "@/components/ProfileDetail";

const filterOptions = [
  { id: "age", label: "Age 20-30" },
  { id: "location", label: "Location" },
  { id: "gender", label: "Gender" },
  { id: "status", label: "Status" },
  { id: "online", label: "Online" },
  { id: "more", label: "More Filters" },
] as const;

const matchProfiles: (Profile & { filters: string[] })[] = [
  {
    name: "Mira Amelia",
    age: 25,
    city: "Jakarta",
    compatibility: 95,
    vibe: "Food Story",
    occupation: "Food blogger",
    bio: "Gemar membuat ulasan kafe hangat dan mengeksplor menu plant-based terbaru. Cari partner eksplor kuliner yang nyaman diajak ngobrol panjang.",
    interests: ["Culinary trip", "Food tasting", "Street photography"],
    filters: ["age", "location", "status", "online"],
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Devan Pratama",
    age: 27,
    city: "Bandung",
    compatibility: 92,
    vibe: "Playlist Maker",
    occupation: "Kurator musik",
    bio: "Mengelola playlist untuk ruang kerja kreatif. Suka berbagi lagu baru lengkap dengan cerita di baliknya.",
    interests: ["Vinyl hunting", "Live session", "Bedah lirik"],
    filters: ["age", "online"],
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Raisa Nurain",
    age: 24,
    city: "Depok",
    compatibility: 90,
    vibe: "Cat Mom",
    occupation: "Ilmuwan data",
    bio: "Pecinta kucing dan penikmat board game. Ingin bertemu teman yang santai namun suportif terhadap mimpi kariernya.",
    interests: ["Board game", "Cat cafe", "Coding club"],
    filters: ["age", "status"],
    imageUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Vino Ardi",
    age: 28,
    city: "Surabaya",
    compatibility: 88,
    vibe: "Sunset Hunter",
    occupation: "Videografer perjalanan",
    bio: "Menyusun vlog perjalanan rasa dokumenter. Senang membuat itinerary tipis-tipis bersama orang baru.",
    interests: ["Hiking ringan", "Sunset picnic", "Drone footage"],
    filters: ["location", "status"],
    imageUrl:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kezia L.",
    age: 26,
    city: "Medan",
    compatibility: 86,
    vibe: "Open Mic",
    occupation: "Copywriter",
    bio: "Sering jadi host open mic di komunitas kreatif. Cari teman yang suka spontan dan mendukung ruang berekspresi.",
    interests: ["Open mic", "Creative writing", "Coffee tasting"],
    filters: ["age", "online", "gender"],
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Gilang Adji",
    age: 29,
    city: "Yogyakarta",
    compatibility: 84,
    vibe: "Travel Light",
    occupation: "UX Researcher",
    bio: "Suka merencanakan perjalanan spontan dengan budget tipis. Lagi cari teman tukar itinerari sambil kopi sore.",
    interests: ["Weekend getaway", "UX meetup", "Street food"],
    filters: ["status"],
    imageUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80",
  },
];

export default function MatchPage() {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const filteredProfiles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return matchProfiles.filter((profile) => {
      const matchesSearch = normalized
        ? `${profile.name} ${profile.city} ${profile.vibe}`
            .toLowerCase()
            .includes(normalized)
        : true;

      if (!matchesSearch) {
        return false;
      }

      if (activeFilters.length === 0) {
        return true;
      }

      return activeFilters.every((filter) => profile.filters.includes(filter));
    });
  }, [query, activeFilters]);

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <>
      <DashboardShell
        headerChips={[]}
        headerShowSearch
        headerSearchValue={query}
        onHeaderSearchChange={setQuery}
        headerSearchPlaceholder="Cari nama, kota, atau vibe SoulMatch..."
        headerSubtitle="Match"
        headerHeadline="Temukan pasangan sesuai vibe kamu"
        headerStatusBadge={`${filteredProfiles.length} kandidat ditemukan`}
      >
        <section className="space-y-6">
          <div className="rounded-[36px] border border-white/70 bg-white/90 p-6 shadow-[0_45px_110px_rgba(249,115,164,0.2)] backdrop-blur">
            <h2 className="text-xl font-semibold text-neutral-800">
              Hasil pencarian hangat
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              {filteredProfiles.length > 0
                ? `Menampilkan ${filteredProfiles.length} kecocokan yang siap diajak ngobrol.`
                : "Belum ada nama yang cocok dengan pencarianmu. Coba ketik kata kunci lain."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_25px_70px_rgba(249,115,164,0.12)]">
            <span className="text-sm font-semibold text-neutral-500">Filters</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => {
                const isActive = activeFilters.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      isActive
                        ? "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 text-white shadow-md shadow-rose-200/70"
                        : "bg-[#ffeef5] text-neutral-500 hover:text-rose-500"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.name}
                profile={profile}
                onSelect={setSelectedProfile}
              />
            ))}
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-rose-200 bg-white/80 p-10 text-center text-sm text-neutral-400">
              Tidak ada kecocokan untuk pencarian tersebut. Ubah kata kunci dan
              coba lagi.
            </div>
          ) : null}
        </section>
      </DashboardShell>

      {selectedProfile ? (
        <ProfileDetail
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      ) : null}
    </>
  );
}
