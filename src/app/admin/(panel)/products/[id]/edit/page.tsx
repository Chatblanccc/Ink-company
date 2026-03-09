import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package2 } from "lucide-react";

import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";
import { ProductForm, type ProductFormData } from "../../product-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const locale = await getAdminLocale();
  const isZh = locale === "zh";
  const prisma = getPrismaClient();

  if (!prisma) notFound();

  type Category = { id: string; slug: string; name: Record<string, string> };
  let categories: Category[] = [];
  let initial: ProductFormData | null = null;

  try {
    const [product, cats] = await Promise.all([
      prisma.product.findUnique({ where: { id }, include: { category: true } }),
      prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    if (!product) notFound();

    categories = cats.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name as Record<string, string>,
    }));

    initial = {
      id: product.id,
      slug: product.slug,
      categorySlug: product.category?.slug ?? "",
      title: product.title as { zh: string; en: string },
      summary: product.summary as { zh: string; en: string },
      heroTag: product.heroTag as { zh: string; en: string },
      seoTitle: product.seoTitle as { zh: string; en: string },
      seoDescription: product.seoDescription as { zh: string; en: string },
      applications: (product.applications as { zh: string; en: string }[]) ?? [],
      features: (product.features as { zh: string; en: string }[]) ?? [],
      specifications:
        (product.specifications as {
          label: { zh: string; en: string };
          value: { zh: string; en: string };
        }[]) ?? [],
      featured: product.featured,
      coverImage: product.coverImage ?? "",
      samplingSteps: (product.samplingSteps as { zh: string; en: string }[]) ?? [],
    };
  } catch {
    notFound();
  }

  if (!initial) notFound();

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
            {isZh ? "编辑产品" : "Edit product"}
          </h2>
          <p className="font-mono text-sm text-slate-400">{initial.slug}</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm initial={initial} categories={categories} locale={locale} />
    </div>
  );
}
