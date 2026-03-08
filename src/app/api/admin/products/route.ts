import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

const localizedText = z.object({ zh: z.string(), en: z.string() });

const productSchema = z.object({
  slug: z.string().min(1),
  categoryId: z.string().min(1),
  title: localizedText,
  summary: localizedText,
  heroTag: localizedText,
  seoTitle: localizedText,
  seoDescription: localizedText,
  applications: z.array(localizedText),
  features: z.array(localizedText),
  specifications: z.array(
    z.object({ label: localizedText, value: localizedText })
  ),
  featured: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "ANALYST");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json(product, { status: 201 });
}
