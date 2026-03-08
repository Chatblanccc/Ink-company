import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "SALES");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const take = Math.min(Number(searchParams.get("limit") ?? 50), 100);
  const skip = Number(searchParams.get("offset") ?? 0);

  const [inquiries, total] = await Promise.all([
    prisma.inquiry.findMany({
      where: status ? { status: status as "NEW" | "QUALIFIED" | "FOLLOW_UP" | "CLOSED" } : undefined,
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.inquiry.count({
      where: status ? { status: status as "NEW" | "QUALIFIED" | "FOLLOW_UP" | "CLOSED" } : undefined,
    }),
  ]);

  return NextResponse.json({ inquiries, total });
}
