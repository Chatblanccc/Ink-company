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
      <ProductsPageForm initial={data} locale={locale} />
    </div>
  );
}
