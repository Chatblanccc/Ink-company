import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ totalSeconds: 0 });
  try {
    const stats = await prisma.articleStats.findUnique({ where: { articleSlug: slug } });
    return NextResponse.json({ totalSeconds: stats?.totalSeconds ?? 0 });
  } catch {
    return NextResponse.json({ totalSeconds: 0 });
  }
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;

  let seconds: number;
  try {
    const body = await req.json();
    seconds = Number(body.seconds);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Clamp: reject nonsensical values (negative, zero, or > 5 minutes per ping)
  if (!Number.isFinite(seconds) || seconds <= 0 || seconds > 300) {
    return new NextResponse(null, { status: 204 });
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    await prisma.articleStats.upsert({
      where: { articleSlug: slug },
      create: { articleSlug: slug, totalSeconds: Math.round(seconds) },
      update: { totalSeconds: { increment: Math.round(seconds) } },
    });
  } catch {
    // Non-critical — silently ignore so the page never breaks
  }

  return new NextResponse(null, { status: 204 });
}
