import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { getLocaleFromString } from "@/lib/i18n";
import { getPrismaClient } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { NewsFilterGrid } from "./news-filter-grid";

/* ─── Image lookup (same pool used on news listing + article detail) ── */

const SLUG_IMG: Record<string, string> = {
  "how-to-stabilize-color-in-flexo-packaging":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop",
  "uv-label-ink-selection-checklist":
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop",
  "building-a-bilingual-packaging-spec-workflow":
    "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=600&auto=format&fit=crop",
  "pantone-color-matching-for-brand-packaging":
    "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=600&auto=format&fit=crop",
  "water-based-ink-trends-2026":
    "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=600&auto=format&fit=crop",
  "72h-sampling-turnaround-case-study":
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
  "reach-compliance-documentation-guide":
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
  "ink-adhesion-testing-flexible-packaging":
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600&auto=format&fit=crop",
  "cross-plant-color-consistency":
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
};

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
];

/* ─── Static fallback articles (mirrors news/page.tsx) ─────────────── */

type ArticleRow = {
  slug: string;
  type: "NEWS" | "CASE_STUDY" | "INSIGHT";
  category: { zh: string; en: string };
  title: { zh: string; en: string };
  publishedAt: Date;
  img: string;
};

const STATIC_ARTICLES: ArticleRow[] = [
  {
    slug: "how-to-stabilize-color-in-flexo-packaging",
    type: "INSIGHT",
    category: { zh: "技术文章", en: "Insights" },
    publishedAt: new Date("2026-03-05T09:00:00Z"),
    title: { zh: "柔印包装如何稳定控制色差与批次一致性", en: "How to stabilize color consistency in flexo packaging" },
    img: SLUG_IMG["how-to-stabilize-color-in-flexo-packaging"],
  },
  {
    slug: "uv-label-ink-selection-checklist",
    type: "CASE_STUDY",
    category: { zh: "案例洞察", en: "Case Study" },
    publishedAt: new Date("2026-03-10T08:30:00Z"),
    title: { zh: "UV 标签油墨选型清单：从附着力到后加工兼容", en: "UV label ink checklist: adhesion to finishing compatibility" },
    img: SLUG_IMG["uv-label-ink-selection-checklist"],
  },
  {
    slug: "building-a-bilingual-packaging-spec-workflow",
    type: "NEWS",
    category: { zh: "新闻动态", en: "News" },
    publishedAt: new Date("2026-03-08T14:00:00Z"),
    title: { zh: "构建面向海外客户的双语包装规格协同流程", en: "Building a bilingual packaging spec workflow for global programs" },
    img: SLUG_IMG["building-a-bilingual-packaging-spec-workflow"],
  },
  {
    slug: "pantone-color-matching-for-brand-packaging",
    type: "INSIGHT",
    category: { zh: "技术文章", en: "Insights" },
    publishedAt: new Date("2026-03-04T10:00:00Z"),
    title: { zh: "品牌包装中的 Pantone 目标色建立与量产复现方法", en: "Pantone color matching and production reproduction for brand packaging" },
    img: SLUG_IMG["pantone-color-matching-for-brand-packaging"],
  },
  {
    slug: "water-based-ink-trends-2026",
    type: "NEWS",
    category: { zh: "行业动态", en: "Industry" },
    publishedAt: new Date("2026-02-28T09:00:00Z"),
    title: { zh: "2026 年水性油墨技术趋势：绿色合规与高性能并行", en: "Water-based ink trends 2026: green compliance meets high performance" },
    img: SLUG_IMG["water-based-ink-trends-2026"],
  },
  {
    slug: "72h-sampling-turnaround-case-study",
    type: "CASE_STUDY",
    category: { zh: "案例洞察", en: "Case Study" },
    publishedAt: new Date("2026-02-15T11:00:00Z"),
    title: { zh: "72 小时打样周期如何缩短 APAC 品牌的量产决策路径", en: "How 72h sampling compressed production decision cycles for an APAC brand" },
    img: SLUG_IMG["72h-sampling-turnaround-case-study"],
  },
  {
    slug: "reach-compliance-documentation-guide",
    type: "NEWS",
    category: { zh: "法规合规", en: "Compliance" },
    publishedAt: new Date("2026-02-01T08:00:00Z"),
    title: { zh: "REACH 法规合规文件准备指南：面向欧洲市场印刷采购商", en: "REACH compliance documentation guide for European print procurement" },
    img: SLUG_IMG["reach-compliance-documentation-guide"],
  },
  {
    slug: "ink-adhesion-testing-flexible-packaging",
    type: "INSIGHT",
    category: { zh: "技术文章", en: "Insights" },
    publishedAt: new Date("2026-01-20T10:30:00Z"),
    title: { zh: "软包装油墨附着力测试标准与实机验证方法总结", en: "Adhesion testing standards and on-press validation for flexible packaging inks" },
    img: SLUG_IMG["ink-adhesion-testing-flexible-packaging"],
  },
  {
    slug: "cross-plant-color-consistency",
    type: "CASE_STUDY",
    category: { zh: "案例洞察", en: "Case Study" },
    publishedAt: new Date("2025-12-15T09:00:00Z"),
    title: { zh: "跨工厂色彩一致性管理：从配方标准化到现场首件确认", en: "Cross-plant color consistency: from formula standardization to first-article sign-off" },
    img: SLUG_IMG["cross-plant-color-consistency"],
  },
];

