"use client";

import { useMemo, useState } from "react";

import { DashboardShell, useDashboardTheme } from "@/components/DashboardShell";
import { ProfileCard, type Profile } from "@/components/ProfileCard";
import { ProfileDetail } from "@/components/ProfileDetail";

type DropdownFilterId = "age" | "location" | "occupation" | "interest";

type FilterOption =
  | { id: DropdownFilterId; label: string; type: "dropdown"; options: string[] }
  | { id: "online"; label: string; type: "toggle" };

const AGE_RANGES = [
  "Semua",
  "15-20",
  "20-25",
  "25-30",
  "30-35",
  "35-40",
  "40-45",
  "45-50",
];

const LOCATION_OPTIONS = [
  "Semua",
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Medan",
  "Depok",
  "Bogor",
  "Semarang",
  "Makassar",
];

const OCCUPATION_OPTIONS = [
  "Semua",
  "Kuliner",
  "Musik",
  "Teknologi",
  "Desain",
  "Konten",
  "Mahasiswa",
  "Riset",
  "Videografer",
];

const INTEREST_OPTIONS = [
  "Semua",
  "Kuliner",
  "Musik",
  "Outdoor",
  "Teknologi",
  "Seni",
  "Travel",
  "Permainan",
];

const filterOptions: FilterOption[] = [
  { id: "age", label: "Umur", type: "dropdown", options: AGE_RANGES },
  { id: "location", label: "Lokasi", type: "dropdown", options: LOCATION_OPTIONS },
  { id: "occupation", label: "Pekerjaan", type: "dropdown", options: OCCUPATION_OPTIONS },
  { id: "interest", label: "Interest", type: "dropdown", options: INTEREST_OPTIONS },
  { id: "online", label: "Online", type: "toggle" },
];

type MatchProfile = Profile & {
  city: string;
  age: number;
  occupation: string;
  occupationTag: string;
  interestTag: string;
  online: boolean;
};

const rawProfiles: Array<Omit<MatchProfile, "age"> & { age: number }> = [
  {
    name: "Mira Amelia",
    age: 25,
    city: "Jakarta",
    compatibility: 95,
    vibe: "Food Story",
    occupation: "Food blogger",
    occupationTag: "Kuliner",
    interestTag: "Kuliner",
    online: true,
    bio: "Gemar membuat ulasan kafe hangat dan mengeksplor menu plant-based terbaru. Cari partner eksplor kuliner yang nyaman diajak ngobrol panjang.",
    interests: ["Culinary trip", "Food tasting", "Street photography"],
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
    occupationTag: "Musik",
    interestTag: "Musik",
    online: true,
    bio: "Mengelola playlist untuk ruang kerja kreatif. Suka berbagi lagu baru lengkap dengan cerita di baliknya.",
    interests: ["Vinyl hunting", "Live session", "Bedah lirik"],
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
    occupationTag: "Teknologi",
    interestTag: "Permainan",
    online: false,
    bio: "Pecinta kucing dan penikmat board game. Ingin bertemu teman yang santai namun suportif terhadap mimpi kariernya.",
    interests: ["Board game", "Cat cafe", "Coding club"],
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
    occupationTag: "Videografer",
    interestTag: "Outdoor",
    online: true,
    bio: "Menyusun vlog perjalanan rasa dokumenter. Senang membuat itinerary tipis-tipis bersama orang baru.",
    interests: ["Hiking ringan", "Sunset picnic", "Drone footage"],
    imageUrl:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kezia L.",
    age: 26,
    city: "Medan",
    compatibility: 86,
    vibe: "Open Mic",
    occupation: "Mahasiswa komunikasi",
    occupationTag: "Mahasiswa",
    interestTag: "Seni",
    online: true,
    bio: "Sering jadi host open mic di komunitas kreatif. Cari teman yang suka spontan dan mendukung ruang berekspresi.",
    interests: ["Open mic", "Creative writing", "Coffee tasting"],
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
    occupationTag: "Riset",
    interestTag: "Travel",
    online: false,
    bio: "Suka merencanakan perjalanan spontan dengan budget tipis. Lagi cari teman tukar itinerari sambil kopi sore.",
    interests: ["Weekend getaway", "UX meetup", "Street food"],
    imageUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80",
  },
];

const matchProfiles: MatchProfile[] = rawProfiles;

type SelectedFilters = {
  age: string;
  location: string;
  occupation: string;
  interest: string;
  online: boolean;
};

const DEFAULT_FILTERS: SelectedFilters = {
  age: "",
  location: "",
  occupation: "",
  interest: "",
  online: false,
};

function ageMatchesRange(age: number, range: string) {
  if (!range) return true;
  const [min, max] = range.split("-").map(Number);
  if (Number.isNaN(min) || Number.isNaN(max)) return true;
  return age >= min && age <= max;
}

