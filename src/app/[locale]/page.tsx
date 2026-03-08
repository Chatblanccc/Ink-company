import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { FadeIn, FadeInGroup } from "@/components/fade-in";
import { SchemaScript } from "@/components/schema-script";
import { getLocaleFromString } from "@/lib/i18n";
import {
  buildMetadata,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "@/lib/seo";
import { homepageDefaults, type HomepageData } from "@/lib/homepage-defaults";
import { getPrismaClient } from "@/lib/prisma";

async function getHomepageContent(): Promise<HomepageData> {
  const prisma = getPrismaClient();
  if (!prisma) return homepageDefaults;
  try {
    const row = await prisma.homepageContent.findUnique({ where: { id: "home" } });
    if (!row) return homepageDefaults;
    return {
      hero: row.hero as HomepageData["hero"],
      device: (row.device ?? homepageDefaults.device) as HomepageData["device"],
      benefits: row.benefits as HomepageData["benefits"],
      bigPicture: row.bigPicture as HomepageData["bigPicture"],
      specs: row.specs as HomepageData["specs"],
      testimonial: row.testimonial as HomepageData["testimonial"],
      howTo: row.howTo as HomepageData["howTo"],
      cta: row.cta as HomepageData["cta"],
      images: row.images as HomepageData["images"],
    };
  } catch {
    return homepageDefaults;
  }
}


const trustedBrands = [
  { name: "Sun Chemical", style: "text-[13px] lg:text-[15px] font-black tracking-tight uppercase" },
  { name: "Flint Group", style: "text-[14px] lg:text-[16px] font-bold tracking-[-0.02em]" },
  { name: "Siegwerk", style: "text-[14px] lg:text-[17px] font-extrabold tracking-[-0.03em] uppercase" },
  { name: "Toyo Ink", style: "text-[13px] lg:text-[15px] font-black tracking-widest uppercase" },
  { name: "Sakata INX", style: "text-[13px] lg:text-[15px] font-bold tracking-[-0.01em]" },
  { name: "hubergroup", style: "text-[13px] lg:text-[15px] font-bold tracking-tight lowercase" },
];

const specsFeatures = [
  { zh: "配方定制开发", en: "Custom formulation" },
  { zh: "Pantone 色彩管理", en: "Pantone color management" },
  { zh: "72h 打样周期", en: "72h sampling turnaround" },
  { zh: "法规合规文件", en: "Regulatory documentation" },
  { zh: "全球交付支持", en: "Global delivery support" },
  { zh: "量产色差管控", en: "Production color control" },
];

const specsCols = {
  us: { zh: "油墨公司", en: "Ink Co." },
  generic: { zh: "通用供应商", en: "Generic Supplier" },
  local: { zh: "本地混配商", en: "Local Mixer" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = getLocaleFromString(locale);
  return buildMetadata({ locale: safeLocale, pathname: "/" });
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = getLocaleFromString(locale);
  const c = safeLocale;

  const copy = await getHomepageContent();

  return (
    <>
      <main className="bg-[#fbfaf8] overflow-hidden min-h-screen">

        {/* ── Hero ── */}
        <section className="relative flex flex-col items-center">

          {/* ── Mobile hero ── */}
          <div className="flex md:hidden flex-col items-center w-full px-4 pt-[120px] gap-[80px] pb-0">
            <h1 className="font-display w-full text-center text-[68px] leading-[0.85] tracking-[-0.045em] text-[#000]">
              {copy.hero.title[c]}
            </h1>

            {/* Green pill */}
            <div className="relative w-full" style={{ height: "362px" }}>
              <div className="absolute inset-0 bg-[#8E9C78] rounded-[30px]" />
              <div
                className="absolute z-10 bg-[#000] border border-[#929292]"
                style={{
                  width: "270px",
                  height: "541.82px",
                  left: "calc(50% - 135px)",
                  top: "calc(50% - 229.91px)",
                  borderRadius: "34.66px",
                  boxShadow: "0px -2.34px 11.71px rgba(0,0,0,0.1)",
                  clipPath: "inset(0px 0px 131px 0px)",
                }}
              >
                <div
                  className="absolute overflow-hidden"
                  style={{
                    left: "10.95px",
                    right: "10.95px",
                    top: "10.03px",
                    bottom: "10.03px",
                    borderRadius: "27.36px",
                    backgroundImage: `linear-gradient(180deg,rgba(20,38,14,0.82) 0%,rgba(35,58,22,0.70) 50%,rgba(50,80,35,0.55) 100%),url(${copy.images.hero})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute bg-black rounded-full z-20" style={{ width: "94px", height: "22px", left: "calc(50% - 51.8px)", top: "8px" }} />
                  <div className="absolute flex justify-between items-center z-20" style={{ top: "16px", left: "20px", right: "20px" }}>
                    <span className="text-white text-[10px] font-semibold">9:41</span>
                    <div className="flex items-center gap-[4px]">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="6" width="2" height="4" rx="0.5" fill="white"/><rect x="3" y="4" width="2" height="6" rx="0.5" fill="white"/><rect x="6" y="2" width="2" height="8" rx="0.5" fill="white"/><rect x="9" y="0" width="2" height="10" rx="0.5" fill="white"/>
                      </svg>
                      <svg width="22" height="10" viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="18" height="9" rx="2.5" stroke="white" strokeOpacity="0.5"/><rect x="2" y="2" width="13" height="6" rx="1" fill="white"/><path d="M20 3.5V6.5C20.8 6.2 21.5 5.5 21.5 5C21.5 4.5 20.8 3.8 20 3.5Z" fill="white" fillOpacity="0.4"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute z-10" style={{ top: "52px", left: "20px", right: "20px" }}>
                    <div className="text-white/60 text-[8px] uppercase tracking-widest font-medium mb-3">{copy.device.label[c]}</div>
                    <div className="text-white font-display text-[42px] font-medium leading-none tracking-tight mb-1">{copy.device.value}</div>
                    <div className="text-white/80 text-[12px]">{copy.device.metric[c]}</div>
                    <div className="absolute top-0 right-0 flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[8px] text-white backdrop-blur-sm">
                      {copy.device.filter[c]}
                      <svg width="6" height="4" viewBox="0 0 6 4" fill="none"><path d="M1 1L3 3L5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                  <div className="absolute flex justify-between text-white/50 text-[8px] font-medium" style={{ top: "160px", left: "20px", right: "20px" }}>
                    <span>2021</span><span>2022</span><span>2023</span><span>2024</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[55%] flex items-end justify-between px-5 pb-6">
                    {[...Array(14)].map((_, i) => {
                      const heights = [55, 62, 58, 70, 65, 75, 72, 82, 86, 90, 88, 93, 95, 100];
                      const height = heights[i % heights.length];
                      return (
                        <div key={i} className="relative flex flex-col items-center w-1.5 h-full justify-end">
                          <div className="w-[1px] bg-white/50" style={{ height: `${height}%` }} />
                          <div className="w-[5px] h-[5px] bg-white absolute" style={{ bottom: `${height}%` }} />
                          <div className="w-[5px] h-[5px] bg-white/70 absolute bottom-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Desktop hero ── */}
          <div className="hidden md:flex flex-col items-start gap-[240px] w-full max-w-[1200px] pt-[80px] pb-12">
            <FadeIn duration={0.8} offset={16}>
              <h1 className="font-display w-full text-center text-[120px] leading-[0.85] tracking-[-0.05em] text-[#000] lg:whitespace-nowrap mt-0 mb-0 pt-[50px]">
                {copy.hero.title[c]}
              </h1>
            </FadeIn>
            <div className="relative w-full h-[362px]">
              <div className="absolute inset-0 bg-[#8E9C78] rounded-[30px]" />
              <div
                className="box-border absolute w-[907px] h-[644px] left-[calc(50%-453.5px)] top-[-141px] bg-[#000] border-t-[2px] border-r-[2px] border-l-[2px] border-b-0 border-white/50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-[24px] z-10"
                style={{ clipPath: "inset(0px 0px 141px 0px)" }}
              >
                <div
                  className="absolute w-[869.74px] h-[607.44px] left-[calc(50%-434.87px)] top-[18.5px] rounded-[16px] overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(180deg,rgba(20,38,14,0.82) 0%,rgba(35,58,22,0.70) 50%,rgba(50,80,35,0.55) 100%),url(${copy.images.hero})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute top-6 left-8 text-white/80 text-[10px] uppercase tracking-wider font-medium">{copy.device.label[c]}</div>
                  <div className="absolute top-20 left-8 flex items-end gap-3">
                    <div className="font-display text-white text-[4rem] font-medium tracking-tight leading-none">{copy.device.value}</div>
                    <div className="text-white text-lg pb-2 tracking-tight">{copy.device.metric[c]}</div>
                  </div>
                  <div className="absolute top-20 right-8 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                    {copy.device.filter[c]}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="absolute top-44 left-8 right-8 flex justify-between text-white/70 text-[10px] font-medium px-4">
                    <span>2021</span><span>2022</span><span>2023</span><span>2024</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[50%] flex items-end justify-between px-12 pb-10">
                    {[...Array(18)].map((_, i) => {
                      const heights = [55, 62, 58, 70, 65, 75, 72, 82, 78, 86, 84, 90, 88, 93, 91, 97, 95, 100];
                      const height = heights[i % heights.length];
                      return (
                        <div key={i} className="relative flex flex-col items-center w-2 h-full justify-end">
                          <div className="w-[1px] bg-white/60" style={{ height: `${height}%` }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-white absolute" style={{ bottom: `${height}%` }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/80 absolute bottom-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trusted by ── */}
        <section className="flex flex-col items-center py-[40px] lg:py-[50px] gap-[20px] lg:gap-[30px] w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-0">
          <FadeIn className="w-full max-w-[1200px]">
            <p className="text-[13px] lg:text-[15px] leading-[1.4] tracking-[-0.005em] text-[#6F6F6F]">
              {c === "zh" ? "合作品牌：" : "Trusted by global brands:"}
            </p>
          </FadeIn>
          <FadeInGroup baseDelay={0.05} className="flex flex-wrap justify-start lg:justify-center items-center gap-x-[32px] lg:gap-x-[48px] gap-y-[16px] lg:gap-y-[24px] w-full max-w-[1200px]">
            {trustedBrands.map((item) => (
              <div key={item.name} className={`h-[36px] lg:h-[44px] flex items-center justify-center text-[#1a1a1a]/40 ${item.style}`}>
                {item.name}
              </div>
            ))}
          </FadeInGroup>
        </section>

        {/* ── Benefits ── */}
        <section id="benefits" className="flex flex-col items-start pb-[60px] lg:pb-[120px] w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col items-start pt-[50px] lg:pt-[80px] pb-[40px] lg:pb-[60px] gap-[30px] lg:gap-[50px] w-full border-t-[0.5px] border-[#E9E9E9]">
            <FadeIn className="flex flex-col items-start gap-[24px] lg:gap-[50px] w-full lg:pr-[400px]">
              <p className="font-mono text-[11px] lg:text-[12px] leading-[1.4] tracking-[-0.01em] text-[#485C11]">{copy.benefits.eyebrow[c]}</p>
              <h2 className="font-display text-[36px] sm:text-[48px] lg:text-[60px] leading-[0.9] tracking-[-0.03em] text-[#000]">{copy.benefits.heading[c]}</h2>
              <p className="text-[14px] lg:text-[15px] leading-[1.5] tracking-[-0.005em] text-[#6F6F6F]">{copy.benefits.sub[c]}</p>
            </FadeIn>
            <FadeInGroup stagger={0.08} className="flex flex-col sm:flex-row items-start pt-[20px] lg:pt-[40px] gap-[16px] lg:gap-[20px] w-full">
              {copy.benefits.cards.map((item) => (
                <div key={item.title.en} className="flex flex-col items-start py-[28px] lg:py-[40px] pr-[16px] lg:pr-[20px] gap-[18px] lg:gap-[24px] w-full sm:flex-1 sm:min-w-0 border-t border-[#E9E9E9]">
                  <div className="relative w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]">
                    <div className="absolute inset-[10%] bg-[#485C11]" />
                  </div>
                  <div className="flex flex-col items-start gap-[12px] lg:gap-[20px] w-full">
                    <h3 className="font-display text-[16px] lg:text-[18px] leading-[1] tracking-[-0.03em] text-[#000]">{item.title[c]}</h3>
                    <p className="text-[13px] lg:text-[15px] leading-[1.5] tracking-[-0.005em] text-[#6F6F6F]">{item.text[c]}</p>
                  </div>
                </div>
              ))}
            </FadeInGroup>
          </div>
          <FadeIn className="w-full">
            <div
              className="w-full h-[240px] sm:h-[380px] lg:h-[620px] bg-cover bg-center rounded-[20px] lg:rounded-[30px]"
              style={{ backgroundImage: `url(${copy.images.benefits})` }}
            />
          </FadeIn>
        </section>

        {/* ── From formula to full run ── */}
        <section className="flex flex-col lg:flex-row items-start pb-[60px] lg:pb-[120px] gap-[32px] lg:gap-[20px] w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col items-start pt-[40px] lg:pt-[60px] pb-[0px] lg:pb-[80px] gap-[30px] lg:gap-[40px] w-full lg:w-[590px] border-t border-[#E9E9E9]">
            <FadeIn className="flex flex-col items-start lg:pr-[80px] gap-[24px] lg:gap-[40px] w-full">
              <h2 className="font-display text-[36px] sm:text-[48px] lg:text-[60px] leading-[0.9] tracking-[-0.03em] text-[#000]">{copy.bigPicture.heading[c]}</h2>
              <p className="text-[14px] lg:text-[15px] leading-[1.5] tracking-[-0.005em] text-[#6F6F6F]">{copy.bigPicture.sub[c]}</p>
            </FadeIn>
            <div className="flex flex-col items-start w-full">
              {copy.bigPicture.steps.map((item) => (
                <div key={item.num} className="flex flex-row justify-center items-start py-[16px] lg:py-[20px] lg:pr-[80px] gap-[20px] lg:gap-[30px] w-full border-t border-[#E9E9E9]">
                  <div className="font-bold text-[13px] lg:text-[15px] leading-[1.4] tracking-[-0.005em] text-[#6F6F6F] shrink-0">{item.num}</div>
                  <div className="text-[13px] lg:text-[15px] leading-[1.5] tracking-[-0.005em] text-[#000] flex-1">{item.title[c]}</div>
                </div>
              ))}
            </div>
            <Link href={`/${safeLocale}/contact`} className="inline-flex flex-col justify-center items-center py-[12px] lg:py-[14px] px-[20px] lg:px-[22px] bg-[#DFECC6] rounded-full text-[13px] lg:text-[14px] font-bold leading-[1.4] tracking-[-0.025em] text-[#000] hover:bg-[#d0e0b3] transition-colors">
              {copy.bigPicture.cta[c]}
            </Link>
          </div>
          <FadeIn delay={0.15} className="w-full lg:w-[590px]">
            <div
              className="w-full h-[280px] sm:h-[400px] lg:h-[711px] bg-cover bg-center rounded-[20px] lg:rounded-[30px]"
              style={{ backgroundImage: `linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.05)),url(${copy.images.bigPicture})` }}
            />
          </FadeIn>
        </section>

        {/* ── Product range / Comparison ── */}
        <section id="specifications" className="flex flex-col items-start pb-[60px] lg:pb-[120px] gap-[20px] w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
          <FadeIn className="flex flex-col items-center py-[50px] lg:py-[80px] px-0 lg:px-[120px] gap-[24px] lg:gap-[40px] w-full border-t border-[#929292]">
            <div className="flex flex-col items-center gap-[24px] lg:gap-[40px] w-full lg:w-full">
              <p className="font-mono text-[11px] lg:text-[12px] leading-[1.4] tracking-[-0.01em] text-center text-[#485C11]">{copy.specs.eyebrow[c]}</p>
              <h2 className="font-display text-[32px] sm:text-[44px] lg:text-[60px] leading-[0.9] tracking-[-0.03em] text-center text-[#000] lg:whitespace-nowrap">{copy.specs.heading[c]}</h2>
              <p className="text-[13px] lg:text-[15px] leading-[1.5] tracking-[-0.005em] text-center text-[#6F6F6F]">{copy.specs.sub[c]}</p>
              <Link href={`/${safeLocale}/products`} className="inline-flex flex-col justify-center items-center py-[12px] lg:py-[14px] px-[20px] lg:px-[22px] bg-[#DFECC6] rounded-full text-[13px] lg:text-[14px] font-bold leading-[1.4] tracking-[-0.025em] text-[#000] hover:bg-[#d0e0b3] transition-colors">
                {copy.specs.cta[c]}
              </Link>
            </div>
          </FadeIn>

          {/* Mobile: feature list */}
          <div className="block lg:hidden w-full">
            <div className="rounded-[16px] bg-white border border-[#E9E9E9] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#929292]">
                <div className="font-bold text-[16px] tracking-[-0.04em] text-[#000]">{specsCols.us[c]}</div>
              </div>
              {specsFeatures.map((f, i) => (
                <div key={i} className="flex items-center px-5 py-4 gap-3 border-b border-[#E9E9E9] last:border-b-0">
                  <div className="w-[18px] h-[18px] bg-[#485C11] text-white rounded-full flex items-center justify-center shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="text-[14px] leading-[1.4] text-[#000]">{f[c]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: comparison table */}
          <div className="hidden lg:flex flex-row items-start w-full h-[582px] overflow-x-auto rounded-[20px]">
            <div className="flex flex-col items-start w-[400px] min-w-[200px] bg-white border border-[#E9E9E9] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] z-10 relative">
              <div className="flex justify-center items-start py-[40px] px-[30px] w-full border-b border-[#929292] h-[96px]">
                <div className="font-medium text-[22px] leading-[1.2] tracking-[-0.06em] text-[#000]">{specsCols.us[c]}</div>
              </div>
              {specsFeatures.map((f, i) => (
                <div key={i} className="flex items-center py-[22px] px-[30px] gap-[10px] w-full border-b border-[#E9E9E9] h-[81px]">
                  <div className="w-[14px] h-[14px] bg-[#485C11] text-white rounded-full flex items-center justify-center p-0.5 shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="font-mono text-[12px] leading-[1.4] tracking-[-0.01em] text-[#000]">{f[c]}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start w-[400px] min-w-[200px] h-[582px]">
              <div className="flex justify-center items-start py-[40px] px-[30px] w-full border-b border-[#929292] h-[96px]">
                <div className="font-medium text-[20px] leading-[1.2] tracking-[-0.06em] text-[#6F6F6F]">{specsCols.generic[c]}</div>
              </div>
              {specsFeatures.map((_, i) => (
                <div key={i} className="flex items-center py-[22px] px-[30px] gap-[10px] w-full border-b border-[#E9E9E9] h-[81px]">
                  {i < 2 ? (
                    <div className="w-[14px] h-[14px] bg-[#6F6F6F] text-white rounded-full flex items-center justify-center p-0.5 shrink-0">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  ) : (
                    <div className="w-[14px] h-[14px] text-[#6F6F6F] flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                  <div className="font-mono text-[12px] leading-[1.4] tracking-[-0.01em] text-[#6F6F6F]">
                    {i < 2 ? (c === "zh" ? "标准支持" : "Standard") : (c === "zh" ? "不支持" : "Not available")}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start w-[400px] min-w-[200px] h-[582px]">
              <div className="flex justify-center items-start py-[40px] px-[30px] w-full border-b border-[#929292] h-[96px]">
                <div className="font-medium text-[20px] leading-[1.2] tracking-[-0.06em] text-[#6F6F6F] font-mono">{specsCols.local[c]}</div>
              </div>
              {specsFeatures.map((_, i) => (
                <div key={i} className="flex items-center py-[22px] px-[30px] gap-[10px] w-full border-b border-l border-[#E9E9E9] h-[81px]">
                  <div className="w-[14px] h-[14px] text-[#6F6F6F] flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="font-mono text-[12px] leading-[1.4] tracking-[-0.01em] text-[#6F6F6F]">{c === "zh" ? "不支持" : "Not available"}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonial ── */}
        <section className="flex flex-col lg:flex-row items-start pb-[60px] lg:pb-[120px] gap-[24px] lg:gap-[20px] w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
          <FadeIn direction="right" className="w-full lg:w-[590px] shrink-0">
            <div
              className="w-full h-[280px] sm:h-[380px] lg:h-[669px] bg-cover bg-center rounded-[20px] lg:rounded-[30px]"
              style={{ backgroundImage: `url(${copy.images.testimonial})` }}
            />
          </FadeIn>
          <FadeIn delay={0.15} direction="left" className="flex flex-col justify-center items-start lg:pl-[50px] gap-[32px] lg:gap-[50px] w-full lg:w-[590px] border-t border-[#E9E9E9] pt-[28px] lg:pt-0 lg:h-[669px]">
            <h2 className="font-display text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.15] lg:leading-[1.1] tracking-[-0.03em] text-[#000]">
              &ldquo;{copy.testimonial.quote[c]}&rdquo;
            </h2>
            <div className="flex flex-col items-start gap-[6px] lg:gap-[8px] w-full">
              <p className="text-[14px] lg:text-[15px] leading-[1.4] tracking-[-0.005em] text-[#000]">{copy.testimonial.author[c]}</p>
              <p className="font-mono text-[11px] lg:text-[12px] leading-[1.4] tracking-[-0.01em] text-[#485C11]">{copy.testimonial.role[c]}</p>
            </div>
          </FadeIn>
        </section>

        {/* ── How to work with us ── */}
        <section id="how-to" className="flex flex-col items-start pt-[50px] lg:pt-[80px] pb-[60px] lg:pb-[120px] gap-[40px] lg:gap-[80px] w-full max-w-[1200px] mx-auto border-t border-[#E9E9E9] px-4 sm:px-6 lg:px-0">
          <FadeIn className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-[20px] w-full">
            <h2 className="font-display text-[36px] sm:text-[48px] lg:text-[60px] leading-[0.9] tracking-[-0.03em] text-[#000]">{copy.howTo.heading[c]}</h2>
            <Link href={`/${safeLocale}/contact`} className="inline-flex self-start sm:self-auto flex-col justify-center items-center py-[12px] lg:py-[14px] px-[20px] lg:px-[22px] bg-[#DFECC6] rounded-full text-[13px] lg:text-[14px] font-bold leading-[1.4] tracking-[-0.025em] text-[#000] hover:bg-[#d0e0b3] transition-colors whitespace-nowrap shrink-0">
              {copy.howTo.cta[c]}
            </Link>
          </FadeIn>
          <FadeInGroup stagger={0.08} className="flex flex-col sm:flex-row justify-center items-start gap-[0px] sm:gap-[20px] w-full">
            {copy.howTo.steps.map((item) => (
              <div key={item.num} className="flex flex-row sm:flex-col items-start pt-[28px] lg:pt-[60px] pb-[28px] sm:pb-[20px] pr-0 sm:pr-[30px] gap-[20px] sm:gap-[60px] w-full sm:flex-1 sm:min-w-[200px] border-t border-[#E9E9E9]">
                <div className="font-sans text-[40px] sm:text-[80px] leading-[1] tracking-[-0.04em] text-[#929292] shrink-0 sm:shrink">{item.num}</div>
                <div className="flex flex-col items-start gap-[10px] lg:gap-[20px] w-full">
                  <h3 className="font-display text-[16px] lg:text-[18px] leading-[1.1] tracking-[-0.03em] text-[#000]">{item.title[c]}</h3>
                  <p className="text-[13px] lg:text-[15px] leading-[1.5] tracking-[-0.005em] text-[#6F6F6F]">{item.text[c]}</p>
                </div>
              </div>
            ))}
          </FadeInGroup>
        </section>

        {/* ── Full-width image ── */}
        <section className="flex flex-col items-center pb-[30px] lg:pb-[40px] gap-[10px] w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
          <FadeIn className="w-full">
            <div
              className="w-full h-[240px] sm:h-[400px] lg:h-[664px] bg-cover bg-center rounded-[20px] lg:rounded-[30px]"
              style={{ backgroundImage: `url(${copy.images.fullwidth})` }}
            />
          </FadeIn>
        </section>

        {/* ── CTA ── */}
        <section className="flex flex-col items-center py-[60px] sm:py-[80px] lg:py-[120px] px-4 sm:px-8 lg:px-[300px] gap-[24px] lg:gap-[40px] w-full max-w-[1200px] mx-auto border-t-[0.5px] border-[#E9E9E9]">
          <FadeIn className="flex flex-col items-center gap-[24px] lg:gap-[40px] w-full">
            <h2 className="font-display text-[36px] sm:text-[48px] lg:text-[60px] leading-[0.9] tracking-[-0.03em] text-center text-[#000]">{copy.cta.heading[c]}</h2>
            <p className="text-[14px] lg:text-[15px] leading-[1.5] tracking-[-0.005em] text-center text-[#6F6F6F]">{copy.cta.sub[c]}</p>
            <Link href={`/${safeLocale}/contact`} className="inline-flex flex-row justify-center items-center py-[14px] px-[22px] gap-[4px] w-full max-w-[600px] bg-[#485C11] rounded-full hover:bg-[#3d4a1c] transition-colors">
              <span className="text-[14px] font-bold leading-[1.4] tracking-[-0.025em] text-center text-white">{copy.cta.btn[c]}</span>
              <ArrowUpRight className="size-[14px] text-white" strokeWidth={2.5} />
            </Link>
          </FadeIn>
        </section>

      </main>
    </>
  );
}
