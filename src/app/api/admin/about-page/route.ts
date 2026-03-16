import { NextResponse, type NextRequest } from "next/server";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";
import { aboutPageDefaults } from "@/lib/about-page-defaults";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "ANALYST");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const row = await prisma.aboutPageContent.findUnique({ where: { id: "about-page" } });

  const heroCards = Array.isArray(row?.heroCards) && (row.heroCards as unknown[]).length > 0
    ? row.heroCards
    : aboutPageDefaults.heroCards;

  const data = {
    hero:      row?.hero   ?? aboutPageDefaults.hero,
    heroCards,
    stats:     row?.stats  ?? aboutPageDefaults.stats,
    team:      row?.team   ?? aboutPageDefaults.team,
    values:    row?.values ?? aboutPageDefaults.values,
    cta:       row?.cta    ?? aboutPageDefaults.cta,
  };

  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const body = await req.json();

  const row = await prisma.aboutPageContent.upsert({
    where: { id: "about-page" },
    update: {
      hero:      body.hero,
      heroCards: body.heroCards,
      stats:     body.stats,
      team:      body.team,
      values:    body.values,
      cta:       body.cta,
    },
    create: {
      id:        "about-page",
      hero:      body.hero      ?? aboutPageDefaults.hero,
      heroCards: body.heroCards ?? aboutPageDefaults.heroCards,
      stats:     body.stats     ?? aboutPageDefaults.stats,
      team:      body.team      ?? aboutPageDefaults.team,
      values:    body.values    ?? aboutPageDefaults.values,
      cta:       body.cta       ?? aboutPageDefaults.cta,
    },
  });

  return NextResponse.json({ data: row });
}
