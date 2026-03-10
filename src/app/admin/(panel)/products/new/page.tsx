import Link from "next/link";
import { ArrowLeft, Package2 } from "lucide-react";

import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const locale = await getAdminLocale();
  const isZh = locale === "zh";
  const prisma = getPrismaClient();

  type Category = { id: string; slug: string; name: Record<string, string> };
  type ScenarioTag = { value: string; zh: string; en: string };

  const DEFAULT_SCENARIO_TAGS: ScenarioTag[] = [
    { value: "packaging",  zh: "包装印刷", en: "Packaging" },
    { value: "labels",     zh: "标签印刷", en: "Labels" },
    { value: "publishing", zh: "出版印刷", en: "Publishing" },
    { value: "industrial", zh: "工业应用", en: "Industrial" },
    { value: "specialty",  zh: "特种功能", en: "Specialty" },
  ];

  let categories: Category[] = [];
  let scenarioTags: ScenarioTag[] = DEFAULT_SCENARIO_TAGS;

  if (prisma) {
    try {
      const [catRows, settings] = await Promise.all([
        prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.siteSetting.findUnique({ where: { id: "site" } }),
      ]);
      categories = catRows.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name as Record<string, string>,
      }));
      const stored = settings?.productScenarioTags as ScenarioTag[] | null;
      if (stored?.length) scenarioTags = stored;
    } catch {
      // DB unavailable
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          {isZh ? "返回产品列表" : "Back to products"}
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Package2 className="size-6 text-slate-500" />
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            {isZh ? "新建产品" : "New product"}
          </h2>
          <p className="text-sm text-slate-500">
            {isZh ? "填写中英双语内容，保存后立即发布到前台" : "Fill in bilingual content. It publishes immediately."}
          </p>
        </div>
      </div>

      {/* Form */}
      <ProductForm categories={categories} availableScenarioTags={scenarioTags} locale={locale} />
    </div>
  );
}
