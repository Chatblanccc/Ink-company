import type { Metadata } from "next";
import Link from "next/link";
import { Clock, FlaskConical, Globe, ShieldCheck } from "lucide-react";

import { FadeIn, FadeInGroup } from "@/components/fade-in";
import { getLocaleFromString } from "@/lib/i18n";
import { getPrismaClient } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { products as fallbackProducts } from "@/lib/demo-data";

type L = { zh: string; en: string };

/* ─── Static data ───────────────────────────────────────────────────── */

const categories: { label: L; img: string; href: string }[] = [
  {
    label: { zh: "包装印刷", en: "Packaging" },
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=400&auto=format&fit=crop",
    href: "#packaging",
  },
  {
    label: { zh: "标签印刷", en: "Labels" },
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop",
    href: "#labels",
  },
  {
    label: { zh: "出版印刷", en: "Publishing" },
    img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop",
    href: "#publishing",
  },
  {
    label: { zh: "工业应用", en: "Industrial" },
    img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=400&auto=format&fit=crop",
    href: "#industrial",
  },
  {
    label: { zh: "特种功能", en: "Specialty" },
    img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=400&auto=format&fit=crop",
    href: "#specialty",
  },
];

const productLines: { title: L; sub: L; cta: L; img: string; slug: string }[] = [
  {
    title: { zh: "水性油墨", en: "Water-based Inks" },
    sub: { zh: "纸基包装 · 瓦楞 · 食品外箱", en: "Paper packaging · Corrugated · Cartons" },
    cta: { zh: "查看产品", en: "Shop now" },
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop",
    slug: "water-based-flexo-ink",
  },
  {
    title: { zh: "UV 油墨", en: "UV Inks" },
    sub: { zh: "标签 · 日化 · 高光泽表面", en: "Labels · Personal care · High gloss" },
    cta: { zh: "查看产品", en: "Shop now" },
    img: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=900&auto=format&fit=crop",
    slug: "uv-label-ink",
  },
  {
    title: { zh: "特种油墨", en: "Specialty Inks" },
    sub: { zh: "防伪 · 功能型 · 工业标识", en: "Security · Functional · Industrial" },
    cta: { zh: "查看产品", en: "Shop now" },
    img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=900&auto=format&fit=crop",
    slug: "functional-security-ink",
  },
];

const productImages: Record<string, string> = {
  "water-based-flexo-ink":
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600&auto=format&fit=crop",
  "uv-label-ink":
    "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=600&auto=format&fit=crop",
  "offset-book-ink":
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
  "functional-security-ink":
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
};

const testimonial = {
  quote: {
    zh: "从打样到量产，色彩一致性有了显著改善。客户验收周期缩短了近一半——这在以前是很难想象的。",
    en: "Color consistency from proof to production improved dramatically. Our approval cycle shortened by almost half — something we hadn't thought possible before.",
  },
  author: { zh: "陈 总监", en: "Director Chen" },
  role: { zh: "包装采购总监 · 某快消品牌 APAC", en: "Packaging Procurement Director · FMCG Brand APAC" },
  img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop",
};

const editorialPanels: { label: L; cta: L; href: string; img: string }[] = [
  {
    label: { zh: "配方定制开发", en: "Custom Formulation" },
    cta: { zh: "了解更多", en: "Learn more" },
    href: "/contact",
    img: "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: { zh: "全球交付与合规", en: "Global Delivery" },
    cta: { zh: "了解更多", en: "Learn more" },
    href: "/contact",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop",
  },
];

