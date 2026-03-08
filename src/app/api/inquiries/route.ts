import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getPrismaClient } from "@/lib/prisma";

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  productType: z.string().min(1),
  volume: z.string().min(1),
  message: z.string().min(10),
  language: z.string().default("en"),
});

export async function POST(req: NextRequest) {
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

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { name, email, productType, volume, message, language } = parsed.data;

  const inquiry = await prisma.inquiry.create({
    data: {
      name,
      email,
      company: "",
      phone: "",
      market: productType,
      source: volume,
      message,
      language,
      status: "NEW",
    },
  });

  return NextResponse.json({ id: inquiry.id }, { status: 201 });
}
