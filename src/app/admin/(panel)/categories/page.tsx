import { Tag, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";
import { CategoriesClient } from "./categories-client";
import { ScenarioTagsClient } from "./scenario-tags-client";

const DEFAULT_TAGS = [
  { value: "packaging",  zh: "包装印刷", en: "Packaging" },
  { value: "labels",     zh: "标签印刷", en: "Labels" },
  { value: "publishing", zh: "出版印刷", en: "Publishing" },
  { value: "industrial", zh: "工业应用", en: "Industrial" },
  { value: "specialty",  zh: "特种功能", en: "Specialty" },
];

export default async function AdminCategoriesPage() {
  const locale = await getAdminLocale();
  const isZh = locale === "zh";
  const prisma = getPrismaClient();

  /* ── Product categories ───────────────────────────────────────────── */
  type Cat = { id: string; slug: string; name: Record<string, string>; sortOrder: number };
  let categories: Cat[] = [];
  if (prisma) {
    try {
      const rows = await prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" } });
      categories = rows.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name as Record<string, string>,
        sortOrder: c.sortOrder,
      }));
    } catch { /* DB unavailable */ }
  }

  /* ── Scenario tags ────────────────────────────────────────────────── */
  type Tag = { value: string; zh: string; en: string };
  let scenarioTags: Tag[] = DEFAULT_TAGS;
  if (prisma) {
    try {
      const settings = await prisma.siteSetting.findUnique({ where: { id: "site" } });
      const stored = settings?.productScenarioTags as Tag[] | null;
      if (stored?.length) scenarioTags = stored;
    } catch { /* DB unavailable */ }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Layers className="size-6 text-slate-500" />
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            {isZh ? "分类与标签管理" : "Categories & Tags"}
          </h2>
          <p className="text-sm text-slate-500">
            {isZh
              ? "管理产品的油墨类型分类，以及应用场景标签"
              : "Manage ink type categories and application scenario tags"}
          </p>
        </div>
      </div>

      {/* Product categories */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-slate-400" />
            <CardTitle className="text-base font-semibold text-slate-950">
              {isZh ? "油墨类型分类" : "Ink type categories"}
            </CardTitle>
          </div>
          <CardDescription>
            {isZh
              ? "这些分类出现在产品表单的「分类」下拉菜单中，也会在全部产品页面的筛选条上展示。"
              : "These appear in the product form's category dropdown and the filter strip on the all-products page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoriesClient categories={categories} isZh={isZh} />
        </CardContent>
      </Card>

      {/* Scenario tags */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Tag className="size-4 text-slate-400" />
            <CardTitle className="text-base font-semibold text-slate-950">
              {isZh ? "应用场景标签" : "Application scenario tags"}
            </CardTitle>
          </div>
          <CardDescription>
            {isZh
              ? "这些标签出现在产品编辑表单中可多选，供全部产品页面的场景筛选使用。修改后保存即生效。"
              : "Multi-select tags in the product edit form used for scenario filtering. Save changes to apply."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScenarioTagsClient initialTags={scenarioTags} isZh={isZh} />
        </CardContent>
      </Card>
    </div>
  );
}
