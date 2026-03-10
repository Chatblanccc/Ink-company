import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

const biLang = z.object({ zh: z.string(), en: z.string() });

const updateSchema = z.object({
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
  scenarioTags: z.array(z.string()).optional().default([]),
  coverImage: z.string().nullable().optional(),
  samplingSteps: z.array(biLang).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth(req, "ANALYST");
  if (error) return error;

  const { id } = await params;
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;

  const { id } = await params;
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const category = await prisma.productCategory.upsert({
    where: { slug: data.categorySlug },
    update: {},
    create: {
      slug: data.categorySlug,
      name: { zh: data.categorySlug, en: data.categorySlug },
    },
  });

  const product = await prisma.product.update({
    where: { id },
    data: {
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
      scenarioTags: data.scenarioTags ?? [],
      coverImage: data.coverImage ?? null,
      samplingSteps: data.samplingSteps ?? [],
    },
    include: { category: true },
  });

  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;

  const { id } = await params;
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
