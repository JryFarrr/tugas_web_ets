import Image from "next/image";
import { useRouter } from "next/navigation";

import { useDashboardTheme } from "@/components/DashboardShell";

import { Profile } from "./ProfileCard";

type ProfileDetailProps = {
  profile: Profile;
  onClose: () => void;
};

export function ProfileDetail({ profile, onClose }: ProfileDetailProps) {
  const router = useRouter();
  const { themeName } = useDashboardTheme();
  const isPink = themeName === "pink";

  const styles = isPink
    ? {
        backdrop: "bg-black/30",
        panel:
          "border-white/70 bg-gradient-to-br from-[#fff6fc] via-white to-[#ffe9f3] shadow-[0_55px_140px_rgba(249,115,164,0.28)]",
        closeButton:
          "bg-white/85 text-neutral-400 shadow-rose-100/60 hover:text-rose-400",
        vibePill: "bg-[#ffeef5] text-rose-400",
        interestPill: "bg-[#ffeef5] text-rose-400 shadow-inner shadow-rose-100/60",
        primaryButton:
          "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 text-white shadow-lg shadow-rose-200/70 hover:brightness-105",
        secondaryButton:
          "border border-rose-100 bg-white/85 text-rose-400 hover:border-rose-200",
      }
    : {
        backdrop: "bg-black/40",
        panel:
          "border-white/75 bg-gradient-to-br from-[#e3f1ff] via-white to-[#dce9ff] shadow-[0_55px_140px_rgba(79,70,229,0.22)]",
        closeButton:
          "bg-white/85 text-neutral-400 shadow-sky-100/60 hover:text-sky-500",
        vibePill: "bg-[#e5f2ff] text-sky-500",
        interestPill: "bg-[#e5f2ff] text-sky-500 shadow-inner shadow-sky-100/60",
        primaryButton:
          "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 text-white shadow-lg shadow-sky-200/70 hover:brightness-105",
        secondaryButton:
          "border border-sky-100 bg-white/85 text-sky-500 hover:border-sky-200",
      };

  const handleGreet = () => {
    const params = new URLSearchParams();
    const targetId = profile.id ?? profile.name ?? "";
    params.set("with", targetId);
    if (profile.name) {
      params.set("name", profile.name);
    }
    router.push(`/dashboard/messages?${params.toString()}`);
    onClose();
  };

  const displayBio =
    profile.about ??
    profile.bio ??
    "Belum ada deskripsi pribadi. Mungkin kamu bisa menjadi yang pertama mengenal mereka lebih jauh.";

  const interests = profile.interests ?? [];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${styles.backdrop} backdrop-blur-sm px-4 py-10`}
    >
      <div
        className={`relative w-full max-w-2xl overflow-hidden rounded-[36px] border ${styles.panel}`}
      >
        <button
          onClick={onClose}
          className={`absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full transition ${styles.closeButton}`}
          aria-label="Tutup detail profil"
        >
          X
        </button>
        <div className="grid gap-6 md:grid-cols-[1fr,1.1fr]">
          <div className="relative h-64 md:h-full">
            <Image
              src={profile.imageUrl}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 240px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
            <div className="absolute bottom-4 left-4 space-y-1 text-white drop-shadow-lg">
              <p className="text-lg font-semibold">
                {profile.name}, {profile.age}
              </p>
              {profile.pekerjaan ?? profile.occupation ? (
                <p className="text-sm text-white/85">
                  {profile.pekerjaan ?? profile.occupation}
                </p>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-full bg-white/30 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                {profile.city}
              </span>
            </div>
          </div>
          <div className="space-y-6 p-6">
            <div>
              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold ${styles.vibePill}`}
              >
                {profile.vibe}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-neutral-500">{displayBio}</p>

            {interests.length ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-neutral-600">
                  Hal yang membuat kami tertarik
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className={`rounded-full px-3 py-1 ${styles.interestPill}`}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-neutral-400">
                Pengguna belum menambahkan interest.
              </div>
            )}

            <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
              <button
                onClick={handleGreet}
                className={`rounded-full px-5 py-2 font-semibold transition ${styles.primaryButton}`}
              >
                Sapa sekarang
              </button>
              <button
                onClick={onClose}
                className={`rounded-full px-5 py-2 font-semibold transition ${styles.secondaryButton}`}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
