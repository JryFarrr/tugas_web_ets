"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { DashboardShell, useDashboardTheme } from "@/components/DashboardShell";
import { ProfileCard, type Profile } from "@/components/ProfileCard";
import { ProfileDetail } from "@/components/ProfileDetail";
import { supabase } from "@/lib/supabaseClient";

type DropdownFilterId = "age" | "location" | "pekerjaan" | "interest";

type DropdownFilterOption = {
  id: DropdownFilterId;
  label: string;
  type: "dropdown";
  options: string[];
  allowCustom?: boolean;
  customPlaceholder?: string;
};

type FilterOption = DropdownFilterOption | { id: "online"; label: string; type: "toggle" };

const AGE_RANGES = [
  "Semua",
  "18-22",
  "23-27",
  "28-32",
  "33-37",
  "38-42",
  "43-47",
  "48-52",
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

const PEKERJAAN_OPTIONS = [
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
  {
    id: "location",
    label: "Lokasi",
    type: "dropdown",
    options: LOCATION_OPTIONS,
    allowCustom: true,
    customPlaceholder: "Ketik kota lain...",
  },
  {
    id: "pekerjaan",
    label: "Pekerjaan",
    type: "dropdown",
    options: PEKERJAAN_OPTIONS,
    allowCustom: true,
    customPlaceholder: "Cari pekerjaan lain...",
  },
  {
    id: "interest",
    label: "Interest",
    type: "dropdown",
    options: INTEREST_OPTIONS,
    allowCustom: true,
    customPlaceholder: "Ketik interest lain...",
  },
  { id: "online", label: "Online", type: "toggle" },
];

type ApiProfile = {
  id: string;
  name: string | null;
  age: number | null;
  city: string | null;
  pekerjaan: string | null;
  interests: string[] | null;
  about: string | null;
  mainPhoto: string | null;
};

type MatchProfile = Profile & {
  id: string;
  city: string;
  age: number;
  pekerjaan: string | null;
  interests: string[];
  about: string | null;
  interestTag: string;
  online: boolean;
};

type SelectedFilters = {
  age: string;
  location: string;
  pekerjaan: string;
  interest: string;
  online: boolean;
};

const DEFAULT_FILTERS: SelectedFilters = {
  age: "",
  location: "",
  pekerjaan: "",
  interest: "",
  online: false,
};

const FALLBACK_IMAGE = "https://i.pravatar.cc/320";

function computeCompatibility(seed: string) {
  let hash = 0;
  for (const char of seed) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return 70 + Math.abs(hash % 25);
}

function computeOnline(seed: string) {
  let hash = 0;
  for (const char of seed) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 2) === 1;
}

function transformProfile(profile: ApiProfile): MatchProfile {
  const interests = Array.isArray(profile.interests) ? profile.interests : [];
  const age = profile.age && profile.age > 0 ? profile.age : 25;
  const interestTag = interests[0] ?? "SoulMatch";
  const vibe = profile.pekerjaan ?? "SoulMatch";

  return {
    id: profile.id,
    name: profile.name ?? "Pengguna SoulMatch",
    age,
    city: profile.city ?? "Lokasi belum diatur",
    compatibility: computeCompatibility(profile.id),
    vibe,
    imageUrl: profile.mainPhoto ?? `${FALLBACK_IMAGE}?u=${profile.id}`,
    occupation: profile.pekerjaan ?? undefined,
    pekerjaan: profile.pekerjaan,
    interests,
    about: profile.about,
    interestTag,
    online: computeOnline(profile.id),
  };
}

function ageMatchesRange(age: number, range: string) {
  if (!range) return true;
  if (range.toLowerCase() === "semua") return true;
  const [min, max] = range.split("-").map(Number);
  if (Number.isNaN(min) || Number.isNaN(max)) return true;
  return age >= min && age <= max;
}

