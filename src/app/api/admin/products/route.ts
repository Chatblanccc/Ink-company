import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

const biLang = z.object({ zh: z.string(), en: z.string() });

const productSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers, hyphens"),
  categorySlug: z.string().min(1),
  title: biLang,
  summary: biLang,
  heroTag: biLang,
  seoTitle: biLang,
  seoDescription: biLang,
  applications: z.array(biLang),
  features: z.array(biLang),
  specifications: z.array(z.object({ label: biLang, value: biLang })),
  featured: z.boolean().optional().default(false),
  coverImage: z.string().nullable().optional(),
  samplingSteps: z.array(biLang).optional(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "ANALYST");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  // Upsert category by slug
  const category = await prisma.productCategory.upsert({
    where: { slug: data.categorySlug },
    update: {},
    create: {
      slug: data.categorySlug,
      name: { zh: data.categorySlug, en: data.categorySlug },
    },
  });

  const product = await prisma.product.create({
    data: {
      slug: data.slug,
      categoryId: category.id,
      title: data.title,
      summary: data.summary,
      heroTag: data.heroTag,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      applications: data.applications,
      features: data.features,
      specifications: data.specifications,
      featured: data.featured,
      coverImage: data.coverImage ?? null,
      samplingSteps: data.samplingSteps ?? [],
    },
    include: { category: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}
