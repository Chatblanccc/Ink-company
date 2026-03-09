import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { getPrismaClient } from "@/lib/prisma";
import { buildAbsoluteUrl } from "@/lib/site-config";
import { products as fallbackProducts, articles as fallbackArticles } from "@/lib/demo-data";

const staticRoutes = ["", "/products", "/news", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prisma = getPrismaClient();

  // Fetch real slugs from DB, fall back to demo data if unavailable
  let productSlugs: string[] = fallbackProducts.map((p) => p.slug);
  let articleEntries: { slug: string; publishedAt: Date }[] = fallbackArticles.map((a) => ({
    slug: a.slug,
    publishedAt: new Date(a.publishedAt),
  }));

  if (prisma) {
    try {
      const [dbProducts, dbArticles] = await Promise.all([
        prisma.product.findMany({ select: { slug: true } }),
        prisma.article.findMany({ select: { slug: true, publishedAt: true } }),
      ]);
      if (dbProducts.length > 0) productSlugs = dbProducts.map((p) => p.slug);
      if (dbArticles.length > 0) articleEntries = dbArticles.map((a) => ({
        slug: a.slug,
        publishedAt: a.publishedAt,
      }));
    } catch {
      // fall back to demo data
    }
  }

  const localizedStaticRoutes = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: buildAbsoluteUrl(route ? `/${locale}${route}` : `/${locale}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          zh: buildAbsoluteUrl(route ? `/zh${route}` : "/zh"),
          en: buildAbsoluteUrl(route ? `/en${route}` : "/en"),
        },
      },
    })),
  );

  const productRoutes = locales.flatMap((locale) =>
    productSlugs.map((slug) => ({
      url: buildAbsoluteUrl(`/${locale}/products/${slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          zh: buildAbsoluteUrl(`/zh/products/${slug}`),
          en: buildAbsoluteUrl(`/en/products/${slug}`),
        },
      },
    })),
  );

  const articleRoutes = locales.flatMap((locale) =>
    articleEntries.map(({ slug, publishedAt }) => ({
      url: buildAbsoluteUrl(`/${locale}/news/${slug}`),
      lastModified: publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          zh: buildAbsoluteUrl(`/zh/news/${slug}`),
          en: buildAbsoluteUrl(`/en/news/${slug}`),
        },
      },
    })),
  );

  return [...localizedStaticRoutes, ...productRoutes, ...articleRoutes];
}
