import type { Metadata } from "next";
import Link from "next/link";
import { Clock, FlaskConical, Globe, ShieldCheck } from "lucide-react";

import { FadeIn, FadeInGroup } from "@/components/fade-in";
import { getLocaleFromString } from "@/lib/i18n";
import { getPrismaClient } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { products as fallbackProducts } from "@/lib/demo-data";
import { productsPageDefaults, type ProductsPageData } from "@/lib/products-page-defaults";

type L = "zh" | "en";

const ICON_MAP = {
  Clock,
  FlaskConical,
  ShieldCheck,
  Globe,
} as const;

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
    pathname: "/products",
    title: safeLocale === "zh" ? "产品中心 | 油墨公司" : "Products | Ink Company",
    description:
      safeLocale === "zh"
        ? "水性、UV 与功能型油墨，覆盖包装、标签、出版与工业场景，配方定制，全球交付。"
        : "Water-based, UV, and specialty inks for packaging, labels, publishing, and industrial applications — custom formulation and global delivery.",
  });
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = getLocaleFromString(locale) as L;

  const prisma = getPrismaClient();

  /* ── Products from DB ─────────────────────────────────────────── */
  type ProductRow = {
    slug: string;
    title: Record<string, string>;
    summary: Record<string, string>;
    category: Record<string, string>;
    featured: boolean;
    coverImage: string | null;
  };
  let products: ProductRow[] = (fallbackProducts as unknown as ProductRow[]).map((p) => ({
    ...p, coverImage: null,
  }));

  if (prisma) {
    try {
      const rows = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "asc" },
      });
      if (rows.length > 0) {
        products = rows.map((p) => ({
          slug: p.slug,
          title: p.title as Record<string, string>,
          summary: p.summary as Record<string, string>,
          category: (p.category?.name ?? {}) as Record<string, string>,
          featured: p.featured,
          coverImage: p.coverImage ?? null,
        }));
      }
    } catch { /* fall through */ }
  }

  /* ── Products page content from DB ───────────────────────────── */
  let cms: ProductsPageData = productsPageDefaults;
  if (prisma) {
    try {
      const row = await prisma.productsPageContent.findUnique({ where: { id: "products-page" } });
      if (row) {
        cms = {
          hero:            (row.hero            as ProductsPageData["hero"])            ?? productsPageDefaults.hero,
          categories:      (row.categories      as ProductsPageData["categories"])      ?? productsPageDefaults.categories,
          productLines:    (row.productLines    as ProductsPageData["productLines"])    ?? productsPageDefaults.productLines,
          banner:          (row.banner          as ProductsPageData["banner"])          ?? productsPageDefaults.banner,
          testimonial:     (row.testimonial     as ProductsPageData["testimonial"])     ?? productsPageDefaults.testimonial,
          editorialPanels: (row.editorialPanels as ProductsPageData["editorialPanels"]) ?? productsPageDefaults.editorialPanels,
          promises:        (row.promises        as ProductsPageData["promises"])        ?? productsPageDefaults.promises,
        };
      }
    } catch { /* fall through */ }
  }

  const { hero, categories, productLines, banner, testimonial, editorialPanels, promises } = cms;

  /* ── Default product images (fallback when no coverImage in DB) */
  const defaultProductImages: Record<string, string> = {
    "water-based-flexo-ink":
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600&auto=format&fit=crop",
    "uv-label-ink":
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=600&auto=format&fit=crop",
    "offset-book-ink":
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
    "functional-security-ink":
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
  };

  return (
    <main className="bg-white overflow-hidden min-h-screen">

      {/* ── 1. Hero ──────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "72vh", minHeight: "480px" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 w-full">
          <FadeIn duration={0.9} offset={20}>
            <div className="pb-[48px] lg:pb-[72px] max-w-[500px]">
              <h1 className="font-display text-[48px] sm:text-[64px] lg:text-[80px] leading-[0.87] tracking-[-0.04em] text-white">
                {c === "zh" ? hero.titleZh : hero.titleEn}
              </h1>
              <p className="mt-[16px] text-[14px] lg:text-[15px] leading-[1.6] text-white/70 max-w-[360px]">
                {c === "zh" ? hero.subtitleZh : hero.subtitleEn}
              </p>
              <Link
                href={`/${c}/contact`}
                className="inline-flex items-center gap-[6px] mt-[24px] bg-white text-[#000] text-[13px] font-bold leading-[1.4] tracking-[-0.02em] px-[20px] py-[11px] rounded-full hover:bg-white/90 transition-colors"
              >
                {c === "zh" ? hero.ctaZh : hero.ctaEn}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. Shop by Category ──────────────────────────────────────── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 py-[48px] lg:py-[64px]">
        <FadeIn>
          <p className="text-[12px] lg:text-[13px] font-medium tracking-[0.08em] text-[#929292] uppercase text-center mb-[24px] lg:mb-[32px]">
            {c === "zh" ? "按应用场景浏览" : "Shop by Application"}
          </p>
        </FadeIn>
        <FadeInGroup stagger={0.07} className="grid grid-cols-5 gap-[10px] lg:gap-[16px]">
          {categories.map((cat) => (
            <Link
              key={cat.labelEn}
              href={cat.href}
              className="group flex flex-col items-center gap-[10px] lg:gap-[12px]"
            >
              <div className="relative w-full aspect-[3/4] rounded-[10px] lg:rounded-[12px] overflow-hidden bg-[#F3F3F3]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.06]"
                  style={{ backgroundImage: `url(${cat.img})` }}
                />
              </div>
              <span className="text-[11px] lg:text-[12px] font-medium text-[#000] tracking-[-0.01em] text-center">
                {c === "zh" ? cat.labelZh : cat.labelEn}
              </span>
            </Link>
          ))}
        </FadeInGroup>
      </section>

      {/* ── 3. Three editorial product-line columns ───────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 w-full">
        {productLines.map((line, i) => (
          <div key={line.slug} className="group relative overflow-hidden" style={{ aspectRatio: i === 1 ? "3/4" : "4/5" }}>
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              style={{ backgroundImage: `url(${line.img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-[20px] lg:p-[28px] flex flex-col gap-[6px] lg:gap-[8px]">
              <p className="font-mono text-[10px] text-white/60 tracking-[-0.01em]">
                {c === "zh" ? line.subZh : line.subEn}
              </p>
              <h3 className="font-display text-[24px] lg:text-[32px] leading-[0.9] tracking-[-0.03em] text-white">
                {c === "zh" ? line.titleZh : line.titleEn}
              </h3>
              <Link
                href={`/${c}/products/${line.slug}`}
                className="mt-[8px] w-fit border border-white/80 text-white text-[11px] lg:text-[12px] font-bold tracking-[-0.01em] px-[14px] py-[7px] rounded-full hover:bg-white hover:text-[#000] transition-colors duration-200"
              >
                {c === "zh" ? line.ctaZh : line.ctaEn}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ── 4. Full-width banner ─────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "400px" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner.bgImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <FadeIn className="absolute inset-0 flex flex-col items-center justify-center text-center px-[24px] gap-[14px] lg:gap-[18px]">
          <p className="font-mono text-[11px] text-white/60 tracking-[0.06em] uppercase">
            {c === "zh" ? banner.eyebrowZh : banner.eyebrowEn}
          </p>
          <h2 className="font-display text-[36px] sm:text-[52px] lg:text-[64px] leading-[0.88] tracking-[-0.04em] text-white max-w-[700px]">
            {c === "zh" ? banner.headlineZh : banner.headlineEn}
          </h2>
          <Link
            href={`/${c}/contact`}
            className="mt-[8px] bg-white text-[#000] text-[13px] font-bold px-[22px] py-[11px] rounded-full hover:bg-white/90 transition-colors"
          >
            {c === "zh" ? banner.ctaZh : banner.ctaEn}
          </Link>
        </FadeIn>
      </section>

      {/* ── 5. Featured products grid ────────────────────────────────── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 py-[60px] lg:py-[80px]">
        <FadeIn className="flex items-end justify-between mb-[28px] lg:mb-[36px]">
          <h2 className="font-display text-[32px] sm:text-[44px] lg:text-[56px] leading-[0.88] tracking-[-0.04em] text-[#000]">
            {c === "zh" ? "精选产品" : "Featured Products"}
          </h2>
          <Link
            href={`/${c}/contact`}
            className="hidden sm:inline-flex text-[13px] font-medium text-[#6F6F6F] underline underline-offset-2 hover:text-[#000] transition-colors shrink-0 mb-[6px]"
          >
            {c === "zh" ? "全部产品" : "View all"}
          </Link>
        </FadeIn>

        <FadeInGroup stagger={0.07} className="grid grid-cols-2 lg:grid-cols-4 gap-x-[12px] lg:gap-x-[16px] gap-y-[28px] lg:gap-y-[40px]">
          {products.map((product) => {
            const img =
              product.coverImage ??
              defaultProductImages[product.slug] ??
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop";
            return (
              <Link
                key={product.slug}
                href={`/${c}/products/${product.slug}`}
                className="group flex flex-col gap-[12px] lg:gap-[14px]"
              >
                <div className="relative w-full aspect-[3/4] rounded-[10px] lg:rounded-[12px] overflow-hidden bg-[#F3F3F3]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-mono text-[10px] lg:text-[11px] text-[#929292] tracking-[-0.01em]">
                    {product.category[c]}
                  </p>
                  <h3 className="font-bold text-[13px] lg:text-[14px] leading-[1.35] tracking-[-0.02em] text-[#000] group-hover:text-[#485C11] transition-colors duration-200">
                    {product.title[c]}
                  </h3>
                  <p className="text-[12px] lg:text-[13px] leading-[1.5] text-[#929292] mt-[2px]">
                    {(product.summary[c] ?? "").slice(0, 48)}…
                  </p>
                </div>
              </Link>
            );
          })}
        </FadeInGroup>
      </section>

      {/* ── 6. Testimonial split ─────────────────────────────────────── */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2">
        <FadeIn
          direction="right"
          className="flex flex-col justify-center px-[32px] sm:px-[48px] lg:px-[80px] py-[60px] lg:py-[100px] gap-[28px] lg:gap-[36px] bg-[#fbfaf8] order-2 lg:order-1"
        >
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-[#485C11] shrink-0">
            <path d="M0 24V14.4C0 10.56 0.96 7.28 2.88 4.56C4.96 1.68 7.92 0 11.76 0L13.44 2.4C10.72 3.04 8.64 4.48 7.2 6.72C5.92 8.8 5.28 11.04 5.28 13.44H10.56V24H0ZM18.24 24V14.4C18.24 10.56 19.2 7.28 21.12 4.56C23.2 1.68 26.16 0 30 0L31.68 2.4C28.96 3.04 26.88 4.48 25.44 6.72C24.16 8.8 23.52 11.04 23.52 13.44H28.8V24H18.24Z" fill="currentColor"/>
          </svg>
          <p className="font-display text-[22px] lg:text-[28px] leading-[1.25] tracking-[-0.02em] text-[#000]">
            {c === "zh" ? testimonial.quoteZh : testimonial.quoteEn}
          </p>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] font-bold leading-[1.3] tracking-[-0.02em] text-[#000]">
              {c === "zh" ? testimonial.authorZh : testimonial.authorEn}
            </p>
            <p className="font-mono text-[10px] lg:text-[11px] text-[#485C11] tracking-[-0.01em]">
              {c === "zh" ? testimonial.roleZh : testimonial.roleEn}
            </p>
          </div>
        </FadeIn>
        <FadeIn direction="left" className="relative order-1 lg:order-2 min-h-[320px] lg:min-h-[560px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${testimonial.img})` }}
          />
        </FadeIn>
      </section>

      {/* ── 7. Two editorial panels ──────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 w-full">
        {editorialPanels.map((panel) => (
          <div key={panel.labelEn} className="group relative overflow-hidden aspect-[4/3]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              style={{ backgroundImage: `url(${panel.img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-[24px] lg:p-[36px]">
              <h3 className="font-display text-[24px] lg:text-[32px] leading-[0.9] tracking-[-0.03em] text-white mb-[10px]">
                {c === "zh" ? panel.labelZh : panel.labelEn}
              </h3>
              <Link
                href={panel.href}
                className="text-[12px] lg:text-[13px] font-medium text-white/80 underline underline-offset-2 hover:text-white transition-colors"
              >
                {c === "zh" ? panel.ctaZh : panel.ctaEn}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ── 8. Service promises ──────────────────────────────────────── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 py-[60px] lg:py-[80px] border-t border-[#EFEFEF]">
        <FadeInGroup stagger={0.08} className="grid grid-cols-2 lg:grid-cols-4 gap-[24px] lg:gap-[40px]">
          {promises.map((promise) => {
            const Icon = ICON_MAP[promise.icon as keyof typeof ICON_MAP] ?? Clock;
            return (
              <div key={promise.titleEn} className="flex flex-col items-center text-center gap-[12px] lg:gap-[14px]">
                <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[14px] bg-[#DFECC6]">
                  <Icon className="size-[20px] text-[#485C11]" strokeWidth={1.8} />
                </div>
                <p className="font-bold text-[13px] lg:text-[14px] leading-[1.3] tracking-[-0.02em] text-[#000]">
                  {c === "zh" ? promise.titleZh : promise.titleEn}
                </p>
                <p className="text-[12px] lg:text-[13px] leading-[1.55] tracking-[-0.005em] text-[#6F6F6F]">
                  {c === "zh" ? promise.descZh : promise.descEn}
                </p>
              </div>
            );
          })}
        </FadeInGroup>
      </section>

    </main>
  );
}
