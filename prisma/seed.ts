import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import {
  articles,
  homeCopy,
  products,
  seoDefaults,
} from "../src/lib/demo-data";
import { PrismaClient } from "../src/generated/prisma/client";
import { siteConfig } from "../src/lib/site-config";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/ink_company",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await hash(
    process.env.ADMIN_PASSWORD ?? "admin123",
    10,
  );

  await prisma.user.upsert({
    where: {
      email: process.env.ADMIN_EMAIL ?? "admin@ink-company.com",
    },
    update: {
      name: "Administrator",
      role: "SUPER_ADMIN",
      passwordHash,
    },
    create: {
      name: "Administrator",
      email: process.env.ADMIN_EMAIL ?? "admin@ink-company.com",
      role: "SUPER_ADMIN",
      passwordHash,
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: "site" },
    update: {
      companyName: {
        zh: siteConfig.name,
        en: "Ink Company",
      },
      address: siteConfig.address,
      phone: siteConfig.phone,
      email: siteConfig.email,
      defaultSeoTitle: seoDefaults.title,
      defaultSeoDescription: seoDefaults.description,
      heroTitle: homeCopy.title,
      heroDescription: homeCopy.description,
    },
    create: {
      id: "site",
      companyName: {
        zh: siteConfig.name,
        en: "Ink Company",
      },
      address: siteConfig.address,
      phone: siteConfig.phone,
      email: siteConfig.email,
      defaultSeoTitle: seoDefaults.title,
      defaultSeoDescription: seoDefaults.description,
      heroTitle: homeCopy.title,
      heroDescription: homeCopy.description,
    },
  });

  const categoryMap = new Map<string, string>();

  for (const [index, product] of products.entries()) {
    const category = await prisma.productCategory.upsert({
      where: { slug: product.category.en.toLowerCase().replace(/\s+/g, "-") },
      update: {
        name: product.category,
        sortOrder: index,
      },
      create: {
        slug: product.category.en.toLowerCase().replace(/\s+/g, "-"),
        name: product.category,
        sortOrder: index,
      },
    });

    categoryMap.set(product.category.en, category.id);
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        categoryId: categoryMap.get(product.category.en)!,
        title: product.title,
        summary: product.summary,
        heroTag: product.heroTag,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        applications: product.applications,
        features: product.features,
        specifications: product.specifications,
        featured: product.featured,
      },
      create: {
        slug: product.slug,
        categoryId: categoryMap.get(product.category.en)!,
        title: product.title,
        summary: product.summary,
        heroTag: product.heroTag,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        applications: product.applications,
        features: product.features,
        specifications: product.specifications,
        featured: product.featured,
      },
    });
  }

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        category: article.category,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        publishedAt: new Date(article.publishedAt),
        featured: article.featured,
        type:
          article.category.en === "Case study"
            ? "CASE_STUDY"
            : article.category.en === "News"
              ? "NEWS"
              : "INSIGHT",
      },
      create: {
        slug: article.slug,
        category: article.category,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        publishedAt: new Date(article.publishedAt),
        featured: article.featured,
        type:
          article.category.en === "Case study"
            ? "CASE_STUDY"
            : article.category.en === "News"
              ? "NEWS"
              : "INSIGHT",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