const promises: { Icon: typeof Clock; title: L; desc: L }[] = [
  {
    Icon: Clock,
    title: { zh: "72h 打样交付", en: "72h Sampling" },
    desc: { zh: "从色彩目标确认到实机验证，72 小时内交付。", en: "From color target to on-press proof within 72 hours." },
  },
  {
    Icon: FlaskConical,
    title: { zh: "配方定制研发", en: "Custom Formulation" },
    desc: { zh: "针对基材与设备精细调配，逐批次稳定复现。", en: "Fine-tuned for your substrate and press, batch after batch." },
  },
  {
    Icon: ShieldCheck,
    title: { zh: "法规合规文件", en: "Regulatory Docs" },
    desc: { zh: "REACH、RoHS 与食品接触级合规，完整文件支持。", en: "REACH, RoHS, and food-contact compliance with full documentation." },
  },
  {
    Icon: Globe,
    title: { zh: "全球 28+ 市场", en: "28+ Markets" },
    desc: { zh: "适配国际供应链节奏，覆盖亚太、欧洲与美洲。", en: "Aligned to international supply chain timelines across APAC, Europe, and the Americas." },
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
  const c = getLocaleFromString(locale);

  const prisma = getPrismaClient();
  type ProductRow = {
    slug: string;
    title: Record<string, string>;
    summary: Record<string, string>;
    category: Record<string, string>;
    featured: boolean;
  };
  let products: ProductRow[] = fallbackProducts as unknown as ProductRow[];
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
        }));
      }
    } catch {
      // fall through to demo data
    }
  }

  return (
    <main className="bg-white overflow-hidden min-h-screen">

      {/* ── 1. Hero ──────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "72vh", minHeight: "480px" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

        {/* Text — bottom-left, matching Figma */}
        <div className="absolute inset-x-0 bottom-0 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 w-full">
          <FadeIn duration={0.9} offset={20}>
            <div className="pb-[48px] lg:pb-[72px] max-w-[500px]">
              <h1 className="font-display text-[48px] sm:text-[64px] lg:text-[80px] leading-[0.87] tracking-[-0.04em] text-white">
                {c === "zh" ? "探索产品系列。" : "Explore Our Ink Range."}
              </h1>
              <p className="mt-[16px] text-[14px] lg:text-[15px] leading-[1.6] text-white/70 max-w-[360px]">
                {c === "zh"
                  ? "水性、UV 与功能型油墨，为每种印刷场景精准配方。"
                  : "Water-based, UV, and specialty inks — precisely formulated for every print application."}
              </p>
              <Link
                href={`/${c}/contact`}
                className="inline-flex items-center gap-[6px] mt-[24px] bg-white text-[#000] text-[13px] font-bold leading-[1.4] tracking-[-0.02em] px-[20px] py-[11px] rounded-full hover:bg-white/90 transition-colors"
              >
                {c === "zh" ? "获取打样" : "Request a sample"}
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
              key={cat.label.en}
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
                {cat.label[c]}
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
                {line.sub[c]}
              </p>
              <h3 className="font-display text-[24px] lg:text-[32px] leading-[0.9] tracking-[-0.03em] text-white">
                {line.title[c]}
              </h3>
              <Link
                href={`/${c}/products/${line.slug}`}
                className="mt-[8px] w-fit border border-white/80 text-white text-[11px] lg:text-[12px] font-bold tracking-[-0.01em] px-[14px] py-[7px] rounded-full hover:bg-white hover:text-[#000] transition-colors duration-200"
              >
                {line.cta[c]}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ── 4. Full-width banner ─────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "400px" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=2000&auto=format&fit=crop)" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <FadeIn className="absolute inset-0 flex flex-col items-center justify-center text-center px-[24px] gap-[14px] lg:gap-[18px]">
          <p className="font-mono text-[11px] text-white/60 tracking-[0.06em] uppercase">
            {c === "zh" ? "精准配方承诺" : "Formulation promise"}
          </p>
          <h2 className="font-display text-[36px] sm:text-[52px] lg:text-[64px] leading-[0.88] tracking-[-0.04em] text-white max-w-[700px]">
            {c === "zh" ? "为每种基材精准配方。" : "Formulated precisely for every substrate."}
          </h2>
          <Link
            href={`/${c}/contact`}
            className="mt-[8px] bg-white text-[#000] text-[13px] font-bold px-[22px] py-[11px] rounded-full hover:bg-white/90 transition-colors"
          >
            {c === "zh" ? "咨询配方方案" : "Discuss your application"}
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
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/${c}/products/${product.slug}`}
              className="group flex flex-col gap-[12px] lg:gap-[14px]"
            >
              {/* Product image */}
              <div className="relative w-full aspect-[3/4] rounded-[10px] lg:rounded-[12px] overflow-hidden bg-[#F3F3F3]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  style={{ backgroundImage: `url(${productImages[product.slug] ?? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop"})` }}
                />
              </div>
              {/* Product info */}
              <div className="flex flex-col gap-[4px]">
                <p className="font-mono text-[10px] lg:text-[11px] text-[#929292] tracking-[-0.01em]">
                  {product.category[c]}
                </p>
                <h3 className="font-bold text-[13px] lg:text-[14px] leading-[1.35] tracking-[-0.02em] text-[#000] group-hover:text-[#485C11] transition-colors duration-200">
                  {product.title[c]}
                </h3>
                <p className="text-[12px] lg:text-[13px] leading-[1.5] text-[#929292] mt-[2px]">
                  {product.summary[c].slice(0, 48)}…
                </p>
              </div>
            </Link>
          ))}
        </FadeInGroup>
      </section>

      {/* ── 6. Testimonial split ─────────────────────────────────────── */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left: quote */}
        <FadeIn
          direction="right"
          className="flex flex-col justify-center px-[32px] sm:px-[48px] lg:px-[80px] py-[60px] lg:py-[100px] gap-[28px] lg:gap-[36px] bg-[#fbfaf8] order-2 lg:order-1"
        >
          {/* Quote mark */}
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-[#485C11] shrink-0">
            <path d="M0 24V14.4C0 10.56 0.96 7.28 2.88 4.56C4.96 1.68 7.92 0 11.76 0L13.44 2.4C10.72 3.04 8.64 4.48 7.2 6.72C5.92 8.8 5.28 11.04 5.28 13.44H10.56V24H0ZM18.24 24V14.4C18.24 10.56 19.2 7.28 21.12 4.56C23.2 1.68 26.16 0 30 0L31.68 2.4C28.96 3.04 26.88 4.48 25.44 6.72C24.16 8.8 23.52 11.04 23.52 13.44H28.8V24H18.24Z" fill="currentColor"/>
          </svg>
          <p className="font-display text-[22px] lg:text-[28px] leading-[1.25] tracking-[-0.02em] text-[#000]">
            {testimonial.quote[c]}
          </p>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] font-bold leading-[1.3] tracking-[-0.02em] text-[#000]">
              {testimonial.author[c]}
            </p>
            <p className="font-mono text-[10px] lg:text-[11px] text-[#485C11] tracking-[-0.01em]">
              {testimonial.role[c]}
            </p>
          </div>
        </FadeIn>
        {/* Right: image */}
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
          <div key={panel.label.en} className="group relative overflow-hidden aspect-[4/3]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              style={{ backgroundImage: `url(${panel.img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-[24px] lg:p-[36px]">
              <h3 className="font-display text-[24px] lg:text-[32px] leading-[0.9] tracking-[-0.03em] text-white mb-[10px]">
                {panel.label[c]}
              </h3>
              <Link
                href={panel.href}
                className="text-[12px] lg:text-[13px] font-medium text-white/80 underline underline-offset-2 hover:text-white transition-colors"
              >
                {panel.cta[c]}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ── 8. Service promises ──────────────────────────────────────── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 py-[60px] lg:py-[80px] border-t border-[#EFEFEF]">
        <FadeInGroup stagger={0.08} className="grid grid-cols-2 lg:grid-cols-4 gap-[24px] lg:gap-[40px]">
          {promises.map(({ Icon, title, desc }) => (
            <div key={title.en} className="flex flex-col items-center text-center gap-[12px] lg:gap-[14px]">
              <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[14px] bg-[#DFECC6]">
                <Icon className="size-[20px] text-[#485C11]" strokeWidth={1.8} />
              </div>
              <p className="font-bold text-[13px] lg:text-[14px] leading-[1.3] tracking-[-0.02em] text-[#000]">
                {title[c]}
              </p>
              <p className="text-[12px] lg:text-[13px] leading-[1.55] tracking-[-0.005em] text-[#6F6F6F]">
                {desc[c]}
              </p>
            </div>
          ))}
        </FadeInGroup>
      </section>

    </main>
  );
}
