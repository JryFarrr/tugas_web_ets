import Image from "next/image";

import { useDashboardTheme } from "@/components/DashboardShell";

export type Profile = {
  id?: string;
  name: string;
  age: number;
  city: string;
  vibe: string;
  imageUrl: string;
  occupation?: string;
  bio?: string;
  about?: string | null;
  interests?: string[];
  interestTag?: string;
  filters?: string[];
  pekerjaan?: string;
  compatibility?: number;
  online?: boolean;
};

type ProfileCardProps = {
  profile: Profile;
  onSelect?: (profile: Profile) => void;
  onMessage?: (profile: Profile) => void;
};

export function ProfileCard({ profile, onSelect, onMessage }: ProfileCardProps) {
  const { name, age, city, vibe, imageUrl } = profile;
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
        statusDotActive: "bg-emerald-400",
        statusDotInactive: "bg-neutral-300",
        detailButton:
          "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 shadow-rose-200/70",
        messageButton:
          "border border-rose-200/70 text-rose-500 hover:border-rose-400 hover:text-rose-500",
      }
    : {
        cardRoot:
          "border-white/80 bg-gradient-to-br from-[#e3f1ff] via-white to-[#dce9ff] shadow-[0_45px_100px_rgba(79,70,229,0.18)] hover:shadow-[0_65px_130px_rgba(79,70,229,0.25)] focus-visible:outline-sky-400",
        imageOverlay: "bg-gradient-to-t from-[#dbeeff] via-transparent to-transparent",
        badge:
          "bg-white/85 text-sky-500 shadow-lg shadow-sky-200/70",
        vibePill: "bg-[#e3f1ff] text-sky-500",
        statusDotActive: "bg-sky-400",
        statusDotInactive: "bg-neutral-300",
        detailButton:
          "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 shadow-sky-200/70",
        messageButton:
          "border border-sky-200/70 text-sky-500 hover:border-sky-500 hover:text-sky-500",
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
        <div className="flex justify-end text-xs text-neutral-500">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSelect?.(profile);
              }}
              className={`rounded-full px-4 py-1 text-xs font-semibold text-white transition group-hover:brightness-110 ${styles.detailButton}`}
            >
              Detail
            </button>
            {onMessage ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onMessage(profile);
                }}
                className={`rounded-full px-4 py-1 text-xs font-semibold transition ${styles.messageButton}`}
              >
                Sapa
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
