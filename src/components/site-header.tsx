"use client";

import Link from "next/link";
import { ArrowUpRight, Languages, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { type Locale, getOppositeLocale, localeLabels } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome =
    pathname === `/${locale}` ||
    pathname === `/${locale}/about` ||
    pathname === `/${locale}/news` ||
    pathname === `/${locale}/contact` ||
    pathname.startsWith(`/${locale}/news/`) ||
    pathname.startsWith(`/${locale}/products`);

  const oppositeLocale = getOppositeLocale(locale);
  const switchedPath = pathname.replace(`/${locale}`, `/${oppositeLocale}`);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLocaleSwitch() {
    router.push(switchedPath);
  }

  const navigation = [
    { href: `/${locale}/products`, label: locale === "zh" ? "全部产品" : "Products" },
    { href: `/${locale}/about`,    label: locale === "zh" ? "关于我们" : "About" },
    { href: `/${locale}/news`,     label: locale === "zh" ? "新闻与案例" : "News" },
    { href: `/${locale}/contact`,  label: locale === "zh" ? "联系我们" : "Contact" },
  ];

  if (isHome) {
    return (
      <header className="fixed inset-x-0 top-0 z-30 w-full pt-[20px] pointer-events-none">
        <div className="mx-auto flex justify-between lg:grid lg:grid-cols-3 w-full max-w-[1200px] items-center pointer-events-auto">

          {/* Col 1 — Logo (left-aligned) */}
          <div className="flex items-center">
            <Link
              href={`/${locale}`}
              className={`flex items-center transition-all duration-300 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <span className="text-[30px] font-medium leading-[1.2] tracking-[-0.05em] text-[#000]">Area</span>
            </Link>
          </div>

          {/* Col 2 — Nav (always centered) */}
          <div className="hidden lg:flex justify-center">
            <nav
              className={`flex items-center transition-all duration-300 ${
                scrolled
                  ? "gap-[4px] rounded-full bg-white/70 backdrop-blur-xl border border-black/10 shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-[6px] py-[6px]"
                  : "gap-[40px]"
              }`}
            >
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`transition-all duration-300 font-bold leading-[1.4] tracking-[-0.025em] text-[#000] hover:text-black/70 ${
                    scrolled
                      ? "text-[13px] px-[14px] py-[8px] rounded-full hover:bg-black/5 hover:text-black"
                      : "text-[14px]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Right actions (right-aligned) */}
          <div className="flex items-center justify-end gap-[12px]">
            {/* Default right actions (visible when not scrolled) */}
            <div className={`hidden lg:flex items-center gap-[12px] transition-all duration-300 ${scrolled ? "opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-100"}`}>
              <button
                type="button"
                onClick={handleLocaleSwitch}
                aria-label={`Switch to ${localeLabels[oppositeLocale]}`}
                className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-full border border-black/20 bg-white/80 text-[#000] transition-colors hover:bg-black/5"
              >
                <Languages className="size-[18px]" strokeWidth={2} />
              </button>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex h-[48px] items-center justify-center gap-[2px] rounded-full bg-[#485C11] px-[22px] py-[14px] text-[14px] font-bold leading-[1.4] tracking-[-0.025em] text-white transition-colors hover:bg-[#3d4a1c]"
              >
                {locale === "zh" ? "了解更多" : "Learn More"}
                <ArrowUpRight className="ml-1 size-[14px] opacity-90" strokeWidth={2.5} />
              </Link>
            </div>

            {/* Language icon only (visible when scrolled) */}
            <button
              type="button"
              onClick={handleLocaleSwitch}
              aria-label={`Switch to ${localeLabels[oppositeLocale]}`}
              className={`hidden lg:inline-flex h-[40px] w-[40px] items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-xl text-[#000] shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:bg-black/5 ${
                scrolled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <Languages className="size-[18px]" strokeWidth={2} />
            </button>

            {/* Mobile controls */}
            <div className="flex items-center gap-[8px] lg:hidden">
              <button
                type="button"
                onClick={handleLocaleSwitch}
                aria-label={`Switch to ${localeLabels[oppositeLocale]}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-white/80 text-[#000] transition-colors hover:bg-black/5"
              >
                <Languages className="size-[18px]" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[#1a1a1a] transition-colors hover:bg-black/5"
                aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <div
          className={`lg:hidden pointer-events-auto mx-4 mt-2 overflow-hidden rounded-[20px] border border-black/10 bg-white/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-all duration-300 ${
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[12px] px-4 py-3 text-[15px] font-bold tracking-[-0.025em] text-[#1a1a1a] hover:bg-black/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-black/8 pt-3">
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1 rounded-full bg-[#485C11] px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#3d4a1c]"
              >
                {locale === "zh" ? "了解更多" : "Learn More"}
                <ArrowUpRight className="ml-1 size-[14px] opacity-90" strokeWidth={2.5} />
              </Link>
            </div>
          </nav>
        </div>
      </header>
    );
  }

  // Non-home pages
  return (
    <header className="sticky top-0 z-30 w-full border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 text-slate-950 transition-opacity hover:opacity-90"
        >
          <span className="text-xl font-semibold tracking-tight">Area</span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex text-slate-700">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:text-slate-950 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={handleLocaleSwitch}
            aria-label={`Switch to ${localeLabels[oppositeLocale]}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-slate-950 transition-colors hover:bg-slate-100"
          >
            <Languages className="size-[18px]" strokeWidth={2} />
          </button>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex h-10 items-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            {locale === "zh" ? "立即开始" : "Start now"}
          </Link>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={handleLocaleSwitch}
            aria-label={`Switch to ${localeLabels[oppositeLocale]}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-slate-950 transition-colors hover:bg-slate-50"
          >
            <Languages className="size-[18px]" strokeWidth={2} />
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-slate-950 hover:bg-slate-50"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
