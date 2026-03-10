import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

const schema = z.object({
  nameZh: z.string().min(1),
  nameEn: z.string().min(1),
  sortOrder: z.number().int().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;
  const { id } = await params;
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { nameZh, nameEn, sortOrder } = parsed.data;
  const category = await prisma.productCategory.update({
    where: { id },
    data: { name: { zh: nameZh, en: nameEn }, ...(sortOrder !== undefined && { sortOrder }) },
  });
  return NextResponse.json({ category });
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;
  const { id } = await params;
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0)
    return NextResponse.json(
      { error: `Cannot delete: ${count} product(s) still use this category` },
      { status: 409 },
    );
  await prisma.productCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
