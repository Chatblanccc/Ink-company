import { type Locale, defaultLocale, locales } from "@/lib/i18n";

export const siteConfig = {
  name: "油墨公司",
  defaultLocale,
  locales,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ink-company.com",
  email: "sales@ink-company.com",
  phone: "+86 400-800-8899",
  address: {
    zh: "中国上海市嘉定区智造大道 88 号",
    en: "No. 88 Zhizao Avenue, Jiading District, Shanghai, China",
  } satisfies Record<Locale, string>,
  social: {
    linkedin: "https://www.linkedin.com/company/ink-company",
  },
};

export function buildAbsoluteUrl(pathname = "/") {
  return new URL(pathname, siteConfig.siteUrl).toString();
}