/* ─── Metadata ──────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = getLocaleFromString(locale);
  return buildMetadata({
    locale: safeLocale,
    pathname: "/news/all",
    title: safeLocale === "zh" ? "全部文章 | 油墨公司" : "All Articles | Ink Company",
    description:
      safeLocale === "zh"
        ? "浏览油墨公司全部行业资讯、技术洞察与案例研究，覆盖色彩管理、法规合规与全球交付。"
        : "Browse all industry news, technical insights, and case studies from Ink Company covering color management, compliance, and global delivery.",
  });
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default async function AllNewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = getLocaleFromString(locale) as "zh" | "en";

  /* ── Fetch articles from DB; fall back to static if unavailable ─── */
  let articles: ArticleRow[] = STATIC_ARTICLES;

  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const rows = await prisma.article.findMany({
        orderBy: { publishedAt: "desc" },
      });
      if (rows.length > 0) {
        articles = rows.map((row, i) => ({
          slug: row.slug,
          type: row.type as ArticleRow["type"],
          category: row.category as ArticleRow["category"],
          title: row.title as ArticleRow["title"],
          publishedAt: row.publishedAt,
          img: SLUG_IMG[row.slug] ?? FALLBACK_IMGS[i % FALLBACK_IMGS.length],
        }));
      }
    } catch {
      // keep static fallback
    }
  }

  return (
    <main className="bg-white min-h-screen overflow-hidden">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <section className="w-full border-b border-[#EFEFEF]">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 pt-[120px] pb-[48px] lg:pb-[64px]">
          <FadeIn>
            <Link
              href={`/${c}/news`}
              className="inline-flex items-center gap-[6px] text-[12px] font-medium text-[#929292] hover:text-[#000] transition-colors mb-[24px] lg:mb-[32px]"
            >
              <ArrowLeft className="size-[13px]" strokeWidth={2} />
              {c === "zh" ? "新闻与案例" : "News & Insights"}
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-[16px]">
              <div>
                <p className="font-mono text-[11px] text-[#485C11] tracking-[0.06em] uppercase mb-[10px]">
                  {c === "zh" ? "完整文章存档" : "Complete archive"}
                </p>
                <h1 className="font-display text-[48px] sm:text-[64px] lg:text-[80px] leading-[0.87] tracking-[-0.04em] text-[#000]">
                  {c === "zh" ? "全部文章" : "All Articles"}
                </h1>
              </div>
              <p className="text-[13px] lg:text-[14px] leading-[1.6] text-[#6F6F6F] max-w-[360px] sm:text-right pb-[4px]">
                {c === "zh"
                  ? `共 ${articles.length} 篇，覆盖行业资讯、技术洞察与客户案例`
                  : `${articles.length} articles spanning industry news, technical insights, and case studies`}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Filter + Grid (client component) ────────────────────────── */}
      <NewsFilterGrid articles={articles} locale={c} />

      {/* ── CTA banner ──────────────────────────────────────────────── */}
      <section className="w-full border-t border-[#EFEFEF]">
        <FadeIn>
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 py-[60px] lg:py-[80px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[24px]">
            <div className="flex flex-col gap-[8px]">
              <h3 className="font-display text-[28px] lg:text-[36px] leading-[0.9] tracking-[-0.03em] text-[#000]">
                {c === "zh" ? "有项目想要讨论？" : "Have a project to discuss?"}
              </h3>
              <p className="text-[13px] lg:text-[14px] text-[#6F6F6F] leading-[1.6]">
                {c === "zh"
                  ? "我们的工程师可以在 24 小时内回复您。"
                  : "Our engineers will respond within 24 hours."}
              </p>
            </div>
            <Link
              href={`/${c}/contact`}
              className="inline-flex items-center gap-[6px] shrink-0 bg-[#000] text-white text-[13px] font-bold px-[22px] py-[12px] rounded-full hover:bg-[#333] transition-colors"
            >
              {c === "zh" ? "联系我们" : "Get in touch"}
              <ArrowUpRight className="size-[13px]" strokeWidth={2.5} />
            </Link>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}
