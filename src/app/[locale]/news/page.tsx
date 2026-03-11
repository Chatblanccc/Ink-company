import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { FadeIn, FadeInGroup } from "@/components/fade-in";
import { getLocaleFromString } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { relativeTime } from "@/lib/relative-time";
import { getPrismaClient } from "@/lib/prisma";

type L = { zh: string; en: string };

/* ─── Hot Topic (featured article) ─────────────────────────────────── */

const hotTopic = {
  slug: "how-to-stabilize-color-in-flexo-packaging",
  category: { zh: "技术文章", en: "Insights" },
  source: { zh: "油墨公司", en: "Ink Company" },
  publishedAt: new Date("2026-03-05T09:00:00Z"),
  title: {
    zh: "柔印包装如何稳定控制色差与批次一致性",
    en: "How to stabilize color consistency in flexo packaging",
  },
  opening: { zh: "稳定色彩，", en: "Consistent color," },
  body: {
    zh: "在包装印刷中，色差不仅影响品牌一致性，也直接影响客户验收效率。稳定色彩的第一步是建立统一的目标色库和配色复核流程。第二步是控制版辊与墨量转移的一致性，让打样逻辑真正延续到量产。",
    en: "Color deviation in packaging affects both brand consistency and customer approval cycles. The first step is a shared target-color library and a formal color review flow. The second step is consistency across anilox and ink transfer settings so the proof logic carries into production every time.",
  },
  img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop",
};

/* ─── Static fallback cards (used when DB unavailable/empty) ────────── */

type CardArticle = {
  slug: string;
  category: L;
  publishedAt: Date;
  source: L;
  title: L;
  img: string;
};

const SOURCE: L = { zh: "油墨公司", en: "Ink Company" };

// Image pool — cycled for DB articles that have no stored image
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

// Slug → image overrides for known demo articles
const SLUG_IMG: Record<string, string> = {
  "uv-label-ink-selection-checklist": FALLBACK_IMGS[0],
  "building-a-bilingual-packaging-spec-workflow": FALLBACK_IMGS[1],
  "pantone-color-matching-for-brand-packaging": FALLBACK_IMGS[2],
  "water-based-ink-trends-2026": FALLBACK_IMGS[3],
  "72h-sampling-turnaround-case-study": FALLBACK_IMGS[4],
  "reach-compliance-documentation-guide": FALLBACK_IMGS[5],
  "ink-adhesion-testing-flexible-packaging": FALLBACK_IMGS[6],
  "cross-plant-color-consistency": FALLBACK_IMGS[7],
};

