"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { DashboardShell, useDashboardTheme } from "@/components/DashboardShell";
import { supabase } from "@/lib/supabaseClient";

type ProfileData = {
  name: string;
  age: number | null;
  city: string | null;
  status: string | null;
  about: string;
  interests: string[];
  mainPhoto: string;
  galleryA: string[];
  galleryB: string[];
  pekerjaan?: string | null;
};

const GALLERY_FALLBACK_A = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1451471016731-e963a8588be8?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1524230565030-1be7855e6af2?auto=format&fit=crop&w=640&q=80",
];

const GALLERY_FALLBACK_B = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1468252349044-0fdd7a7b1c13?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1521579971123-1192931a1452?auto=format&fit=crop&w=640&q=80",
];

const PRIMARY_FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=640&q=80";

const DEFAULT_PROFILE: ProfileData = {
  name: "Pengguna SoulMatch",
  age: null,
  city: null,
  status: null,
  about:
    "Belum ada deskripsi pribadi. Lengkapi profilmu agar teman baru lebih mudah mengenalmu.",
  interests: [],
  mainPhoto: PRIMARY_FALLBACK_PHOTO,
  galleryA: GALLERY_FALLBACK_A,
  galleryB: GALLERY_FALLBACK_B,
  pekerjaan: null,
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (): Promise<ProfileData> => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session) {
      throw new Error("Sesi tidak ditemukan. Silakan login kembali.");
    }

    const { data: row, error: queryError } = await supabase
      .from("profiles")
      .select(
        "name, age, city, status, pekerjaan, interests, about, main_photo, gallery_a, gallery_b",
      )
      .eq("id", session.user.id)
      .maybeSingle();

    if (queryError) {
      throw new Error("Gagal memuat profil. Coba beberapa saat lagi.");
    }

    const metadata = session.user.user_metadata ?? {};
    const fallbackName =
      (metadata.full_name as string | undefined) ??
      (metadata.name as string | undefined) ??
      session.user.email ??
      DEFAULT_PROFILE.name;

    return {
      ...DEFAULT_PROFILE,
      name: row?.name?.trim() ? row.name : fallbackName,
      age: typeof row?.age === "number" ? row.age : null,
      city: row?.city ?? null,
      status: row?.status ?? DEFAULT_PROFILE.status,
      about:
        row?.about && row.about.trim().length
          ? row.about
          : DEFAULT_PROFILE.about,
      interests:
        Array.isArray(row?.interests) && row.interests.length
          ? row.interests
          : [],
      mainPhoto:
        row?.main_photo && row.main_photo.trim().length
          ? row.main_photo
          : PRIMARY_FALLBACK_PHOTO,
      pekerjaan: row?.pekerjaan ?? null,
      galleryA:
        Array.isArray(row?.gallery_a) && row.gallery_a.length
          ? row.gallery_a
          : GALLERY_FALLBACK_A,
      galleryB:
        Array.isArray(row?.gallery_b) && row.gallery_b.length
          ? row.gallery_b
          : GALLERY_FALLBACK_B,
    };
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProfile();
      setProfileData(data);
    } catch (err) {
      console.error("[ProfilePage] loadProfile", err);
      const message =
        err instanceof Error ? err.message : "Gagal memuat profil.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const statusBadge = loading
    ? "Memuat profil..."
    : error
    ? "Gagal memuat profil"
    : "Profil kamu siap memikat";

  const profileImageSrc: string =
    profileData.mainPhoto.trim().length > 0
      ? profileData.mainPhoto
      : PRIMARY_FALLBACK_PHOTO;

  return (
    <DashboardShell
      headerChips={[]}
      headerShowSearch={false}
      headerSubtitle="Profil"
      headerHeadline="Kenali vibe hangatmu"
      headerStatusBadge={statusBadge}
      profileImageSrc={profileImageSrc}
    >
      <ProfileContent
        profile={profileData}
        loading={loading}
        error={error}
        onRetry={loadProfile}
      />
    </DashboardShell>
  );
}

