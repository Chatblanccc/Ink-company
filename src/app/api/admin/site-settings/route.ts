import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

const localizedText = z.object({ zh: z.string(), en: z.string() });

const settingsSchema = z.object({
  companyName: localizedText.optional(),
  address: z.record(z.string(), z.unknown()).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  defaultSeoTitle: localizedText.optional(),
  defaultSeoDescription: localizedText.optional(),
  heroTitle: localizedText.optional(),
  heroDescription: localizedText.optional(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "ANALYST");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const settings = await prisma.siteSetting.findUnique({ where: { id: "site" } });

  if (!settings) {
    return NextResponse.json({ error: "Settings not found" }, { status: 404 });
  }

  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAuth(req, "SUPER_ADMIN");
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

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const settings = await prisma.siteSetting.update({
    where: { id: "site" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: parsed.data as any,
  });

  return NextResponse.json(settings);
}