const STATIC_LATEST_NEWS: CardArticle[] = [
  {
    slug: "uv-label-ink-selection-checklist",
    category: { zh: "案例洞察", en: "Case Study" },
    publishedAt: new Date("2026-03-10T08:30:00Z"),
    source: SOURCE,
    title: { zh: "UV 标签油墨选型清单：从附着力到后加工兼容", en: "UV label ink checklist: adhesion to finishing compatibility" },
    img: SLUG_IMG["uv-label-ink-selection-checklist"],
  },
  {
    slug: "building-a-bilingual-packaging-spec-workflow",
    category: { zh: "新闻动态", en: "News" },
    publishedAt: new Date("2026-03-08T14:00:00Z"),
    source: SOURCE,
    title: { zh: "构建面向海外客户的双语包装规格协同流程", en: "Building a bilingual packaging spec workflow for global programs" },
    img: SLUG_IMG["building-a-bilingual-packaging-spec-workflow"],
  },
  {
    slug: "pantone-color-matching-for-brand-packaging",
    category: { zh: "技术文章", en: "Insights" },
    publishedAt: new Date("2026-03-04T10:00:00Z"),
    source: SOURCE,
    title: { zh: "品牌包装中的 Pantone 目标色建立与量产复现方法", en: "Pantone color matching and production reproduction for brand packaging" },
    img: SLUG_IMG["pantone-color-matching-for-brand-packaging"],
  },
  {
    slug: "water-based-ink-trends-2026",
    category: { zh: "行业动态", en: "Industry" },
    publishedAt: new Date("2026-02-28T09:00:00Z"),
    source: SOURCE,
    title: { zh: "2026 年水性油墨技术趋势：绿色合规与高性能并行", en: "Water-based ink trends 2026: green compliance meets high performance" },
    img: SLUG_IMG["water-based-ink-trends-2026"],
  },
  {
    slug: "72h-sampling-turnaround-case-study",
    category: { zh: "案例洞察", en: "Case Study" },
    publishedAt: new Date("2026-02-15T11:00:00Z"),
    source: SOURCE,
    title: { zh: "72 小时打样周期如何缩短 APAC 品牌的量产决策路径", en: "How 72h sampling compressed production decision cycles for an APAC brand" },
    img: SLUG_IMG["72h-sampling-turnaround-case-study"],
  },
  {
    slug: "reach-compliance-documentation-guide",
    category: { zh: "法规合规", en: "Compliance" },
    publishedAt: new Date("2026-02-01T08:00:00Z"),
    source: SOURCE,
    title: { zh: "REACH 法规合规文件准备指南：面向欧洲市场印刷采购商", en: "REACH compliance documentation guide for European print procurement" },
    img: SLUG_IMG["reach-compliance-documentation-guide"],
  },
  {
    slug: "ink-adhesion-testing-flexible-packaging",
    category: { zh: "技术文章", en: "Insights" },
    publishedAt: new Date("2026-01-20T10:30:00Z"),
    source: SOURCE,
    title: { zh: "软包装油墨附着力测试标准与实机验证方法总结", en: "Adhesion testing standards and on-press validation for flexible packaging inks" },
    img: SLUG_IMG["ink-adhesion-testing-flexible-packaging"],
  },
  {
    slug: "cross-plant-color-consistency",
    category: { zh: "案例洞察", en: "Case Study" },
    publishedAt: new Date("2025-12-15T09:00:00Z"),
    source: SOURCE,
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
    pathname: "/news",
    title: safeLocale === "zh" ? "新闻与案例 | 油墨公司" : "News & Insights | Ink Company",
    description:
      safeLocale === "zh"
        ? "油墨公司最新行业资讯、技术文章与客户案例，覆盖色彩管理、合规要求与全球交付。"
        : "Latest industry insights, technical articles, and case studies from Ink Company covering color management, compliance, and global delivery.",
  });
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = getLocaleFromString(locale);

  /* ── Fetch articles from DB; fall back to static if unavailable ─── */
  let displayNews: CardArticle[] = STATIC_LATEST_NEWS;

  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const rows = await prisma.article.findMany({
        orderBy: { publishedAt: "desc" },
        where: { slug: { not: hotTopic.slug } },
      });
      if (rows.length > 0) {
        displayNews = rows.map((row, i) => ({
          slug: row.slug,
          category: row.category as L,
          publishedAt: row.publishedAt,
          source: SOURCE,
          title: row.title as L,
          img: SLUG_IMG[row.slug] ?? FALLBACK_IMGS[i % FALLBACK_IMGS.length],
        }));
      }
    } catch {
      // keep static fallback
    }
  }

  return (
    <main className="bg-white min-h-screen">

      {/* ── Hot Topics ──────────────────────────────────────────────── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 pt-[80px] lg:pt-[100px] pb-[48px] lg:pb-[64px]">

        {/* Section heading */}
        <FadeIn>
          <h2 className="font-display text-[40px] sm:text-[52px] lg:text-[64px] leading-[0.88] tracking-[-0.04em] text-[#000] mb-[28px] lg:mb-[36px]">
            {c === "zh" ? "热门话题" : "Hot Topics"}
          </h2>
        </FadeIn>

        {/* Featured article */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-[16px] lg:gap-[28px] items-stretch">

            {/* Left: hero image with overlay */}
            <Link
              href={`/${c}/news/${hotTopic.slug}`}
              className="group relative block rounded-[16px] lg:rounded-[20px] overflow-hidden min-h-[260px] lg:min-h-[340px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${hotTopic.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-[20px] lg:p-[28px]">
                <h3 className="font-bold text-[18px] lg:text-[22px] leading-[1.3] tracking-[-0.025em] text-white max-w-[480px]">
                  {hotTopic.title[c]}
                </h3>
                <p className="font-mono text-[10px] lg:text-[11px] text-white/55 mt-[8px]">
                  {relativeTime(hotTopic.publishedAt, c)}&nbsp;&nbsp;{hotTopic.source[c]}
                </p>
              </div>
            </Link>

            {/* Right: article body preview */}
            <div className="flex flex-col justify-between gap-[20px] py-[4px] lg:py-[8px]">
              <div className="flex flex-col gap-[16px] lg:gap-[20px]">
                <p className="font-mono text-[11px] lg:text-[12px] leading-[1.4] tracking-[-0.01em] text-[#485C11]">
                  {hotTopic.category[c]}
                </p>

                {/* Drop-word typography — matches Figma's "Nisi," large opening word */}
                <p className="text-[13px] lg:text-[14px] leading-[1.8] tracking-[-0.005em] text-[#6F6F6F]">
                  <span className="font-display text-[42px] lg:text-[52px] leading-[0.88] tracking-[-0.04em] text-[#000] float-left mr-[8px] mt-[4px]">
                    {hotTopic.opening[c]}
                  </span>
                  {hotTopic.body[c]}{" "}
                  <Link
                    href={`/${c}/news/${hotTopic.slug}`}
                    className="font-semibold text-[#000] underline underline-offset-2 decoration-[#929292] hover:decoration-[#000] transition-all"
                  >
                    {c === "zh" ? "阅读更多" : "read more"}
                  </Link>
                </p>
              </div>

              <p className="font-mono text-[10px] lg:text-[11px] text-[#929292] tracking-[-0.01em] clearfix">
                {relativeTime(hotTopic.publishedAt, c)}&nbsp;&nbsp;{hotTopic.source[c]}
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Latest News ─────────────────────────────────────────────── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 pt-[48px] lg:pt-[64px] pb-[80px] lg:pb-[120px] border-t border-[#E9E9E9]">

        {/* Section heading */}
        <FadeIn>
          <h2 className="font-display text-[40px] sm:text-[52px] lg:text-[64px] leading-[0.88] tracking-[-0.04em] text-[#000] mb-[28px] lg:mb-[40px]">
            {c === "zh" ? "最新资讯" : "Latest News"}
          </h2>
        </FadeIn>

        {/* 4-column news grid */}
        <FadeInGroup
          stagger={0.06}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[16px] lg:gap-x-[20px] gap-y-[36px] lg:gap-y-[48px]"
        >
          {displayNews.map((article) => (
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
              </div>

              {/* Card text */}
              <div className="flex flex-col gap-[6px]">
                <h3 className="font-bold text-[14px] lg:text-[15px] leading-[1.4] tracking-[-0.02em] text-[#000] group-hover:text-[#485C11] transition-colors duration-200">
                  {article.title[c]}
                </h3>
                <p className="font-mono text-[10px] lg:text-[11px] text-[#929292] tracking-[-0.01em]">
                  {relativeTime(article.publishedAt, c)}&nbsp;&nbsp;{article.source[c]}
                </p>
              </div>
            </Link>
          ))}
        </FadeInGroup>

        {/* Load more / view all */}
        <FadeIn delay={0.2}>
          <div className="flex justify-center mt-[60px] lg:mt-[80px]">
            <Link
              href={`/${c}/news/all`}
              className="inline-flex flex-row items-center gap-[6px] py-[12px] lg:py-[14px] px-[24px] lg:px-[28px] rounded-full border border-[#000] text-[13px] lg:text-[14px] font-bold leading-[1.4] tracking-[-0.025em] text-[#000] hover:bg-[#000] hover:text-white transition-colors duration-200"
            >
              {c === "zh" ? "查看全部内容" : "View all articles"}
              <ArrowUpRight className="size-[13px]" strokeWidth={2.5} />
            </Link>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}
