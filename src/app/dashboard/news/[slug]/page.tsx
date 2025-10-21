"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { articles, type ArticleMeta } from "@/content/articles";
import { DashboardShell, useDashboardTheme } from "@/components/DashboardShell";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const externalIcon = (
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
    <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
);

export default function ArticleDetail() {
  const params = useParams<{ slug: string }>();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
      ? params?.slug[0]
      : "";

  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return (
      <DashboardShell
        headerChips={[]}
        headerShowSearch={false}
        headerSubtitle="Berita"
        headerHeadline="Informasi terbaru untuk dating aman"
        headerStatusBadge=""
      >
        <div className="rounded-[28px] border border-white/60 bg-white/92 p-8 text-sm text-neutral-500 shadow-[0_35px_110px_rgba(249,115,164,0.12)] backdrop-blur">
          Artikel tidak ditemukan.
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      headerChips={[]}
      headerShowSearch={false}
      headerSubtitle="Berita"
      headerHeadline="Informasi terbaru untuk dating aman"
      headerStatusBadge={article.readTime}
    >
      <ArticleContent article={article} />
    </DashboardShell>
  );
}

function ArticleContent({ article }: { article: ArticleMeta }) {
  const { themeName } = useDashboardTheme();

  const styles = useMemo(
    () =>
      themeName === "pink"
        ? {
            container:
              "space-y-10 rounded-[28px] border border-white/60 bg-gradient-to-br from-[#fff6fc] via-white to-[#ffe9f4] p-8 text-neutral-700 shadow-[0_35px_110px_rgba(249,115,164,0.12)] backdrop-blur transition-colors duration-500",
            tag: "rounded-full bg-white/70 px-3 py-1 font-semibold text-neutral-500",
            sourceLink:
              "inline-flex items-center gap-2 text-rose-500 transition hover:text-rose-400",
            numberBadge:
              "mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-500",
            backLink:
              "inline-flex items-center gap-2 text-neutral-500 transition hover:text-rose-400",
            externalButton:
              "inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-500 transition hover:border-rose-300 hover:text-rose-400",
          }
        : {
            container:
              "space-y-10 rounded-[28px] border border-white/60 bg-gradient-to-br from-[#e3f1ff] via-white to-[#d9e8ff] p-8 text-neutral-700 shadow-[0_35px_110px_rgba(79,70,229,0.16)] backdrop-blur transition-colors duration-500",
            tag: "rounded-full bg-white/70 px-3 py-1 font-semibold text-neutral-500",
            sourceLink:
              "inline-flex items-center gap-2 text-sky-500 transition hover:text-sky-400",
            numberBadge:
              "mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-500",
            backLink:
              "inline-flex items-center gap-2 text-neutral-500 transition hover:text-sky-500",
            externalButton:
              "inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-500 transition hover:border-sky-300 hover:text-sky-500",
          },
    [themeName],
  );

  return (
    <article className={styles.container}>
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
          {article.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-semibold text-neutral-900">
          {article.title}
        </h1>
        <p className="text-sm text-neutral-500">{article.excerpt}</p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
          <time>{dateFormatter.format(new Date(article.date))}</time>
          <Link
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceLink}
          >
            Baca sumber asli
            {externalIcon}
          </Link>
        </div>
      </header>

      <section className="space-y-10">
        {article.sections.map((section, index) => {
          if (section.type === "intro") {
            return (
              <p key={index} className="text-base leading-relaxed text-neutral-600">
                {section.text}
              </p>
            );
          }

          if (section.type === "paragraph") {
            return (
              <div key={index} className="space-y-3">
                {section.title ? (
                  <h2 className="text-xl font-semibold text-neutral-900">
                    {section.title}
                  </h2>
                ) : null}
                <p className="text-base leading-relaxed text-neutral-600">
                  {section.text}
                </p>
              </div>
            );
          }

          if (section.type === "list") {
            return (
              <div key={index} className="space-y-4">
                <h2 className="text-xl font-semibold text-neutral-900">
                  {section.title}
                </h2>
                <ol className="space-y-3 text-base text-neutral-600">
                  {section.items.map((item, order) => (
                    <li key={item} className="flex gap-3">
                      <span className={styles.numberBadge}>{order + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          }

          return null;
        })}
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 text-sm text-neutral-400">
        <Link href="/dashboard" className={styles.backLink}>
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
            <polyline points="15 18 9 12 15 6" />
            <line x1="9" x2="21" y1="12" y2="12" />
            <line x1="3" x2="3" y1="5" y2="19" />
          </svg>
          Kembali ke daftar berita
        </Link>
        <Link
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.externalButton}
        >
          Kunjungi sumber asli
          {externalIcon}
        </Link>
      </footer>
    </article>
  );
}
