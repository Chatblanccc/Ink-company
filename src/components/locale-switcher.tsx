"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getOppositeLocale, localeLabels, type Locale } from "@/lib/i18n";

type LocaleSwitcherProps = {
  locale: Locale;
};

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const isHome = pathname === `/${locale}`;
  const otherLocale = getOppositeLocale(locale);
  const currentPrefix = `/${locale}`;
  const nextPath = pathname.startsWith(currentPrefix)
    ? pathname.replace(currentPrefix, `/${otherLocale}`)
    : `/${otherLocale}`;

  return (
    <Link
      href={nextPath}
      className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors ${
        isHome
          ? "border border-stone-300 bg-white/70 text-stone-900 hover:bg-white"
          : "border border-black/10 bg-white text-slate-900 hover:bg-slate-50"
      }`}
    >
      {localeLabels[otherLocale]}
    </Link>
  );
}
