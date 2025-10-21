"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { DashboardShell, useDashboardTheme } from "@/components/DashboardShell";

const profile = {
  name: "Farah Nadhira",
  age: 26,
  city: "Bandung",
  status: "Online",
  headline: "My Profile",
  about:
    "Pecinta kopi yang hobi menulis cerita pendek dan mengeksplor kafe tema vintage. Lagi mencari teman ngobrol yang siap berbagi tawa dan rencana akhir pekan spontan.",
  interests: ["Kopi", "Fotografi", "Travel ringan", "Film Indie", "Yoga", "Board Game"],
  mainPhoto: "https://i.pravatar.cc/320?img=65",
  galleryA: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=640&q=80",
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=640&q=80",
    "https://images.unsplash.com/photo-1451471016731-e963a8588be8?auto=format&fit=crop&w=640&q=80",
    "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&w=640&q=80",
    "https://images.unsplash.com/photo-1524230565030-1be7855e6af2?auto=format&fit=crop&w=640&q=80",
  ],
  galleryB: [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=640&q=80",
    "https://images.unsplash.com/photo-1468252349044-0fdd7a7b1c13?auto=format&fit=crop&w=640&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=640&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=640&q=80",
    "https://images.unsplash.com/photo-1521579971123-1192931a1452?auto=format&fit=crop&w=640&q=80",
  ],
};

export default function ProfilePage() {
  return (
    <DashboardShell
      headerChips={[]}
      headerShowSearch={false}
      headerSubtitle="Profil"
      headerHeadline="Kenali vibe hangatmu"
      headerStatusBadge="Profil kamu siap memikat"
      profileImageSrc={profile.mainPhoto}
    >
      <ProfileContent />
    </DashboardShell>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { themeName } = useDashboardTheme();
  const isPink = themeName === "pink";

  const [interests, setInterests] = useState(profile.interests);
  const [newInterest, setNewInterest] = useState("");

  const handleAddInterest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

  const handleEditProfile = () => {
    router.push("/dashboard/profile/edit");
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <section className="flex justify-center px-2 py-4">
      <div
        className={`w-full max-w-4xl space-y-8 rounded-[32px] border p-10 transition-colors duration-500 ${themeStyles.wrapperBorder} ${themeStyles.wrapperBg} ${themeStyles.wrapperShadow}`}
      >
        <div className="flex flex-col items-center gap-6 text-center transition-colors duration-500">
          <h2
            className={`text-lg font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${themeStyles.heroAccent}`}
          >
            My Profile
          </h2>
          <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-center md:justify-center md:gap-12 md:text-left">
            <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
              <Image
                src={profile.mainPhoto}
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
                {profile.age} {" - "} {profile.city}
              </p>
              <p
                className={`text-sm transition-colors duration-500 ${themeStyles.statusText}`}
              >
                Status: {profile.status}
              </p>
              <button
                className={`mt-4 inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold transition hover:brightness-105 ${themeStyles.editButton}`}
                onClick={handleEditProfile}
                type="button"
              >
                Edit Profil
              </button>
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
              {interests.map((interest) => (
                <span
                  key={interest}
                  className={`rounded-full px-4 py-1 text-xs font-semibold transition-colors duration-500 ${themeStyles.tagBg} ${themeStyles.tagText} ${themeStyles.tagShadow}`}
                >
                  {interest}
                </span>
              ))}
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
              />
              <button
                type="submit"
                className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:brightness-105 ${themeStyles.addButtonGradient}`}
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
