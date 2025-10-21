import Image from "next/image";

import { useDashboardTheme } from "@/components/DashboardShell";

export type Profile = {
  name: string;
  age: number;
  city: string;
  compatibility: number;
  vibe: string;
  imageUrl: string;
  occupation?: string;
  bio?: string;
  interests?: string[];
  filters?: string[];
};

type ProfileCardProps = {
  profile: Profile;
  onSelect?: (profile: Profile) => void;
};

export function ProfileCard({ profile, onSelect }: ProfileCardProps) {
  const { name, age, city, compatibility, vibe, imageUrl } = profile;
  const { themeName } = useDashboardTheme();
  const isPink = themeName === "pink";

  const styles = isPink
    ? {
        cardRoot:
          "border-white/70 bg-gradient-to-br from-[#fff6fc] via-white to-[#ffe9f4] shadow-[0_45px_100px_rgba(249,115,164,0.2)] hover:shadow-[0_60px_130px_rgba(249,115,164,0.28)] focus-visible:outline-rose-400",
        imageOverlay: "bg-gradient-to-t from-[#ffe8f2] via-transparent to-transparent",
        badge:
          "bg-white/85 text-rose-400 shadow-lg shadow-rose-200/70",
        vibePill: "bg-[#ffeef5] text-rose-400",
        statusDot: "bg-emerald-400",
        ctaButton:
          "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 shadow-rose-200/70",
      }
    : {
        cardRoot:
          "border-white/80 bg-gradient-to-br from-[#e3f1ff] via-white to-[#dce9ff] shadow-[0_45px_100px_rgba(79,70,229,0.18)] hover:shadow-[0_65px_130px_rgba(79,70,229,0.25)] focus-visible:outline-sky-400",
        imageOverlay: "bg-gradient-to-t from-[#dbeeff] via-transparent to-transparent",
        badge:
          "bg-white/85 text-sky-500 shadow-lg shadow-sky-200/70",
        vibePill: "bg-[#e3f1ff] text-sky-500",
        statusDot: "bg-sky-400",
        ctaButton:
          "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 shadow-sky-200/70",
      };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(profile)}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && onSelect) {
          event.preventDefault();
          onSelect(profile);
        }
      }}
      className={`group relative overflow-hidden rounded-3xl border transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${styles.cardRoot}`}
    >
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className={`absolute inset-0 ${styles.imageOverlay}`} />
        <div className={`absolute right-4 top-4 rounded-2xl px-3 py-1 text-xs font-semibold ${styles.badge}`}>
          {compatibility}% cocok
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-800">
              {name}, {age}
            </h3>
            <p className="text-sm text-neutral-400">{city}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.vibePill}`}>
            {vibe}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-2">
            <span className={`inline-flex h-2 w-2 rounded-full ${styles.statusDot}`} />
            Online
          </span>
          <span className={`rounded-full px-4 py-1 text-xs font-semibold text-white transition group-hover:brightness-110 ${styles.ctaButton}`}>
            Lihat Detail
          </span>
        </div>
      </div>
    </article>
  );
}