export default function MatchPage() {
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(DEFAULT_FILTERS);
  const [openDropdown, setOpenDropdown] = useState<DropdownFilterId | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [customInputs, setCustomInputs] = useState<Record<DropdownFilterId, string>>({
    age: "",
    location: "",
    pekerjaan: "",
    interest: "",
  });
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;

    async function loadProfiles() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        if (!cancelled) {
          setProfiles([]);
          setError("Sesi tidak ditemukan. Silakan login kembali.");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/match/profiles", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.message ?? "Gagal memuat data profil.");
        }

        const payload = (await response.json()) as { profiles?: ApiProfile[] };
        const mapped = (payload.profiles ?? []).map(transformProfile);
        const filtered = mapped.filter((profile) => profile.id !== session.user.id);
        if (!cancelled) {
          setProfiles(filtered);
        }
      } catch (err) {
        if (!cancelled) {
          setProfiles([]);
          setError(err instanceof Error ? err.message : "Gagal memuat data profil.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfiles();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProfiles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return profiles.filter((profile) => {
      const matchesSearch = normalized
        ? `${profile.name} ${profile.city} ${profile.vibe}`.toLowerCase().includes(normalized)
        : true;

      if (!matchesSearch) {
        return false;
      }

      if (!ageMatchesRange(profile.age, selectedFilters.age)) {
        return false;
      }

      if (selectedFilters.location) {
        const target = selectedFilters.location.toLowerCase();
        if (!profile.city.toLowerCase().includes(target)) {
          return false;
        }
      }

      if (selectedFilters.pekerjaan) {
        const target = selectedFilters.pekerjaan.toLowerCase();
        const jobSources = [profile.pekerjaan, profile.occupation];
        const matchesJob = jobSources.some((source) => source?.toLowerCase().includes(target));
        if (!matchesJob) {
          return false;
        }
      }

      if (selectedFilters.interest) {
        const target = selectedFilters.interest.toLowerCase();
        const interestSources = [profile.interestTag, ...profile.interests];
        const matchesInterest = interestSources.some((source) => source?.toLowerCase().includes(target));
        if (!matchesInterest) {
          return false;
        }
      }

      if (selectedFilters.online && !profile.online) {
        return false;
      }

      return true;
    });
  }, [profiles, query, selectedFilters]);

  const handleDropdownSelect = (id: DropdownFilterId, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [id]: value === "Semua" ? "" : value,
    }));
    setCustomInputs((prev) => ({ ...prev, [id]: "" }));
    setOpenDropdown(null);
  };

  const handleCustomInputChange = (id: DropdownFilterId, value: string) => {
    setCustomInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleApplyCustom = (id: DropdownFilterId) => {
    const trimmed = customInputs[id].trim();
    setSelectedFilters((prev) => ({
      ...prev,
      [id]: trimmed,
    }));
    setOpenDropdown(null);
  };

  const handleClearFilter = (id: DropdownFilterId) => {
    setSelectedFilters((prev) => ({ ...prev, [id]: "" }));
    setCustomInputs((prev) => ({ ...prev, [id]: "" }));
    setOpenDropdown(null);
  };

  const handleToggleOnline = () => {
    setSelectedFilters((prev) => ({ ...prev, online: !prev.online }));
  };

  const handleMessageProfile = useCallback(
    async (profile: MatchProfile) => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token || !profile.id) {
          router.push("/dashboard/messages");
          return;
        }

        const response = await fetch("/api/messages/open", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetUserId: profile.id }),
        });

        if (!response.ok) {
          throw new Error("Gagal membuka percakapan.");
        }

        const { conversationId } = (await response.json()) as {
          conversationId: string;
        };

        if (conversationId) {
          router.push(`/dashboard/messages?chat=${conversationId}`);
        } else {
          router.push("/dashboard/messages");
        }
      } catch (err) {
        console.error("[MatchPage] handleMessageProfile", err);
        router.push("/dashboard/messages");
      }
    },
    [router],
  );

  return (
    <DashboardShell
      headerChips={[]}
      headerShowSearch
      headerSearchValue={query}
      onHeaderSearchChange={setQuery}
      headerSearchPlaceholder="Cari nama, kota, atau vibe SoulMatch..."
      headerSubtitle="Match"
      headerHeadline="Temukan pasangan sesuai vibe kamu"
      headerStatusBadge={
        loading
          ? "Memuat kandidat..."
          : error
          ? "Gagal memuat kandidat"
          : `${filteredProfiles.length} kandidat ditemukan`
      }
    >
      <MatchContent
        loading={loading}
        error={error}
        filteredProfiles={filteredProfiles}
        selectedFilters={selectedFilters}
        openDropdown={openDropdown}
        onOpenDropdownChange={setOpenDropdown}
        onDropdownSelect={handleDropdownSelect}
        onToggleOnline={handleToggleOnline}
        onSelectProfile={setSelectedProfile}
        onMessageProfile={handleMessageProfile}
        customInputs={customInputs}
        onCustomInputChange={handleCustomInputChange}
        onApplyCustom={handleApplyCustom}
        onClearFilter={handleClearFilter}
        selectedProfile={selectedProfile}
        onCloseProfile={() => setSelectedProfile(null)}
        isEmpty={!profiles.length && !loading && !error}
      />
    </DashboardShell>
  );
}

