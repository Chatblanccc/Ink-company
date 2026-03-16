import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Globe, ShieldCheck, Sparkles, Target, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { FadeIn, FadeInGroup } from "@/components/fade-in";
import { HeroPhotoCards } from "@/components/hero-photo-cards";
import { getLocaleFromString } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getPrismaClient } from "@/lib/prisma";
import { aboutPageDefaults } from "@/lib/about-page-defaults";

type L = { zh: string; en: string };

/* ─── Data ─────────────────────────────────────────────────────────── */

const stats: { value: string; label: L }[] = [
  { value: "28+",    label: { zh: "服务市场",   en: "Markets served" } },
  { value: "3,500+", label: { zh: "配方库",     en: "Formulas" } },
  { value: "72h",    label: { zh: "打样交付",   en: "Sampling turnaround" } },
];

const team: { src: string; name: L; role: L }[] = [
  {
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
    name: { zh: "张伟博士", en: "Dr. Wei Zhang" },
    role: { zh: "色彩科学总监", en: "Head of Color Science" },
  },
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    name: { zh: "Maria Chen", en: "Maria Chen" },
    role: { zh: "国际客户总监", en: "International Accounts" },
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    name: { zh: "王磊", en: "Lei Wang" },
    role: { zh: "质量管控总监", en: "Quality Director" },
  },
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop",
    name: { zh: "Sarah K.", en: "Sarah K." },
    role: { zh: "区域销售经理", en: "Regional Sales Manager" },
  },
  {
    src: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=600&auto=format&fit=crop",
    name: { zh: "陈阳", en: "Yang Chen" },
    role: { zh: "配方研发工程师", en: "Formula Engineer" },
  },
  {
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    name: { zh: "刘芳", en: "Fang Liu" },
    role: { zh: "色彩开发专员", en: "Color Development Spec." },
  },
  {
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
    name: { zh: "James Liu", en: "James Liu" },
    role: { zh: "技术支持工程师", en: "Technical Support" },
  },
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    name: { zh: "林美丽", en: "Mei Lin" },
    role: { zh: "合规文件专员", en: "Regulatory Specialist" },
  },
  {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
    name: { zh: "赵博", en: "Bo Zhao" },
    role: { zh: "生产总监", en: "Production Director" },
  },
];

