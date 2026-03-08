import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminT } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";

export default async function AdminArticlesPage() {
  const [locale, prisma] = [await getAdminLocale(), getPrismaClient()];
  const t = getAdminT(locale);

  type Row = { slug: string; title: Record<string, string>; category: Record<string, string>; publishedAt: string; featured: boolean };
  let articles: Row[] = [];

  if (prisma) {
    try {
      const rows = await prisma.article.findMany({
        orderBy: { publishedAt: "desc" },
      });
      articles = rows.map((a) => ({
        slug: a.slug,
        title: a.title as Record<string, string>,
        category: a.category as Record<string, string>,
        publishedAt: a.publishedAt.toISOString().slice(0, 10),
        featured: a.featured,
      }));
    } catch {
      // DB unavailable
    }
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          {t.articlesTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {articles.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            {locale === "zh" ? "暂无文章数据" : "No articles found"}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.colArticle}</TableHead>
                <TableHead>{t.colCategory}</TableHead>
                <TableHead>{t.colPublished}</TableHead>
                <TableHead>{t.colStatus}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.slug}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-950">
                        {locale === "zh" ? (article.title.zh ?? article.title.en) : article.title.en}
                      </p>
                      <p className="text-sm text-slate-500">{article.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {locale === "zh" ? (article.category.zh ?? article.category.en) : article.category.en}
                  </TableCell>
                  <TableCell>{article.publishedAt}</TableCell>
                  <TableCell>
                    <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">
                      {t.statusPublished}
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
