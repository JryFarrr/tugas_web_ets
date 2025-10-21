import Image from "next/image";
import { Profile } from "./ProfileCard";

type ProfileDetailProps = {
  profile: Profile;
  onClose: () => void;
};

export function ProfileDetail({ profile, onClose }: ProfileDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 py-10">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] border border-white/70 bg-white/95 shadow-[0_55px_140px_rgba(249,115,164,0.28)]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-neutral-400 shadow-md shadow-rose-100/60 transition hover:text-rose-400"
          aria-label="Tutup detail profil"
        >
          x
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
            <div className="absolute bottom-4 left-4 space-y-1 text-white">
              <p className="text-lg font-semibold">
                {profile.name}, {profile.age}
              </p>
              {profile.occupation ? (
                <p className="text-sm text-white/80">{profile.occupation}</p>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-full bg-white/30 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                {profile.city}
              </span>
            </div>
          </div>
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#ffeef5] px-4 py-2 text-xs font-semibold text-rose-400">
                {profile.vibe}
              </span>
              <span className="text-sm font-semibold text-rose-400">
                {profile.compatibility}% kecocokan
              </span>
            </div>

            {profile.bio ? (
              <p className="text-sm leading-relaxed text-neutral-500">
                {profile.bio}
              </p>
            ) : null}

            {profile.interests?.length ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-neutral-600">
                  Hal yang membuat kami tertarik
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-rose-400">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-[#ffeef5] px-3 py-1 shadow-inner shadow-rose-100/60"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
              <button className="rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 px-5 py-2 font-semibold text-white shadow-lg shadow-rose-200/70 transition hover:brightness-105">
                Kirim sapaan hangat
              </button>
              <button
                onClick={onClose}
                className="rounded-full border border-rose-100 bg-white/80 px-5 py-2 font-semibold text-rose-400 shadow-sm transition hover:border-rose-200"
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
