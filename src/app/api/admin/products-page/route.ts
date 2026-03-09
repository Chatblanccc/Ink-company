import { NextResponse, type NextRequest } from "next/server";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";
import { productsPageDefaults } from "@/lib/products-page-defaults";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "ANALYST");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const row = await prisma.productsPageContent.findUnique({ where: { id: "products-page" } });

  const data = {
    hero:            row?.hero            ?? productsPageDefaults.hero,
    categories:      row?.categories      ?? productsPageDefaults.categories,
    productLines:    row?.productLines    ?? productsPageDefaults.productLines,
    banner:          row?.banner          ?? productsPageDefaults.banner,
    testimonial:     row?.testimonial     ?? productsPageDefaults.testimonial,
    editorialPanels: row?.editorialPanels ?? productsPageDefaults.editorialPanels,
    promises:        row?.promises        ?? productsPageDefaults.promises,
  };

  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const body = await req.json();

  const row = await prisma.productsPageContent.upsert({
    where: { id: "products-page" },
    update: {
      hero:            body.hero,
      categories:      body.categories,
      productLines:    body.productLines,
      banner:          body.banner,
      testimonial:     body.testimonial,
      editorialPanels: body.editorialPanels,
      promises:        body.promises,
    },
    create: {
      id: "products-page",
      hero:            body.hero            ?? productsPageDefaults.hero,
      categories:      body.categories      ?? productsPageDefaults.categories,
      productLines:    body.productLines    ?? productsPageDefaults.productLines,
      banner:          body.banner          ?? productsPageDefaults.banner,
      testimonial:     body.testimonial     ?? productsPageDefaults.testimonial,
      editorialPanels: body.editorialPanels ?? productsPageDefaults.editorialPanels,
      promises:        body.promises        ?? productsPageDefaults.promises,
    },
  });

  return NextResponse.json({ data: row });
}
