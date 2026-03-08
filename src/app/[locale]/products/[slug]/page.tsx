import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProductDetailTabs } from "@/components/product-detail-tabs";
import { getLocaleFromString } from "@/lib/i18n";
import { getPrismaClient } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { type Product, products as fallbackProducts, t } from "@/lib/demo-data";

/* ─── Per-product hero images ───────────────────────────────────────── */

const heroImages: Record<string, string> = {
  "water-based-flexo-ink":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop",
  "uv-label-ink":
    "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=1400&auto=format&fit=crop",
  "offset-book-ink":
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1400&auto=format&fit=crop",
  "functional-security-ink":
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1400&auto=format&fit=crop",
};

/* ─── Static params ─────────────────────────────────────────────────── */

export async function generateStaticParams() {
  const prisma = getPrismaClient();
  let slugs: string[] = fallbackProducts.map((p) => p.slug);
  if (prisma) {
    try {
      const rows = await prisma.product.findMany({ select: { slug: true } });
      if (rows.length > 0) slugs = rows.map((r) => r.slug);
    } catch {
      // use fallback
    }
  }
  return slugs.flatMap((slug) => [
    { locale: "zh", slug },
    { locale: "en", slug },
  ]);
}

/* ─── Metadata ──────────────────────────────────────────────────────── */

