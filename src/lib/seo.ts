import type { Metadata } from "next";

import { type Article, type Product, seoDefaults, t } from "@/lib/demo-data";
import { type Locale, locales } from "@/lib/i18n";
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config";

/* ─── Default keywords per locale ───────────────────────────────────── */

const defaultKeywords: Record<Locale, string[]> = {
  zh: [
    "油墨", "工业油墨", "包装印刷", "标签油墨", "UV油墨", "水性油墨",
    "柔版印刷", "凹印油墨", "功能油墨", "商业印刷", "油墨供应商",
    "色彩管理", "印刷耗材",
  ],
  en: [
    "industrial ink", "packaging ink", "label ink", "UV ink", "water-based ink",
    "flexo ink", "gravure ink", "functional ink", "commercial printing",
    "ink supplier", "color management", "printing consumables",
  ],
};

/* ─── Brand name appended to page titles ────────────────────────────── */

const brandSuffix: Record<Locale, string> = {
  zh: "| 油墨公司",
  en: "| Ink Company",
};

type MetadataInput = {
  locale: Locale;
  pathname: string;
  title?: string;
  description?: string;
  keywords?: string[];
  /** Optional OG image URL (absolute). Falls back to the global OG image. */
  ogImageUrl?: string;
  /** Pass "article" for blog/news pages to set OG type correctly */
  ogType?: "website" | "article";
  /** ISO-8601 string — only used when ogType === "article" */
  publishedAt?: string;
};

export function buildAlternates(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return {
    canonical: buildAbsoluteUrl(normalizedPath),
    languages: Object.fromEntries(
      [
        ...locales.map((locale) => [
          locale,
          buildAbsoluteUrl(`/${locale}${normalizedPath === "/" ? "" : normalizedPath}`),
        ]),
        ["x-default", buildAbsoluteUrl(`/zh${normalizedPath === "/" ? "" : normalizedPath}`)],
      ],
    ),
  };
}

export function buildMetadata({
  locale,
  pathname,
  title,
  description,
  keywords = [],
  ogImageUrl,
  ogType = "website",
  publishedAt,
}: MetadataInput): Metadata {
  const baseTitle = title ?? seoDefaults.title[locale];
  // Append brand unless the title already contains the brand name
  const brandStr = brandSuffix[locale];
  const pageTitle = baseTitle.includes("油墨公司") || baseTitle.includes("Ink Company")
    ? baseTitle
    : `${baseTitle} ${brandStr}`;

  const pageDescription = description ?? seoDefaults.description[locale];
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const localizedPath =
    normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;
  const url = buildAbsoluteUrl(localizedPath);

  const mergedKeywords = [...defaultKeywords[locale], ...keywords];

  const ogImages = ogImageUrl
    ? [{ url: ogImageUrl, width: 1200, height: 630 }]
    : undefined;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: mergedKeywords,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        [
          ...locales.map((targetLocale) => [
            targetLocale,
            buildAbsoluteUrl(
              normalizedPath === "/"
                ? `/${targetLocale}`
                : `/${targetLocale}${normalizedPath}`,
            ),
          ]),
          [
            "x-default",
            buildAbsoluteUrl(
              normalizedPath === "/" ? "/zh" : `/zh${normalizedPath}`,
            ),
          ],
        ],
      ),
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      locale,
      type: ogType,
      ...(ogImages && { images: ogImages }),
      ...(ogType === "article" && publishedAt
        ? { publishedTime: publishedAt }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export function buildOrganizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address[locale],
      addressCountry: "CN",
    },
    sameAs: [siteConfig.social.linkedin],
  };
}

export function buildWebsiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: buildAbsoluteUrl(`/${locale}`),
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${buildAbsoluteUrl(`/${locale}/products`)}?q={query}`,
      "query-input": "required name=query",
    },
  };
}

export function buildBreadcrumbSchema(
  locale: Locale,
  items: Array<{ name: string; pathname: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(`/${locale}${item.pathname}`),
    })),
  };
}

export function buildProductSchema(locale: Locale, product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: t(product.title, locale),
    description: t(product.summary, locale),
    category: t(product.category, locale),
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    additionalProperty: product.specifications.map((item) => ({
      "@type": "PropertyValue",
      name: t(item.label, locale),
      value: t(item.value, locale),
    })),
    url: buildAbsoluteUrl(`/${locale}/products/${product.slug}`),
  };
}

export function buildArticleSchema(locale: Locale, article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t(article.title, locale),
    description: t(article.excerpt, locale),
    inLanguage: locale,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: buildAbsoluteUrl(`/${locale}/news/${article.slug}`),
  };
}
