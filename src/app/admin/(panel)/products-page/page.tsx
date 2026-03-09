import { LayoutTemplate } from "lucide-react";

import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";
import { productsPageDefaults, type ProductsPageData } from "@/lib/products-page-defaults";
import { ProductsPageForm } from "./products-page-form";

export default async function AdminProductsPageContent() {
  const locale = await getAdminLocale();
  const isZh = locale === "zh";
  const prisma = getPrismaClient();

  let data: ProductsPageData = productsPageDefaults;

  if (prisma) {
    try {
      const row = await prisma.productsPageContent.findUnique({ where: { id: "products-page" } });
      if (row) {
        data = {
          hero:            (row.hero            as ProductsPageData["hero"])            ?? productsPageDefaults.hero,
          categories:      (row.categories      as ProductsPageData["categories"])      ?? productsPageDefaults.categories,
          productLines:    (row.productLines    as ProductsPageData["productLines"])    ?? productsPageDefaults.productLines,
          banner:          (row.banner          as ProductsPageData["banner"])          ?? productsPageDefaults.banner,
          testimonial:     (row.testimonial     as ProductsPageData["testimonial"])     ?? productsPageDefaults.testimonial,
          editorialPanels: (row.editorialPanels as ProductsPageData["editorialPanels"]) ?? productsPageDefaults.editorialPanels,
          promises:        (row.promises        as ProductsPageData["promises"])        ?? productsPageDefaults.promises,
        };
      }
    } catch {
      // fall through to defaults
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutTemplate className="size-6 text-slate-500" />
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            {isZh ? "产品列表页内容管理" : "Products page content"}
          </h2>
          <p className="text-sm text-slate-500">
            {isZh
              ? "管理 /products 页面的所有板块文字与图片"
              : "Manage all sections, copy, and images on the /products page"}
          </p>
        </div>
      </div>

      <ProductsPageForm initial={data} locale={locale} />
    </div>
  );
}
