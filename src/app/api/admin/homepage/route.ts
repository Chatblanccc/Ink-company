import { NextResponse, type NextRequest } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { homepageDefaults } from "@/lib/homepage-defaults";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(homepageDefaults);
  }

  try {
    const row = await prisma.homepageContent.findUnique({ where: { id: "home" } });
    if (!row) {
      return NextResponse.json(homepageDefaults);
    }
    return NextResponse.json({
      hero: row.hero,
      device: row.device ?? homepageDefaults.device,
      benefits: row.benefits,
      bigPicture: row.bigPicture,
      specs: row.specs,
      testimonial: row.testimonial,
      howTo: row.howTo,
      cta: row.cta,
      images: row.images,
    });
  } catch {
    return NextResponse.json(homepageDefaults);
  }
}

export async function PUT(req: NextRequest) {
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

  const data = body as Record<string, unknown>;
  const allowed = ["hero", "device", "benefits", "bigPicture", "specs", "testimonial", "howTo", "cta", "images"];
  const payload: Record<string, unknown> = {};
  for (const key of allowed) {
    if (data[key] !== undefined) payload[key] = data[key];
  }

  try {
    await prisma.homepageContent.upsert({
      where: { id: "home" },
      create: { id: "home", ...homepageDefaults, ...payload },
      update: payload,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