export default function MatchPage() {
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    DEFAULT_FILTERS,
  );
  const [openDropdown, setOpenDropdown] = useState<DropdownFilterId | null>(
    null,
  );
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

      if (!ageMatchesRange(profile.age, selectedFilters.age)) {
        return false;
      }

      if (
        selectedFilters.location &&
        profile.city.toLowerCase() !== selectedFilters.location.toLowerCase()
      ) {
        return false;
      }

      if (
        selectedFilters.occupation &&
        profile.occupationTag.toLowerCase() !==
          selectedFilters.occupation.toLowerCase()
      ) {
        return false;
      }

      if (
        selectedFilters.interest &&
        profile.interestTag.toLowerCase() !==
          selectedFilters.interest.toLowerCase()
      ) {
        return false;
      }

      if (selectedFilters.online && !profile.online) {
        return false;
      }

      return true;
    });
  }, [query, selectedFilters]);

  const handleDropdownSelect = (id: DropdownFilterId, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [id]: value === "Semua" ? "" : value,
    }));
    setOpenDropdown(null);
  };

  const handleToggleOnline = () => {
    setSelectedFilters((prev) => ({ ...prev, online: !prev.online }));
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
        <MatchContent
          filteredProfiles={filteredProfiles}
          selectedFilters={selectedFilters}
          openDropdown={openDropdown}
          onOpenDropdownChange={setOpenDropdown}
          onDropdownSelect={handleDropdownSelect}
          onToggleOnline={handleToggleOnline}
          onSelectProfile={setSelectedProfile}
        />
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

type MatchContentProps = {
  filteredProfiles: MatchProfile[];
  selectedFilters: SelectedFilters;
  openDropdown: DropdownFilterId | null;
  onOpenDropdownChange: (id: DropdownFilterId | null) => void;
  onDropdownSelect: (id: DropdownFilterId, value: string) => void;
  onToggleOnline: () => void;
  onSelectProfile: (profile: Profile) => void;
};

function MatchContent({
  filteredProfiles,
  selectedFilters,
  openDropdown,
  onOpenDropdownChange,
  onDropdownSelect,
  onToggleOnline,
  onSelectProfile,
}: MatchContentProps) {
  const { themeName } = useDashboardTheme();
  const isPink = themeName === "pink";

  const styles = useMemo(
    () =>
      isPink
        ? {
            summaryCard:
              "rounded-[36px] border border-white/70 bg-gradient-to-br from-[#fff6fc] via-white to-[#ffe9f4] p-6 shadow-[0_45px_110px_rgba(249,115,164,0.2)] backdrop-blur transition-colors duration-500",
            filterBar:
              "flex flex-wrap items-center gap-3 rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_25px_70px_rgba(249,115,164,0.12)] transition-colors duration-500",
            filterInactive:
              "bg-[#ffeef5] text-neutral-500 hover:text-rose-500",
            filterActive:
              "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 text-white shadow-md shadow-rose-200/70",
            emptyState:
              "rounded-3xl border border-dashed border-rose-200 bg-white/80 p-10 text-center text-sm text-neutral-400 transition-colors duration-500",
          }
        : {
            summaryCard:
              "rounded-[36px] border border-white/70 bg-gradient-to-br from-[#e3f1ff] via-white to-[#d9e8ff] p-6 shadow-[0_45px_110px_rgba(79,70,229,0.18)] backdrop-blur transition-colors duration-500",
            filterBar:
              "flex flex-wrap items-center gap-3 rounded-[24px] border border-white/70 bg-gradient-to-r from-[#e2efff] via-white to-[#e6f2ff] px-5 py-4 shadow-[0_25px_70px_rgba(79,70,229,0.12)] transition-colors duration-500",
            filterInactive:
              "bg-[#e5f2ff] text-neutral-500 hover:text-sky-600",
            filterActive:
              "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 text-white shadow-md shadow-sky-200/70",
            emptyState:
              "rounded-3xl border border-dashed border-sky-200 bg-white/85 p-10 text-center text-sm text-neutral-400 transition-colors duration-500",
          },
    [isPink],
  );

  const currentDropdownOptions =
    openDropdown &&
    (filterOptions.find(
      (option) => option.type === "dropdown" && option.id === openDropdown,
    ) as Extract<FilterOption, { type: "dropdown" }> | undefined);

  return (
    <section className="space-y-6 transition-colors duration-500">
      <div className={styles.summaryCard}>
        <h2 className="text-xl font-semibold text-neutral-800">
          Hasil pencarian hangat
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          {filteredProfiles.length > 0
            ? `Menampilkan ${filteredProfiles.length} kecocokan yang siap diajak ngobrol.`
            : "Belum ada nama yang cocok dengan pencarianmu. Coba ketik kata kunci lain."}
        </p>
      </div>

      <div className="space-y-3">
        <div className={styles.filterBar}>
          <span className="text-sm font-semibold text-neutral-500">
            Filters
          </span>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => {
              if (filter.type === "toggle") {
                const isActive = selectedFilters.online;
                return (
                  <button
                    key={filter.id}
                    onClick={onToggleOnline}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${isActive ? styles.filterActive : styles.filterInactive}`}
                  >
                    {filter.label}
                  </button>
                );
              }

              const value = selectedFilters[filter.id];
              const displayLabel = value
                ? `${filter.label}: ${value}`
                : filter.label;
              const isActive = Boolean(value);

              return (
                <button
                  key={filter.id}
                  onClick={() =>
                    onOpenDropdownChange(
                      openDropdown === filter.id ? null : filter.id,
                    )
                  }
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${isActive ? styles.filterActive : styles.filterInactive}`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        </div>

        {currentDropdownOptions ? (
          <div className="flex flex-wrap gap-2 rounded-[20px] border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
            {currentDropdownOptions.options.map((option) => (
              <button
                key={option}
                onClick={() => onDropdownSelect(currentDropdownOptions.id, option)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedFilters[currentDropdownOptions.id] ===
                    (option === "Semua" ? "" : option)
                    ? styles.filterActive
                    : styles.filterInactive
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProfiles.map((profile) => (
          <ProfileCard
            key={profile.name}
            profile={profile}
            onSelect={onSelectProfile}
          />
        ))}
      </div>

      {filteredProfiles.length === 0 ? (
        <div className={styles.emptyState}>
          Tidak ada kecocokan untuk pencarian tersebut. Ubah kata kunci dan coba
          lagi.
        </div>
      ) : null}
    </section>
  );
}

