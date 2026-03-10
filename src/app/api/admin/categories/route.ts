import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

const schema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  nameZh: z.string().min(1),
  nameEn: z.string().min(1),
  sortOrder: z.number().int().optional().default(0),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "ANALYST");
  if (error) return error;
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  const categories = await prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { slug, nameZh, nameEn, sortOrder } = parsed.data;
  const existing = await prisma.productCategory.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  const category = await prisma.productCategory.create({
    data: { slug, name: { zh: nameZh, en: nameEn }, sortOrder },
  });
  return NextResponse.json({ category }, { status: 201 });
}
