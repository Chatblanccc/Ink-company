import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

const localizedText = z.object({ zh: z.string(), en: z.string() });

const patchSchema = z.object({
  slug: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  title: localizedText.optional(),
  summary: localizedText.optional(),
  heroTag: localizedText.optional(),
  seoTitle: localizedText.optional(),
  seoDescription: localizedText.optional(),
  applications: z.array(localizedText).optional(),
  features: z.array(localizedText).optional(),
  specifications: z
    .array(z.object({ label: localizedText, value: localizedText }))
    .optional(),
  featured: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const { error } = await requireAuth(_req, "EDITOR");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { id } = await ctx.params;

  try {
    await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
