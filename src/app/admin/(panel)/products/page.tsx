import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminT } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const [locale, prisma] = [await getAdminLocale(), getPrismaClient()];
  const t = getAdminT(locale);

  type Row = { slug: string; title: Record<string, string>; category: Record<string, string>; seoTitle: Record<string, string> };
  let products: Row[] = [];

  if (prisma) {
    try {
      const rows = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "asc" },
      });
      products = rows.map((p) => ({
        slug: p.slug,
        title: p.title as Record<string, string>,
        category: (p.category?.name ?? {}) as Record<string, string>,
        seoTitle: p.seoTitle as Record<string, string>,
      }));
    } catch {
      // DB unavailable
    }
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          {t.productsTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            {locale === "zh" ? "暂无产品数据" : "No products found"}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.colProduct}</TableHead>
                <TableHead>{t.colCategory}</TableHead>
                <TableHead>{t.colLocale}</TableHead>
                <TableHead>{t.colSeo}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.slug}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-950">
                        {locale === "zh" ? (product.title.zh ?? product.title.en) : product.title.en}
                      </p>
                      <p className="text-sm text-slate-500">{product.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {locale === "zh" ? (product.category.zh ?? product.category.en) : product.category.en}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">ZH / EN</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      {locale === "zh" ? "元数据 + 结构化数据" : "Metadata + schema"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
