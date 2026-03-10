import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/api-auth";
import { getPrismaClient } from "@/lib/prisma";

const tagSchema = z.object({
  value: z.string().min(1).regex(/^[a-z0-9-]+$/),
  zh: z.string().min(1),
  en: z.string().min(1),
});

const schema = z.object({ tags: z.array(tagSchema) });

const DEFAULT_TAGS = [
  { value: "packaging",  zh: "包装印刷", en: "Packaging" },
  { value: "labels",     zh: "标签印刷", en: "Labels" },
  { value: "publishing", zh: "出版印刷", en: "Publishing" },
  { value: "industrial", zh: "工业应用", en: "Industrial" },
  { value: "specialty",  zh: "特种功能", en: "Specialty" },
];

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(req, "ANALYST");
  if (error) return error;
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ tags: DEFAULT_TAGS });
  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: "site" } });
    const tags = settings?.productScenarioTags as typeof DEFAULT_TAGS | null;
    return NextResponse.json({ tags: tags?.length ? tags : DEFAULT_TAGS });
  } catch {
    return NextResponse.json({ tags: DEFAULT_TAGS });
  }
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAuth(req, "EDITOR");
  if (error) return error;
  const prisma = getPrismaClient();
  if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  await prisma.siteSetting.upsert({
    where: { id: "site" },
    update: { productScenarioTags: parsed.data.tags },
    create: {
      id: "site",
      companyName: { zh: "", en: "" },
      address: { zh: "", en: "" },
      phone: "",
      email: "",
      defaultSeoTitle: { zh: "", en: "" },
      defaultSeoDescription: { zh: "", en: "" },
      heroTitle: { zh: "", en: "" },
      heroDescription: { zh: "", en: "" },
      productScenarioTags: parsed.data.tags,
    },
  });
  return NextResponse.json({ ok: true });
}
