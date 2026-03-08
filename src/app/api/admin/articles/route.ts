import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

const localizedText = z.object({ zh: z.string(), en: z.string() });

const articleSchema = z.object({
  slug: z.string().min(1),
  type: z.enum(["NEWS", "CASE_STUDY", "INSIGHT"]).default("INSIGHT"),
  category: localizedText,
  title: localizedText,
  excerpt: localizedText,
  content: localizedText,
  seoTitle: localizedText,
  seoDescription: localizedText,
  publishedAt: z.string().datetime(),
  featured: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "ANALYST");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json(articles);
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

  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const article = await prisma.article.create({
    data: {
      ...parsed.data,
      publishedAt: new Date(parsed.data.publishedAt),
    },
  });

  return NextResponse.json(article, { status: 201 });
}