const values: { Icon: LucideIcon; title: L; text: L }[] = [
  {
    Icon: Target,
    title: { zh: "配方精准", en: "Formulation precision" },
    text: {
      zh: "每一个配方都经过严格的实机验证，确保从目标色到量产的精准复现。",
      en: "Every formulation is rigorously validated on-press to ensure precise reproduction from target to production.",
    },
  },
  {
    Icon: Zap,
    title: { zh: "快速响应", en: "Speed of response" },
    text: {
      zh: "72 小时完成实机打样，48 小时内给出工程反馈，加速您的决策周期。",
      en: "72-hour on-press sampling and 48-hour engineering feedback to accelerate your decision cycle.",
    },
  },
  {
    Icon: ShieldCheck,
    title: { zh: "合规为本", en: "Compliance first" },
    text: {
      zh: "食品接触、REACH 和 RoHS 合规，完整文件体系，满足全球市场监管要求。",
      en: "Food-contact, REACH, and RoHS compliance with full documentation for global market access.",
    },
  },
  {
    Icon: Globe,
    title: { zh: "全球视野", en: "Global mindset" },
    text: {
      zh: "服务 28 个以上市场，中英双语支持，适配不同地区的供应链节奏与法规要求。",
      en: "Serving 28+ markets with bilingual support, adapted to regional supply chains and regulations.",
    },
  },
  {
    Icon: Users,
    title: { zh: "深度协同", en: "Deep collaboration" },
    text: {
      zh: "与客户生产团队紧密配合，从打样到量产全程支持，确保每批次稳定可控。",
      en: "Partnering with your production team from sampling to scale to ensure every batch stays on spec.",
    },
  },
  {
    Icon: Sparkles,
    title: { zh: "持续创新", en: "Continuous innovation" },
    text: {
      zh: "持续投入功能型油墨和工艺创新研究，为客户的未来产品需求储备技术方案。",
      en: "Ongoing investment in specialty ink innovation to build solutions for your future product needs.",
    },
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
    pathname: "/about",
    title: safeLocale === "zh" ? "关于我们 | 油墨公司" : "About | Ink Company",
    description:
      safeLocale === "zh"
        ? "了解油墨公司的制造能力、颜色管理、双语协同与联合开发模式。"
        : "Learn about Ink Company's manufacturing capability, color management, bilingual workflows, and co-development model.",
  });
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = getLocaleFromString(locale);

  /* ── Fetch hero cards from DB ─────────────────────────────────── */
  let heroCards = aboutPageDefaults.heroCards;
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const row = await prisma.aboutPageContent.findUnique({ where: { id: "about-page" } });
      if (row && Array.isArray(row.heroCards) && (row.heroCards as unknown[]).length >= 2) {
        heroCards = row.heroCards as typeof heroCards;
      }
    } catch { /* keep defaults */ }
  }

  return (
    <main className="overflow-hidden min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-[#fbfaf8] pt-[100px] lg:pt-[130px] pb-[60px] lg:pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">

          {/* Two-column: text left | staggered photos right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px] lg:gap-[80px] items-center">

            {/* Left: heading + body */}
            <FadeIn className="flex flex-col gap-[28px] lg:gap-[36px]">
              <h1 className="font-display text-[42px] sm:text-[58px] lg:text-[76px] leading-[0.87] tracking-[-0.04em] text-[#000]">
                {c === "zh"
                  ? "我们的愿景是让每次印刷都稳定可信。"
                  : "Our vision is reliable color, every single run."}
              </h1>
              <div className="flex flex-col gap-[14px] lg:gap-[16px]">
                <p className="text-[14px] lg:text-[15px] leading-[1.65] tracking-[-0.005em] text-[#6F6F6F]">
                  {c === "zh"
                    ? "从配方研发到批量出货，我们以稳定的色彩表现、严格的质量管控和流畅的双语协同，服务来自全球 28 个以上市场的包装与工业印刷客户。"
                    : "From formula development to full-scale delivery, we serve packaging and industrial print customers across 28+ markets with consistent color, rigorous quality control, and bilingual collaboration."}
                </p>
                <p className="text-[14px] lg:text-[15px] leading-[1.65] tracking-[-0.005em] text-[#6F6F6F]">
                  {c === "zh"
                    ? "我们的工程师与您的生产团队紧密合作，确保从 Pantone 目标色到每一个量产批次的精准一致。"
                    : "Our engineers work alongside your production team to ensure precise consistency from Pantone target to every production batch."}
                </p>
              </div>
            </FadeIn>

            {/* Right: staggered portrait cards — desktop only */}
            <FadeIn delay={0.15} className="hidden lg:block">
              <HeroPhotoCards locale={c} cards={heroCards} />
            </FadeIn>

            {/* Mobile: single hero image */}
            <div className="lg:hidden w-full h-[260px] rounded-[20px] overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <section className="w-full bg-[#111]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 py-[48px] lg:py-[64px]">
          <FadeInGroup
            stagger={0.1}
            className="flex flex-col sm:flex-row items-center justify-around gap-[36px] sm:gap-[20px]"
          >
            {stats.map((item) => (
              <div key={item.label.en} className="flex flex-col items-center gap-[6px]">
                <div className="font-display text-[52px] lg:text-[68px] leading-[0.88] tracking-[-0.04em] text-white">
                  {item.value}
                </div>
                <div className="font-mono text-[11px] lg:text-[12px] text-white/40 tracking-[-0.01em]">
                  {item.label[c]}
                </div>
              </div>
            ))}
          </FadeInGroup>
        </div>
      </section>

      {/* ── Meet the team ────────────────────────────────────────────── */}
      <section className="w-full bg-[#111] pb-[60px] lg:pb-[80px]">
        {/* Divider between stats and team */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
          <div className="w-full border-t border-white/10 mb-[48px] lg:mb-[64px]" />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
          <FadeIn className="flex flex-col items-center gap-[12px] lg:gap-[16px] mb-[36px] lg:mb-[52px]">
            <h2 className="font-display text-[32px] sm:text-[44px] lg:text-[56px] leading-[0.9] tracking-[-0.03em] text-white text-center">
              {c === "zh" ? "认识我们的团队" : "Meet the team"}
            </h2>
            <p className="text-[13px] lg:text-[14px] leading-[1.55] tracking-[-0.005em] text-white/40 text-center max-w-[520px]">
              {c === "zh"
                ? "来自色彩科学、化工工程和国际贸易领域的专家，共同为全球客户提供稳定可靠的油墨解决方案。"
                : "Experts from color science, chemical engineering, and international trade delivering reliable ink solutions worldwide."}
            </p>
          </FadeIn>

          <FadeInGroup
            stagger={0.05}
            className="grid grid-cols-2 sm:grid-cols-3 gap-[10px] lg:gap-[14px]"
          >
            {team.map((member) => (
              <div
                key={member.name.en}
                className="relative rounded-[16px] lg:rounded-[20px] overflow-hidden aspect-[3/4]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                  style={{ backgroundImage: `url(${member.src})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-[14px] py-[14px] lg:px-[18px] lg:py-[16px]">
                  <p className="font-bold text-[13px] lg:text-[14px] leading-[1.25] tracking-[-0.025em] text-white">
                    {member.name[c]}
                  </p>
                  <p className="font-mono text-[9px] lg:text-[10px] text-white/55 mt-[3px]">
                    {member.role[c]}
                  </p>
                </div>
              </div>
            ))}
          </FadeInGroup>
        </div>
      </section>

      {/* ── Core values ──────────────────────────────────────────────── */}
      <section className="w-full bg-white py-[60px] lg:py-[100px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
          <FadeIn className="flex flex-col items-center gap-[12px] lg:gap-[16px] mb-[40px] lg:mb-[60px]">
            <h2 className="font-display text-[32px] sm:text-[44px] lg:text-[56px] leading-[0.9] tracking-[-0.03em] text-[#000] text-center">
              {c === "zh" ? "我们的核心价值观" : "Our core values"}
            </h2>
            <p className="text-[13px] lg:text-[15px] leading-[1.55] tracking-[-0.005em] text-[#6F6F6F] text-center max-w-[540px]">
              {c === "zh"
                ? "这些原则驱动我们每一次配方决策、每一次客户沟通和每一批次的质量把控。"
                : "These principles drive every formulation decision, every client interaction, and every quality check."}
            </p>
          </FadeIn>

          <FadeInGroup
            stagger={0.07}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px] lg:gap-[18px]"
          >
            {values.map(({ Icon, title, text }) => (
              <div
                key={title.en}
                className="flex flex-col items-start gap-[18px] lg:gap-[22px] p-[24px] lg:p-[32px] rounded-[20px] border border-[#EBEBEB] bg-[#fbfaf8]"
              >
                <div className="flex items-center justify-center w-[44px] h-[44px] rounded-[12px] bg-[#DFECC6]">
                  <Icon className="size-[18px] text-[#485C11]" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <h3 className="font-display text-[17px] lg:text-[19px] leading-[1.1] tracking-[-0.03em] text-[#000]">
                    {title[c]}
                  </h3>
                  <p className="text-[13px] lg:text-[14px] leading-[1.6] tracking-[-0.005em] text-[#6F6F6F]">
                    {text[c]}
                  </p>
                </div>
              </div>
            ))}
          </FadeInGroup>
        </div>
      </section>

      {/* ── Join our team / CTA ──────────────────────────────────────── */}
      <section className="w-full relative overflow-hidden bg-[#0d0d0d]">
        {/* Background image with dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2000&auto=format&fit=crop)",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-[200px] py-[80px] lg:py-[130px]">
          <FadeIn className="flex flex-col items-center gap-[20px] lg:gap-[28px] text-center">
            <h2 className="font-display text-[38px] sm:text-[54px] lg:text-[72px] leading-[0.87] tracking-[-0.04em] text-white">
              {c === "zh" ? "加入我们的团队" : "Join our team"}
            </h2>
            <p className="text-[14px] lg:text-[15px] leading-[1.65] tracking-[-0.005em] text-white/50 max-w-[460px]">
              {c === "zh"
                ? "我们正在寻找对色彩科学、化工工程和国际业务充满热情的人才，共同服务全球客户。"
                : "We're looking for people passionate about color science, chemical engineering, and international business to serve customers worldwide."}
            </p>
            <Link
              href={`/${c}/contact`}
              className="inline-flex flex-row justify-center items-center gap-[6px] py-[14px] px-[28px] bg-[#485C11] rounded-full text-[14px] font-bold leading-[1.4] tracking-[-0.025em] text-white hover:bg-[#3d4a1c] transition-colors mt-[4px]"
            >
              {c === "zh" ? "立即联系" : "Contact us"}
              <ArrowUpRight className="size-[14px]" strokeWidth={2.5} />
            </Link>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
