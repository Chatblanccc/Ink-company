import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

const patchSchema = z.object({
  status: z.enum(["NEW", "QUALIFIED", "FOLLOW_UP", "CLOSED"]),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const { error } = await requireAuth(req, "SALES");
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
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json(inquiry);
  } catch {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }
}
