import Image from "next/image";

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
      className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-[0_45px_100px_rgba(249,115,164,0.2)] transition hover:-translate-y-1 hover:shadow-[0_60px_130px_rgba(249,115,164,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
    >
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#ffe8f2] via-transparent to-transparent" />
        <div className="absolute right-4 top-4 rounded-2xl bg-white/85 px-3 py-1 text-xs font-semibold text-rose-400 shadow-lg shadow-rose-200/70">
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
          <span className="rounded-full bg-[#ffeef5] px-3 py-1 text-xs font-semibold text-rose-400">
            {vibe}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            Online
          </span>
          <span className="rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-rose-200/70 transition group-hover:brightness-110">
            Lihat Detail
          </span>
        </div>
      </div>
    </article>
  );
}
