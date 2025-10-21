"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { DashboardShell, useDashboardTheme } from "@/components/DashboardShell";

export default function EditProfilePage() {
  return (
    <DashboardShell
      headerChips={[]}
      headerShowSearch={false}
      headerSubtitle="Profil"
      headerHeadline="Ubah informasi profilmu"
      headerStatusBadge="Jangan lupa simpan perubahan"
      profileImageSrc="https://i.pravatar.cc/320?img=65"
    >
      <EditProfileContent />
    </DashboardShell>
  );
}

function EditProfileContent() {
  const router = useRouter();
  const { themeName } = useDashboardTheme();
  const isPink = themeName === "pink";

  const [interests, setInterests] = useState<string[]>([
    "Kopi",
    "Fotografi",
    "Travel ringan",
    "Film Indie",
    "Yoga",
    "Board Game",
  ]);
  const [newInterest, setNewInterest] = useState("");

  const formClasses = useMemo(
    () =>
      isPink
        ? "space-y-6 rounded-3xl border border-white/70 bg-white/95 p-8 shadow-[0_45px_120px_rgba(249,115,164,0.2)] backdrop-blur transition-colors duration-500"
        : "space-y-6 rounded-3xl border border-white/80 bg-white/98 p-8 shadow-[0_45px_120px_rgba(79,70,229,0.18)] backdrop-blur transition-colors duration-500",
    [isPink],
  );

  const submitButtonClasses = useMemo(
    () =>
      isPink
        ? "rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-200/80 transition hover:brightness-105"
        : "rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200/80 transition hover:brightness-105",
    [isPink],
  );

  const inputBorder = isPink
    ? "border-rose-100 focus:border-rose-200"
    : "border-sky-100 focus:border-sky-300";
  const inputShadow = isPink ? "shadow-rose-100/70" : "shadow-sky-100/70";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/dashboard/profile");
  };

  const handleCancel = () => {
    router.push("/dashboard/profile");
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests((prev) => prev.filter((item) => item !== interest));
  };

  const handleAddInterest = () => {
    const value = newInterest.trim();
    if (!value) {
      return;
    }
    setInterests((prev) =>
      prev.includes(value) ? prev : [...prev, value].slice(0, 20),
    );
    setNewInterest("");
  };

  return (
    <section className="space-y-8">
      <form onSubmit={handleSubmit} className={formClasses}>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600">
            Nama Lengkap
            <input
              type="text"
              name="name"
              defaultValue="Farah Nadhira"
              className={`rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner ${inputShadow} focus:outline-none transition ${inputBorder}`}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600">
            Kota
            <input
              type="text"
              name="city"
              defaultValue="Bandung"
              className={`rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner ${inputShadow} focus:outline-none transition ${inputBorder}`}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600 md:col-span-2">
            Tentang Kamu
            <textarea
              name="about"
              defaultValue="Pecinta kopi yang hobi menulis cerita pendek dan mengeksplor kafe tema vintage."
              rows={4}
              className={`resize-none rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner ${inputShadow} focus:outline-none transition ${inputBorder}`}
            />
          </label>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-neutral-700">
              Interest Kamu
            </h3>
            <span className="text-xs text-neutral-400">
              {interests.length} interest
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  isPink
                    ? "bg-[#ffeef5] text-rose-400"
                    : "bg-[#e3f1ff] text-sky-500"
                }`}
              >
                {interest}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className={`rounded-full px-2 py-[2px] text-[10px] font-semibold transition ${
                    isPink
                      ? "bg-rose-200/40 text-rose-500 hover:bg-rose-200"
                      : "bg-sky-200/50 text-sky-600 hover:bg-sky-200"
                  }`}
                  aria-label={`Hapus interest ${interest}`}
                >
                  x
                </button>
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={newInterest}
              onChange={(event) => setNewInterest(event.target.value)}
              placeholder="Tambah interest baru"
              maxLength={24}
              className={`flex-1 rounded-full border bg-white px-4 py-2 text-sm text-neutral-600 shadow-inner ${inputShadow} focus:outline-none transition ${inputBorder}`}
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:brightness-105 ${
                isPink
                  ? "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 shadow-rose-200/70"
                  : "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 shadow-sky-200/70"
              }`}
            >
              Tambah
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className={`rounded-full border px-6 py-2 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-100 ${
              isPink
                ? "hover:border-rose-200 hover:text-rose-500"
                : "hover:border-sky-300 hover:text-sky-500"
            }`}
          >
            Batal
          </button>
          <button type="submit" className={submitButtonClasses}>
            Simpan Perubahan
          </button>
        </div>
      </form>
    </section>
  );
}
