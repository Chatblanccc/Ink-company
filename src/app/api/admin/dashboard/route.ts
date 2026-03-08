import { NextResponse, type NextRequest } from "next/server";

import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "ANALYST");
  if (error) return error;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const [
    totalInquiries,
    newInquiries,
    qualifiedInquiries,
    totalProducts,
    totalArticles,
    recentInquiries,
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.count({ where: { status: "QUALIFIED" } }),
    prisma.product.count(),
    prisma.article.count(),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        company: true,
        email: true,
        market: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    metrics: {
      totalInquiries,
      newInquiries,
      qualifiedInquiries,
      totalProducts,
      totalArticles,
    },
    recentInquiries,
  });
}
