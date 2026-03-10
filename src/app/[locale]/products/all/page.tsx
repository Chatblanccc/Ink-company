import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { getLocaleFromString } from "@/lib/i18n";
import { getPrismaClient } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { products as fallbackProducts } from "@/lib/demo-data";
import { ProductFilterGrid } from "./product-filter-grid";

const SCENARIO_LABELS: Record<string, { zh: string; en: string }> = {
  packaging:  { zh: "包装印刷", en: "Packaging" },
  labels:     { zh: "标签印刷", en: "Labels" },
  publishing: { zh: "出版印刷", en: "Publishing" },
  industrial: { zh: "工业应用", en: "Industrial" },
  specialty:  { zh: "特种功能", en: "Specialty" },
};

type L = "zh" | "en";

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
    pathname: "/products/all",
    title: safeLocale === "zh" ? "全部产品 | 油墨公司" : "All Products | Ink Company",
    description:
      safeLocale === "zh"
        ? "浏览全系列水性、UV 与功能型油墨产品，覆盖包装、标签、出版与工业印刷应用场景。"
        : "Browse the full range of water-based, UV, and specialty ink products for packaging, labels, publishing, and industrial applications.",
  });
}

/* ─── Default images ────────────────────────────────────────────────── */

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

const fallbackImg =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop";

/* ─── Page ──────────────────────────────────────────────────────────── */

export default async function AllProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ scenario?: string }>;
}) {
  const { locale } = await params;
  const { scenario } = await searchParams;
  const c = getLocaleFromString(locale) as L;

  const prisma = getPrismaClient();

  type ProductRow = {
    slug: string;
    title: Record<string, string>;
    summary: Record<string, string>;
    category: Record<string, string>;
    featured: boolean;
    scenarioTags: string[];
    coverImage: string | null;
  };

  let products: ProductRow[] = (fallbackProducts as unknown as ProductRow[]).map((p) => ({
    ...p,
    scenarioTags: [],
    coverImage: null,
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
          scenarioTags: (p.scenarioTags as string[]) ?? [],
          coverImage: p.coverImage ?? null,
        }));
      }
    } catch {
      /* fall through to demo data */
    }
  }

  /* ── Resolve initial scenario label from URL param ───────────────── */
  const initialScenario = scenario && SCENARIO_LABELS[scenario]
    ? SCENARIO_LABELS[scenario][c]
    : null;

  return (
    <main className="bg-white overflow-hidden min-h-screen">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <section className="w-full border-b border-[#EFEFEF]">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 pt-[120px] pb-[48px] lg:pb-[64px]">
          <FadeIn>
            <Link
              href={`/${c}/products`}
              className="inline-flex items-center gap-[6px] text-[12px] font-medium text-[#929292] hover:text-[#000] transition-colors mb-[24px] lg:mb-[32px]"
            >
              <ArrowLeft className="size-[13px]" strokeWidth={2} />
              {c === "zh" ? "产品介绍" : "Product Introduction"}
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-[16px]">
              <div>
                <p className="font-mono text-[11px] text-[#485C11] tracking-[0.06em] uppercase mb-[10px]">
                  {c === "zh" ? "完整产品系列" : "Full product range"}
                </p>
                <h1 className="font-display text-[48px] sm:text-[64px] lg:text-[80px] leading-[0.87] tracking-[-0.04em] text-[#000]">
                  {c === "zh" ? "全部产品" : "All Products"}
                </h1>
              </div>
              <p className="text-[13px] lg:text-[14px] leading-[1.6] text-[#6F6F6F] max-w-[360px] sm:text-right pb-[4px]">
                {c === "zh"
                  ? `共 ${products.length} 款产品，覆盖水性、UV 与功能型油墨全系列`
                  : `${products.length} products across water-based, UV, and specialty ink ranges`}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Filter strip + Products grid (client component) ─────────── */}
      <ProductFilterGrid
        products={products}
        locale={c}
        defaultImages={defaultProductImages}
        fallbackImg={fallbackImg}
        initialScenario={initialScenario}
        scenarioLabels={SCENARIO_LABELS}
      />

      {/* ── CTA banner ──────────────────────────────────────────────── */}
      <section className="w-full border-t border-[#EFEFEF]">
        <FadeIn>
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 py-[60px] lg:py-[80px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[24px]">
            <div className="flex flex-col gap-[8px]">
              <h3 className="font-display text-[28px] lg:text-[36px] leading-[0.9] tracking-[-0.03em] text-[#000]">
                {c === "zh" ? "找不到合适的产品？" : "Can't find the right product?"}
              </h3>
              <p className="text-[13px] lg:text-[14px] text-[#6F6F6F] leading-[1.6]">
                {c === "zh"
                  ? "我们支持配方定制开发，联系我们获取专属方案。"
                  : "We offer custom formulation. Contact us for a tailored solution."}
              </p>
            </div>
            <Link
              href={`/${c}/contact`}
              className="inline-flex items-center gap-[6px] shrink-0 bg-[#485C11] text-white text-[13px] font-bold px-[22px] py-[12px] rounded-full hover:bg-[#3d4a1c] transition-colors"
            >
              {c === "zh" ? "联系我们" : "Contact us"}
              <ArrowUpRight className="size-[13px]" strokeWidth={2.5} />
            </Link>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}
