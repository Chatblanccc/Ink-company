"use client";

import { useState } from "react";
import Link from "next/link";
import { relativeTime } from "@/lib/relative-time";

type ArticleRow = {
  slug: string;
  type: "NEWS" | "CASE_STUDY" | "INSIGHT";
  category: { zh: string; en: string };
  title: { zh: string; en: string };
  publishedAt: Date;
  img: string;
};

type Props = {
  articles: ArticleRow[];
  locale: "zh" | "en";
};

const TYPE_LABELS: Record<ArticleRow["type"], { zh: string; en: string }> = {
  NEWS:       { zh: "行业资讯", en: "News" },
  CASE_STUDY: { zh: "案例研究", en: "Case Study" },
  INSIGHT:    { zh: "深度洞察", en: "Insight" },
};

const SOURCE = { zh: "油墨公司", en: "Ink Company" };

const FILTER_OPTIONS: Array<{ id: ArticleRow["type"] | "ALL"; zh: string; en: string }> = [
  { id: "ALL",       zh: "全部",     en: "All" },
  { id: "NEWS",      zh: "行业资讯", en: "News" },
  { id: "CASE_STUDY",zh: "案例研究", en: "Case Study" },
  { id: "INSIGHT",   zh: "深度洞察", en: "Insight" },
];

export function NewsFilterGrid({ articles, locale }: Props) {
  const [active, setActive] = useState<ArticleRow["type"] | "ALL">("ALL");
  const c = locale;

  const filtered = active === "ALL" ? articles : articles.filter((a) => a.type === active);

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 py-[48px] lg:py-[64px]">

      {/* ── Filter strip ──────────────────────────────────────────── */}
      <div className="flex items-center gap-[8px] flex-wrap mb-[40px] lg:mb-[52px]">
        {FILTER_OPTIONS.map((opt) => {
          const isActive = active === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setActive(opt.id)}
              className={[
                "inline-flex items-center px-[14px] py-[6px] rounded-full text-[12px] font-mono tracking-[-0.01em] transition-all duration-150",
                isActive
                  ? "bg-[#000] text-white"
                  : "border border-[#D8D8D8] text-[#666] hover:border-[#000] hover:text-[#000]",
              ].join(" ")}
            >
              {c === "zh" ? opt.zh : opt.en}
              {opt.id !== "ALL" && (
                <span className="ml-[6px] text-[10px] opacity-60">
                  {articles.filter((a) => a.type === opt.id).length}
                </span>
              )}
            </button>
          );
        })}
        <span className="ml-auto text-[12px] font-mono text-[#929292]">
          {c === "zh" ? `${filtered.length} 篇` : `${filtered.length} articles`}
        </span>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[80px] text-center">
          <p className="text-[14px] font-mono text-[#929292]">
            {c === "zh" ? "暂无此类文章" : "No articles in this category yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[16px] lg:gap-x-[20px] gap-y-[36px] lg:gap-y-[48px]">
          {filtered.map((article) => (
            <Link
              key={article.slug}
              href={`/${c}/news/${article.slug}`}
              className="group flex flex-col gap-[12px] lg:gap-[14px]"
            >
              {/* Card image */}
              <div className="relative w-full aspect-[16/10] rounded-[12px] lg:rounded-[14px] overflow-hidden bg-[#F0F0F0]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  style={{ backgroundImage: `url(${article.img})` }}
                />
                {/* Type badge */}
                <span className="absolute top-[10px] left-[10px] bg-white/85 backdrop-blur-sm text-[10px] font-mono text-[#444] px-[8px] py-[3px] rounded-full">
                  {c === "zh" ? TYPE_LABELS[article.type].zh : TYPE_LABELS[article.type].en}
                </span>
              </div>

              {/* Card text */}
              <div className="flex flex-col gap-[6px]">
                <h3 className="font-bold text-[14px] lg:text-[15px] leading-[1.4] tracking-[-0.02em] text-[#000] group-hover:text-[#485C11] transition-colors duration-200">
                  {c === "zh" ? (article.title.zh || article.title.en) : (article.title.en || article.title.zh)}
                </h3>
                <p className="font-mono text-[10px] lg:text-[11px] text-[#929292] tracking-[-0.01em]">
                  {relativeTime(article.publishedAt, c)}&nbsp;&nbsp;{SOURCE[c]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
