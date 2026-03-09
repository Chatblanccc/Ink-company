import Link from "next/link";
import { Package2, Plus, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminT } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";
import { ProductDeleteButton } from "./product-delete-button";

export default async function AdminProductsPage() {
  const [locale, prisma] = [await getAdminLocale(), getPrismaClient()];
  const t = getAdminT(locale);
  const isZh = locale === "zh";

  type Row = {
    id: string;
    slug: string;
    title: Record<string, string>;
    category: Record<string, string>;
    featured: boolean;
  };
  let products: Row[] = [];

  if (prisma) {
    try {
      const rows = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "asc" },
      });
      products = rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title as Record<string, string>,
        category: (p.category?.name ?? {}) as Record<string, string>,
        featured: p.featured,
      }));
    } catch {
      // DB unavailable
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package2 className="size-6 text-slate-500" />
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{t.productsTitle}</h2>
            <p className="text-sm text-slate-500">
              {isZh ? `共 ${products.length} 个产品` : `${products.length} products`}
            </p>
          </div>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2 bg-sky-600 text-white hover:bg-sky-700">
            <Plus className="size-4" />
            {isZh ? "新建产品" : "New product"}
          </Button>
        </Link>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-950">
            {isZh ? "产品列表" : "Product list"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package2 className="mb-3 size-10 text-slate-300" />
              <p className="text-sm text-slate-400">
                {isZh ? "暂无产品数据，点击右上角新建产品" : 'No products yet. Click "New product" to get started.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.colProduct}</TableHead>
                  <TableHead>{t.colCategory}</TableHead>
                  <TableHead>{isZh ? "推荐" : "Featured"}</TableHead>
                  <TableHead className="text-right">{isZh ? "操作" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-950">
                          {isZh ? (product.title.zh ?? product.title.en) : product.title.en}
                        </p>
                        <p className="font-mono text-xs text-slate-400">{product.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-slate-600">
                        {isZh ? (product.category.zh ?? product.category.en) : product.category.en}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.featured ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          {isZh ? "推荐" : "Featured"}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1.5 text-slate-600">
                            <Pencil className="size-3.5" />
                            {isZh ? "编辑" : "Edit"}
                          </Button>
                        </Link>
                        <ProductDeleteButton id={product.id} locale={locale} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
