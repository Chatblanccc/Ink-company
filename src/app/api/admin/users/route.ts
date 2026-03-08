import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

const createSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["SUPER_ADMIN", "EDITOR", "SALES", "ANALYST"]).default("EDITOR"),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "SUPER_ADMIN");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { password, ...rest } = parsed.data;
  const passwordHash = await hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { ...rest, passwordHash },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }
}