type MatchContentProps = {
  loading: boolean;
  error: string | null;
  filteredProfiles: MatchProfile[];
  selectedFilters: SelectedFilters;
  openDropdown: DropdownFilterId | null;
  onOpenDropdownChange: (id: DropdownFilterId | null) => void;
  onDropdownSelect: (id: DropdownFilterId, value: string) => void;
  onToggleOnline: () => void;
  onSelectProfile: (profile: Profile) => void;
  onMessageProfile: (profile: MatchProfile) => void;
  customInputs: Record<DropdownFilterId, string>;
  onCustomInputChange: (id: DropdownFilterId, value: string) => void;
  onApplyCustom: (id: DropdownFilterId) => void;
  onClearFilter: (id: DropdownFilterId) => void;
  selectedProfile: Profile | null;
  onCloseProfile: () => void;
  isEmpty: boolean;
};

function MatchContent({
  loading,
  error,
  filteredProfiles,
  selectedFilters,
  openDropdown,
  onOpenDropdownChange,
  onDropdownSelect,
  onToggleOnline,
  onSelectProfile,
  onMessageProfile,
  customInputs,
  onCustomInputChange,
  onApplyCustom,
  onClearFilter,
  selectedProfile,
  onCloseProfile,
  isEmpty,
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
            inputRing: "focus:ring-rose-200",
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
            inputRing: "focus:ring-sky-200",
          },
    [isPink],
  );

  const currentDropdownOptions =
    openDropdown &&
    (filterOptions.find((option) => option.type === "dropdown" && option.id === openDropdown) as
      | DropdownFilterOption
      | undefined);

  return (
    <section className="space-y-6 transition-colors duration-500">
      <div className={styles.summaryCard}>
        <h2 className="text-xl font-semibold text-neutral-800">Hasil pencarian hangat</h2>
        <p className="mt-2 text-sm text-neutral-500">
          {loading
            ? "Sedang memuat rekomendasi terbaru..."
            : error
            ? "Terjadi kendala saat memuat data. Coba perbarui halaman."
            : filteredProfiles.length > 0
            ? `${filteredProfiles.length} kecocokan yang siap diajak ngobrol.`
            : "Belum ada nama yang cocok dengan pencarianmu. Coba ketik kata kunci lain."}
        </p>
      </div>

      <div className="space-y-3">
        <div className={styles.filterBar}>
          <span className="text-sm font-semibold text-neutral-500">Filters</span>
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
              const displayLabel = value ? `${filter.label}: ${value}` : filter.label;
              const isActive = Boolean(value);

              return (
                <button
                  key={filter.id}
                  onClick={() =>
                    onOpenDropdownChange(openDropdown === filter.id ? null : filter.id)
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
                  selectedFilters[currentDropdownOptions.id] === (option === "Semua" ? "" : option)
                    ? styles.filterActive
                    : styles.filterInactive
                }`}
              >
                {option}
              </button>
            ))}

            {currentDropdownOptions.allowCustom ? (
              <div className="mt-3 flex w-full flex-col gap-2 border-t border-neutral-100 pt-3 sm:flex-row sm:items-center">
                <input
                  value={customInputs[currentDropdownOptions.id]}
                  onChange={(event) =>
                    onCustomInputChange(currentDropdownOptions.id, event.target.value)
                  }
                  placeholder={
                    currentDropdownOptions.customPlaceholder ?? "Ketik manual..."
                  }
                  className={`flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 focus:outline-none focus:ring-2 ${styles.inputRing} sm:max-w-xs`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => onApplyCustom(currentDropdownOptions.id)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${styles.filterActive}`}
                  >
                    Terapkan
                  </button>
                  {selectedFilters[currentDropdownOptions.id] ? (
                    <button
                      onClick={() => onClearFilter(currentDropdownOptions.id)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${styles.filterInactive}`}
                    >
                      Reset
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-3xl border border-neutral-100 bg-white/60"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-sm text-rose-500">
          {error}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSelect={onSelectProfile}
              onMessage={onMessageProfile}
            />
          ))}
        </div>
      )}

      {filteredProfiles.length === 0 && !loading ? (
        <div className={`${styles.emptyState} text-sm`}>
          {isEmpty
            ? "Belum ada pengguna lain yang bisa ditampilkan. Ajak temanmu bergabung dulu ya!"
            : "Tidak ada kecocokan yang sesuai filter. Coba ubah kata kunci."}
        </div>
      ) : null}

      {selectedProfile ? (
        <ProfileDetail profile={selectedProfile} onClose={onCloseProfile} />
      ) : null}
    </section>
  );
}
