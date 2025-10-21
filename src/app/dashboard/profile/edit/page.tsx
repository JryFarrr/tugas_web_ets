"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { DashboardShell } from "@/components/DashboardShell";

export default function EditProfilePage() {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Simulate a save and return to the profile overview.
    router.push("/dashboard/profile");
  };

  const handleCancel = () => {
    router.push("/dashboard/profile");
  };

  return (
    <DashboardShell
      headerChips={[]}
      headerShowSearch={false}
      headerSubtitle="Profil"
      headerHeadline="Ubah informasi profilmu"
      headerStatusBadge="Jangan lupa simpan perubahan"
      profileImageSrc="https://i.pravatar.cc/320?img=65"
    >
      <section className="space-y-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/70 bg-white/95 p-8 shadow-[0_45px_120px_rgba(249,115,164,0.2)] backdrop-blur"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600">
              Nama Lengkap
              <input
                type="text"
                name="name"
                defaultValue="Farah Nadhira"
                className="rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner shadow-rose-100/70 focus:border-rose-200 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600">
              Kota
              <input
                type="text"
                name="city"
                defaultValue="Bandung"
                className="rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner shadow-rose-100/70 focus:border-rose-200 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600 md:col-span-2">
              Tentang Kamu
              <textarea
                name="about"
                defaultValue="Pecinta kopi yang hobi menulis cerita pendek dan mengeksplor kafe tema vintage."
                rows={4}
                className="resize-none rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner shadow-rose-100/70 focus:border-rose-200 focus:outline-none"
              />
            </label>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full border border-neutral-200 px-6 py-2 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-200/80 transition hover:brightness-105"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </section>
    </DashboardShell>
  );
}
