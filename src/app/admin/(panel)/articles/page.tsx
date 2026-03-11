import Link from "next/link";
import { FileText, Plus, Pencil, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";
import { ArticleDeleteButton } from "./article-delete-button";

const TYPE_LABELS = {
  NEWS:       { zh: "行业资讯", en: "News" },
  CASE_STUDY: { zh: "案例研究", en: "Case Study" },
  INSIGHT:    { zh: "深度洞察", en: "Insight" },
};

const TYPE_COLORS = {
  NEWS:       "bg-sky-100 text-sky-700 hover:bg-sky-100",
  CASE_STUDY: "bg-violet-100 text-violet-700 hover:bg-violet-100",
  INSIGHT:    "bg-amber-100 text-amber-700 hover:bg-amber-100",
} as const;

export default async function AdminArticlesPage() {
  const locale = await getAdminLocale();
  const isZh = locale === "zh";
  const prisma = getPrismaClient();

  type Row = {
    id: string;
    slug: string;
    type: keyof typeof TYPE_LABELS;
    title: Record<string, string>;
    category: Record<string, string>;
    publishedAt: string;
    featured: boolean;
  };
  let articles: Row[] = [];

  if (prisma) {
    try {
      const rows = await prisma.article.findMany({
        orderBy: { publishedAt: "desc" },
      });
      articles = rows.map((a) => ({
        id: a.id,
        slug: a.slug,
        type: a.type as keyof typeof TYPE_LABELS,
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="size-6 text-slate-500" />
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              {isZh ? "文章管理" : "Articles"}
            </h2>
            <p className="text-sm text-slate-500">
              {isZh ? `共 ${articles.length} 篇文章` : `${articles.length} articles`}
            </p>
          </div>
        </div>
        <Link href="/admin/articles/new">
          <Button className="gap-2 bg-sky-600 text-white hover:bg-sky-700">
            <Plus className="size-4" />
            {isZh ? "新建文章" : "New article"}
          </Button>
        </Link>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-950">
            {isZh ? "文章列表" : "Article list"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="mb-3 size-10 text-slate-300" />
              <p className="text-sm text-slate-400">
                {isZh
                  ? "暂无文章，点击右上角「新建文章」开始创作"
                  : 'No articles yet. Click "New article" to get started.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isZh ? "文章" : "Article"}</TableHead>
                  <TableHead>{isZh ? "类型" : "Type"}</TableHead>
                  <TableHead>{isZh ? "分类" : "Category"}</TableHead>
                  <TableHead>{isZh ? "发布日期" : "Published"}</TableHead>
                  <TableHead>{isZh ? "状态" : "Status"}</TableHead>
                  <TableHead className="text-right">{isZh ? "操作" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {article.featured && (
                          <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
                        )}
                        <div>
                          <p className="font-medium text-slate-950">
                            {isZh
                              ? (article.title.zh ?? article.title.en)
                              : (article.title.en ?? article.title.zh)}
                          </p>
                          <p className="font-mono text-xs text-slate-400">{article.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={TYPE_COLORS[article.type] ?? "bg-slate-100 text-slate-600"}>
                        {isZh
                          ? TYPE_LABELS[article.type]?.zh
                          : TYPE_LABELS[article.type]?.en}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-slate-600">
                        {isZh
                          ? (article.category.zh ?? article.category.en)
                          : (article.category.en ?? article.category.zh)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{article.publishedAt}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        {isZh ? "已发布" : "Published"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1.5 text-slate-600">
                            <Pencil className="size-3.5" />
                            {isZh ? "编辑" : "Edit"}
                          </Button>
                        </Link>
                        <ArticleDeleteButton id={article.id} locale={locale} />
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
