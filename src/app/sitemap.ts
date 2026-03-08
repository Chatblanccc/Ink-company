import type { MetadataRoute } from "next";

import { articles, products } from "@/lib/demo-data";
import { locales } from "@/lib/i18n";
import { buildAbsoluteUrl } from "@/lib/site-config";

const staticRoutes = ["", "/products", "/news", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedStaticRoutes = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: buildAbsoluteUrl(route ? `/${locale}${route}` : `/${locale}`),
      lastModified: new Date(),
      alternates: {
        languages: {
          zh: buildAbsoluteUrl(route ? `/zh${route}` : "/zh"),
          en: buildAbsoluteUrl(route ? `/en${route}` : "/en"),
        },
      },
    })),
  );

  const productRoutes = locales.flatMap((locale) =>
    products.map((product) => ({
      url: buildAbsoluteUrl(`/${locale}/products/${product.slug}`),
      lastModified: new Date(),
      alternates: {
        languages: {
          zh: buildAbsoluteUrl(`/zh/products/${product.slug}`),
          en: buildAbsoluteUrl(`/en/products/${product.slug}`),
        },
      },
    })),
  );

  const articleRoutes = locales.flatMap((locale) =>
    articles.map((article) => ({
      url: buildAbsoluteUrl(`/${locale}/news/${article.slug}`),
      lastModified: new Date(article.publishedAt),
      alternates: {
        languages: {
          zh: buildAbsoluteUrl(`/zh/news/${article.slug}`),
          en: buildAbsoluteUrl(`/en/news/${article.slug}`),
        },
      },
    })),
  );

  return [...localizedStaticRoutes, ...productRoutes, ...articleRoutes];
}
