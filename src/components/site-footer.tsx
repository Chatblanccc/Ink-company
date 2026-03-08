"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const c = locale;

  const nav = {
    products: {
      heading: { zh: "产品", en: "Products" },
      links: [
        { href: `/${c}/products`, label: { zh: "全部产品", en: "All Products" } },
        { href: `/${c}/products#packaging`, label: { zh: "包装印刷油墨", en: "Packaging Inks" } },
        { href: `/${c}/products#industrial`, label: { zh: "工业印刷油墨", en: "Industrial Inks" } },
        { href: `/${c}/products#specialty`, label: { zh: "特种油墨", en: "Specialty Inks" } },
      ],
    },
    company: {
      heading: { zh: "公司", en: "Company" },
      links: [
        { href: `/${c}/about`, label: { zh: "关于我们", en: "About Us" } },
        { href: `/${c}/news`, label: { zh: "新闻与案例", en: "News & Cases" } },
        { href: `/${c}/contact`, label: { zh: "联系我们", en: "Contact" } },
        { href: "/admin", label: { zh: "后台管理", en: "Admin" } },
      ],
    },
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#181e0c] text-white">
      {/* Top bar */}
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 pt-[60px] lg:pt-[80px] pb-[48px] lg:pb-[64px]">

        {/* Brand + columns */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-[48px] lg:gap-0 border-b border-white/10 pb-[48px] lg:pb-[64px]">

          {/* Brand */}
          <div className="flex flex-col gap-[20px] lg:w-[400px] lg:pr-[80px] shrink-0">
            <Link href={`/${c}`} className="font-display text-[28px] leading-[1] tracking-[-0.05em] text-white hover:text-white/80 transition-colors">
              Area
            </Link>
            <p className="text-[14px] leading-[1.6] tracking-[-0.005em] text-white/50 max-w-[280px]">
              {c === "zh"
                ? "为包装与工业印刷提供稳定、可溯源的色彩解决方案，服务全球 28 个以上市场。"
                : "Stable, traceable color solutions for packaging and industrial print across 28+ global markets."}
            </p>
            <Link
              href={`/${c}/contact`}
              className="inline-flex self-start items-center gap-[6px] rounded-full border border-white/20 px-[18px] py-[10px] text-[13px] font-bold tracking-[-0.02em] text-white hover:bg-white/10 transition-colors"
            >
              {c === "zh" ? "获取报价" : "Get a Quote"}
              <ArrowUpRight className="size-[13px]" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Nav columns */}
          <div className="flex flex-row flex-wrap gap-x-[64px] gap-y-[40px] flex-1">
            {Object.values(nav).map((col) => (
              <div key={col.heading.en} className="flex flex-col gap-[20px]">
                <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-white/30">
                  {col.heading[c]}
                </p>
                <ul className="flex flex-col gap-[12px]">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[14px] leading-[1.4] tracking-[-0.01em] text-white/60 hover:text-white transition-colors"
                      >
                        {link.label[c]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact column */}
            <div className="flex flex-col gap-[20px]">
              <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-white/30">
                {c === "zh" ? "联系方式" : "Contact"}
              </p>
              <ul className="flex flex-col gap-[12px]">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-[14px] leading-[1.4] tracking-[-0.01em] text-white/60 hover:text-white transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="text-[14px] leading-[1.4] tracking-[-0.01em] text-white/60 hover:text-white transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                </li>
                <li className="text-[14px] leading-[1.6] tracking-[-0.01em] text-white/40 max-w-[220px]">
                  {siteConfig.address[locale]}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] pt-[28px]">
          <p className="text-[12px] leading-[1.4] tracking-[-0.005em] text-white/30">
            © {year} {c === "zh" ? "油墨公司版权所有" : "Ink Company. All rights reserved."}
          </p>
          <div className="flex items-center gap-[24px]">
            <Link
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] tracking-[-0.005em] text-white/30 hover:text-white/60 transition-colors"
            >
              LinkedIn
            </Link>
            <Link href={`/${c === "zh" ? "en" : "zh"}`} className="text-[12px] tracking-[-0.005em] text-white/30 hover:text-white/60 transition-colors">
              {c === "zh" ? "English" : "中文"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
