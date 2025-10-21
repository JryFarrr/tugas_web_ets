"use client";

import { useMemo } from "react";
import Link from "next/link";

import { articles } from "@/content/articles";
import { DashboardShell, useDashboardTheme } from "@/components/DashboardShell";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function DashboardPage() {
  return (
    <DashboardShell
      headerChips={[]}
      headerShowSearch={false}
      headerSubtitle="Beranda"
      headerHeadline="Berita & Tips Dating"
    >
      <NewsOverview />
    </DashboardShell>
  );
}

function NewsOverview() {
  const { themeName } = useDashboardTheme();
  const ordered = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const styles = useMemo(
    () =>
      themeName === "pink"
        ? {
            container:
              "overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-[#fff6fc] via-white to-[#ffe9f4] shadow-[0_45px_120px_rgba(249,115,164,0.12)] backdrop-blur transition-colors duration-500",
            divider: "border-t border-white/60",
            titleHover: "hover:text-rose-400",
            button:
              "inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-500 transition hover:border-rose-300 hover:text-rose-400",
          }
        : {
            container:
              "overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-[#e3f1ff] via-white to-[#d9e8ff] shadow-[0_45px_120px_rgba(79,70,229,0.16)] backdrop-blur transition-colors duration-500",
            divider: "border-t border-white/70",
            titleHover: "hover:text-sky-500",
            button:
              "inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-500 transition hover:border-sky-300 hover:text-sky-500",
          },
    [themeName],
  );

  return (
    <section className={styles.container}>
      {ordered.map((article, index) => (
        <article
          key={article.slug}
          className={`grid gap-4 px-6 py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${
            index > 0 ? styles.divider : ""
          }`}
        >
          <div className="space-y-3">
            <time className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              {dateFormatter.format(new Date(article.date))}
            </time>
            <Link
              href={`/dashboard/news/${article.slug}`}
              className={`block text-2xl font-semibold text-neutral-900 transition ${styles.titleHover}`}
            >
              {article.title}
            </Link>
            <p className="text-sm text-neutral-500">{article.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-2 text-neutral-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M12 4h9" />
                  <path d="M6 9h9" />
                  <path d="M6 15h9" />
                  <path d="M3 4h1" />
                  <path d="M3 9h1" />
                  <path d="M3 15h1" />
                  <path d="M3 20h1" />
                </svg>
                {article.readTime}
              </span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <Link
              href={`/dashboard/news/${article.slug}`}
              className={styles.button}
            >
              Baca selengkapnya
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
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