type ProfileContentProps = {
  profile: ProfileData;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

function ProfileContent({ profile, loading, error, onRetry }: ProfileContentProps) {
  const router = useRouter();
  const { themeName } = useDashboardTheme();
  const isPink = themeName === "pink";

  const [interests, setInterests] = useState(profile.interests);
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    setInterests(profile.interests);
  }, [profile.interests]);

  const handleAddInterest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) {
      return;
    }
    const value = newInterest.trim();
    if (!value) {
      return;
    }
    setInterests((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setNewInterest("");
  };

  const themeStyles = useMemo(
    () =>
      isPink
        ? {
            wrapperBorder: "border-[#f3cfc0]",
            wrapperBg: "bg-[#fde2d8]",
            wrapperShadow: "shadow-[0_30px_100px_rgba(120,60,30,0.15)]",
            heroAccent: "text-[#7e3f3b]",
            headline: "text-[#3f2a28]",
            metaText: "text-[#5a3d3a]",
            statusText: "text-[#8a6a64]",
            editButton:
              "bg-[#8ae3c1] text-[#1f3c34] shadow-[0_12px_30px_rgba(138,227,193,0.5)]",
            infoCardBorder: "border-[#f3cfc0]",
            infoCardBg: "bg-[#fdf1e7]",
            infoCardShadow: "shadow-[0_18px_45px_rgba(120,60,30,0.12)]",
            tagBg: "bg-[#f7c6b3]",
            tagText: "text-[#543029]",
            tagShadow: "shadow-inner shadow-white/60",
            photoBorder: "border-[#f0d4c9]",
            photoBg: "bg-[#fbe7de]",
            addButtonGradient:
              "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 shadow-rose-200/70",
            inputBorder: "border-[#f3cfc0]",
            inputFocus: "focus:border-[#f08a6b]",
            logoutButton:
              "bg-[#803b3b] shadow-[0_15px_40px_rgba(128,59,59,0.3)]",
          }
        : {
            wrapperBorder: "border-[#bed6ff]",
            wrapperBg: "bg-[#dbe8ff]",
            wrapperShadow: "shadow-[0_30px_100px_rgba(62,94,160,0.18)]",
            heroAccent: "text-[#324d7d]",
            headline: "text-[#1f2f4e]",
            metaText: "text-[#2e4670]",
            statusText: "text-[#4a628b]",
            editButton:
              "bg-[#7ec8ff] text-[#123a5f] shadow-[0_12px_30px_rgba(126,200,255,0.45)]",
            infoCardBorder: "border-[#c3ddff]",
            infoCardBg: "bg-[#ecf3ff]",
            infoCardShadow: "shadow-[0_18px_45px_rgba(62,94,160,0.12)]",
            tagBg: "bg-[#c5ddff]",
            tagText: "text-[#284577]",
            tagShadow: "shadow-inner shadow-white/60",
            photoBorder: "border-[#c8dcff]",
            photoBg: "bg-[#dfeaff]",
            addButtonGradient:
              "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 shadow-sky-200/70",
            inputBorder: "border-[#bed6ff]",
            inputFocus: "focus:border-[#5aa8ff]",
            logoutButton:
              "bg-[#2f4f85] shadow-[0_15px_40px_rgba(47,79,133,0.3)]",
          },
    [isPink],
  );
  const ageCityLabel = useMemo(() => {
    const parts = [
      typeof profile.age === "number" ? `${profile.age}` : null,
      profile.city && profile.city.trim().length ? profile.city : null,
    ].filter(Boolean);
    return parts.length ? parts.join(" - ") : "Lengkapi data umur dan lokasi";
  }, [profile.age, profile.city]);

  const handleEditProfile = () => {
    router.push("/dashboard/profile/edit");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.warn("Gagal keluar dari sesi Supabase:", signOutError);
    } finally {
      router.push("/login");
    }
  };

  return (
    <section className="flex justify-center px-2 py-4">
      <div
        className={`w-full max-w-4xl space-y-8 rounded-[32px] border p-10 transition-colors duration-500 ${themeStyles.wrapperBorder} ${themeStyles.wrapperBg} ${themeStyles.wrapperShadow}`}
      >
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-500">
            <div>{error}</div>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/85 px-4 py-2 text-xs font-semibold text-rose-500 transition hover:border-rose-300 hover:text-rose-600"
            >
              Coba lagi
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 text-sm text-sky-600">
            Sedang memuat profil terbaru...
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-6 text-center transition-colors duration-500">
          <h2
            className={`text-lg font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${themeStyles.heroAccent}`}
          >
            My Profile
          </h2>
          <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-center md:justify-center md:gap-12 md:text-left">
            <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
              <Image
                src={profile.mainPhoto || DEFAULT_PROFILE.mainPhoto}
                alt={profile.name}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
            <div className="space-y-3 transition-colors duration-500">
              <h1
                className={`text-3xl font-semibold transition-colors duration-500 ${themeStyles.headline}`}
              >
                {profile.name}
              </h1>
              <p
                className={`text-sm font-medium transition-colors duration-500 ${themeStyles.metaText}`}
              >
                {ageCityLabel}
              </p>
              {profile.pekerjaan ? (
                <p
                  className={`text-sm transition-colors duration-500 ${themeStyles.metaText}`}
                >
                  {profile.pekerjaan}
                </p>
              ) : null}
              <p
                className={`text-sm transition-colors duration-500 ${themeStyles.statusText}`}
              >
                Status: {profile.status || "Belum ditentukan"}
              </p>
              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <button
                  onClick={handleEditProfile}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition hover:brightness-105 ${themeStyles.editButton}`}
                  type="button"
                >
                  Edit Profil
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article
            className={`rounded-[28px] border p-6 text-left transition-colors duration-500 ${themeStyles.infoCardBorder} ${themeStyles.infoCardBg} ${themeStyles.infoCardShadow}`}
          >
            <h2 className="text-base font-semibold text-neutral-800">About Me</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {profile.about}
            </p>
          </article>

          <article
            className={`rounded-[28px] border p-6 transition-colors duration-500 ${themeStyles.infoCardBorder} ${themeStyles.infoCardBg} ${themeStyles.infoCardShadow}`}
          >
            <h2 className="text-base font-semibold text-neutral-800">Interests</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {interests.length ? (
                interests.map((interest) => (
                  <span
                    key={interest}
                    className={`rounded-full px-4 py-1 text-xs font-semibold transition-colors duration-500 ${themeStyles.tagBg} ${themeStyles.tagText} ${themeStyles.tagShadow}`}
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-sm text-neutral-400">
                  Belum ada interest yang ditambahkan.
                </span>
              )}
            </div>
            <form
              onSubmit={handleAddInterest}
              className="mt-5 flex flex-col gap-3 sm:flex-row"
            >
              <input
                value={newInterest}
                onChange={(event) => setNewInterest(event.target.value)}
                placeholder="Tambah interest baru"
                className={`flex-1 rounded-full border bg-white px-4 py-2 text-sm text-neutral-600 transition focus:outline-none ${themeStyles.inputBorder} ${themeStyles.inputFocus}`}
                maxLength={24}
                disabled={loading}
              />
              <button
                type="submit"
                className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 ${themeStyles.addButtonGradient}`}
                disabled={loading}
              >
                Tambah
              </button>
            </form>
          </article>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article
            className={`space-y-4 rounded-[28px] border p-6 transition-colors duration-500 ${themeStyles.infoCardBorder} ${themeStyles.infoCardBg} ${themeStyles.infoCardShadow}`}
          >
            <h2 className="text-base font-semibold text-neutral-800">Photos</h2>
            <div className="grid grid-cols-3 gap-4">
              {profile.galleryA.slice(0, 3).map((src) => (
                <div
                  key={src}
                  className={`relative h-36 w-full overflow-hidden rounded-[22px] border transition-colors duration-500 sm:h-44 ${themeStyles.photoBorder} ${themeStyles.photoBg}`}
                >
                  <Image
                    src={src}
                    alt="Gallery photo"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 220px, 80vw"
                  />
                </div>
              ))}
            </div>
          </article>

          <article
            className={`space-y-4 rounded-[28px] border p-6 transition-colors duration-500 ${themeStyles.infoCardBorder} ${themeStyles.infoCardBg} ${themeStyles.infoCardShadow}`}
          >
            <h2 className="text-base font-semibold text-neutral-800">Moments</h2>
            <div className="grid grid-cols-3 gap-4">
              {profile.galleryB.slice(0, 3).map((src) => (
                <div
                  key={src}
                  className={`relative h-36 w-full overflow-hidden rounded-[22px] border transition-colors duration-500 sm:h-44 ${themeStyles.photoBorder} ${themeStyles.photoBg}`}
                >
                  <Image
                    src={src}
                    alt="Moment photo"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 220px, 80vw"
                  />
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="flex justify-center">
          <button
            className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold text-white transition hover:brightness-110 ${themeStyles.logoutButton}`}
            aria-label="Keluar"
            onClick={handleLogout}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
            Keluar
          </button>
        </div>
      </div>
    </section>
  );
}