async function fetchProduct(slug: string) {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const row = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      });
      if (row) {
        return {
          slug: row.slug,
          category: row.category?.name as Record<string, string>,
          title: row.title as Record<string, string>,
          summary: row.summary as Record<string, string>,
          heroTag: row.heroTag as Record<string, string>,
          seoTitle: row.seoTitle as Record<string, string>,
          seoDescription: row.seoDescription as Record<string, string>,
          applications: row.applications as Record<string, string>[],
          features: row.features as Record<string, string>[],
          specifications: row.specifications as { label: Record<string, string>; value: Record<string, string> }[],
          featured: row.featured,
        };
      }
    } catch {
      // fall through
    }
  }
  return fallbackProducts.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale = getLocaleFromString(locale);
  const product = await fetchProduct(slug);
  if (!product) return {};
  return buildMetadata({
    locale: safeLocale,
    pathname: `/products/${slug}`,
    title: t(product.seoTitle as Record<"zh" | "en", string>, safeLocale),
    description: t(product.seoDescription as Record<"zh" | "en", string>, safeLocale),
  });
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const c = getLocaleFromString(locale);

  const product = await fetchProduct(slug);
  if (!product) notFound();

  const img = heroImages[product.slug] ?? heroImages["water-based-flexo-ink"];

  return (
    <main className="bg-[#F5F4F2] min-h-screen">

      {/* ── Breadcrumb (padded below fixed floating header) ──────────── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 pt-[88px] lg:pt-[100px] pb-[14px] flex items-center gap-[8px]">
        <Link
          href={`/${c}/products`}
          className="flex items-center gap-[4px] text-[12px] text-[#929292] hover:text-[#000] transition-colors"
        >
          <ArrowLeft className="size-[12px]" strokeWidth={2} />
          {c === "zh" ? "产品中心" : "Products"}
        </Link>
        <span className="text-[12px] text-[#C8C6C3]">/</span>
        <span className="text-[12px] text-[#929292]">{product.category[c]}</span>
        <span className="text-[12px] text-[#C8C6C3]">/</span>
        <span className="text-[12px] text-[#000] font-medium">{product.title[c]}</span>
      </div>

      {/* ── Main layout: image | details ─────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 pb-[80px] lg:pb-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-[56fr_44fr] gap-[24px] lg:gap-[48px] items-start">

          {/* ── Left: product image ──────────────────────────────────── */}
          <div className="sticky top-[80px]">
            <div
              className="relative w-full rounded-[16px] lg:rounded-[20px] overflow-hidden bg-[#ECEAE7]"
              style={{ aspectRatio: "4/5" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
              {/* Image counter badge */}
              <div className="absolute top-[16px] left-[18px]">
                <span className="font-mono text-[11px] text-[#929292]">01</span>
              </div>
              {/* Hero tag badge */}
              <div className="absolute top-[14px] right-[14px]">
                <span className="bg-white/90 backdrop-blur-sm text-[11px] font-medium text-[#000] px-[12px] py-[6px] rounded-full">
                  {product.heroTag[c]}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: product details ───────────────────────────────── */}
          <div className="flex flex-col gap-[20px] lg:gap-[24px] pt-[0px] lg:pt-[8px]">

            {/* Category + Title */}
            <div className="flex flex-col gap-[8px]">
              <p className="font-mono text-[11px] lg:text-[12px] leading-[1.4] tracking-[-0.01em] text-[#485C11]">
                {product.category[c]}
              </p>
              <h1 className="font-display text-[36px] sm:text-[44px] lg:text-[52px] leading-[0.88] tracking-[-0.04em] text-[#000]">
                {product.title[c]}
              </h1>
            </div>

            {/* Short summary */}
            <p className="text-[14px] lg:text-[15px] leading-[1.65] tracking-[-0.005em] text-[#6F6F6F]">
              {product.summary[c]}
            </p>

            <div className="w-full border-t border-[#DDDBD8]" />

            {/* Applications selector */}
            <div className="flex flex-col gap-[10px]">
              <p className="text-[12px] font-medium text-[#000] tracking-[-0.01em]">
                {c === "zh" ? "适用场景" : "Applications"}
              </p>
              <div className="flex flex-wrap gap-[8px]">
                {product.applications.map((app, i) => (
                  <span
                    key={app.en}
                    className={`px-[14px] py-[8px] text-[12px] font-medium rounded-full border transition-colors ${
                      i === 0
                        ? "border-[#000] bg-[#000] text-white"
                        : "border-[#BEBCB9] text-[#000] bg-transparent"
                    }`}
                  >
                    {app[c]}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended press (first spec) */}
            <div className="flex flex-col gap-[10px]">
              <p className="text-[12px] font-medium text-[#000] tracking-[-0.01em]">
                {c === "zh" ? "推荐设备" : "Recommended Press"}
              </p>
              <div className="flex flex-wrap gap-[8px]">
                <span className="px-[14px] py-[8px] text-[12px] text-[#000] rounded-full border border-[#BEBCB9]">
                  {product.specifications[0]?.value[c]}
                </span>
              </div>
            </div>

            <div className="w-full border-t border-[#DDDBD8]" />

            {/* CTA buttons — matches Figma's "Add to Bag | or | Try at home" */}
            <div className="flex items-center gap-[10px]">
              <Link
                href={`/${c}/contact`}
                className="flex-1 flex items-center justify-center bg-[#000] text-white text-[13px] lg:text-[14px] font-bold leading-[1.4] tracking-[-0.015em] py-[14px] rounded-full hover:bg-[#1a1a1a] transition-colors"
              >
                {c === "zh" ? "获取打样" : "Request sample"}
              </Link>
              <span className="text-[12px] text-[#929292] shrink-0">
                {c === "zh" ? "或" : "or"}
              </span>
              <Link
                href={`/${c}/contact`}
                className="flex-1 flex items-center justify-center border border-[#000] text-[#000] text-[13px] lg:text-[14px] font-bold leading-[1.4] tracking-[-0.015em] py-[14px] rounded-full hover:bg-[#000] hover:text-white transition-colors"
              >
                {c === "zh" ? "联系工程师" : "Talk to engineer"}
              </Link>
            </div>

            <div className="w-full border-t border-[#DDDBD8]" />

            {/* Interactive tabs: Description / Specifications / Sampling */}
            <ProductDetailTabs product={product as unknown as Product} locale={c} />

          </div>
        </div>
      </div>

      {/* ── Related products strip ────────────────────────────────────── */}
      <section className="w-full border-t border-[#DDDBD8] bg-[#ECEAE7]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 py-[48px] lg:py-[64px]">
          <p className="text-[13px] font-medium text-[#929292] mb-[24px]">
            {c === "zh" ? "其他产品" : "More products"}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] lg:gap-[16px]">
            {fallbackProducts
              .filter((p) => p.slug !== product.slug)
              .slice(0, 4)
              .map((p) => (
                <Link
                  key={p.slug}
                  href={`/${c}/products/${p.slug}`}
                  className="group flex flex-col gap-[10px]"
                >
                  <div
                    className="relative w-full aspect-[3/4] rounded-[12px] overflow-hidden bg-[#DDDBD8]"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                      style={{ backgroundImage: `url(${heroImages[p.slug]})` }}
                    />
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <p className="font-mono text-[10px] text-[#929292]">{p.category[c]}</p>
                    <p className="text-[13px] font-bold leading-[1.35] tracking-[-0.02em] text-[#000] group-hover:text-[#485C11] transition-colors">
                      {p.title[c]}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

    </main>
  );
}
